import { createDbSession, createSessionToken, csrfCookieOptions, getSessionFromRequest, sessionCookieOptions } from '@/lib/auth';
import { SESSION_COOKIE_NAME, CSRF_COOKIE_NAME } from '@/lib/auth-shared';
import { connectToDatabase } from '@/lib/db';
import {
    createAdminPostCategory,
    createAdminMenuItem,
    createAdminPost,
    createAdminSection,
    createAdminStoreItem,
    deleteAdminPostCategory,
    deleteAdminMenuItem,
    deleteAdminPost,
    deleteAdminSection,
    deleteAdminStoreItem,
    getAdminMenuBundleFromStore,
    getAdminMenuTargetOptionsFromStore,
    getAdminPostCategoriesFromStore,
    getAdminPostsFromStore,
    getAdminStoreItemsFromStore,
    getPublicMenusFromStore,
    getPublicPostBySlugFromStore,
    getPublicPostsFromStore,
    getPublicSectionsFromStore,
    getPublicStoreItemsFromStore,
    updateAdminMenuItem,
    updateAdminPostCategory,
    updateAdminPost,
    updateAdminSection,
    updateAdminStoreItem,
} from '@/lib/template-cms-repository';
import { getDemoHomePayload, getDemoOrganizationAvailability, getDemoOrganizationBySlug, getDemoOrganizations, demoHighlights, demoMatches, demoStoreItems } from '@/services/api/publicDemoData';
import { User } from '@/models/User';
import { hashSync } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 12;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

const defaultPostCanonical = (slug: string) => `/bai-viet/${slug}`;

const permissionCodes = [
    'OVERVIEW_VIEW',
    'POST_VIEW',
    'MARKET_VIEW',
    'USER_VIEW',
    'ROLE_VIEW',
    'MENU_VIEW',
    'SECTION_VIEW',
];

const demoAccounts = [
    {
        email: String(process.env.ADMIN_USERNAME || 'superadmin@gmail.com').trim().toLowerCase(),
        password: String(process.env.ADMIN_PASSWORD || 'Superadmin@123'),
        name: 'SV Super Admin',
        role: 'admin',
        isSuperAdmin: true,
    },
    {
        email: 'manager.org@sportverse.test',
        password: 'Password@123',
        name: 'Org Account Manager',
        role: 'admin',
        isSuperAdmin: false,
    },
    {
        email: 'operator.org@sportverse.test',
        password: 'Password@123',
        name: 'Booking Operator',
        role: 'admin',
        isSuperAdmin: false,
    },
    {
        email: 'member.org@sportverse.test',
        password: 'Password@123',
        name: 'Org Member',
        role: 'guest',
        isSuperAdmin: false,
    },
];

const nowIso = () => new Date().toISOString();
const futureIso = (seconds: number) => new Date(Date.now() + seconds * 1000).toISOString();

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });
const ok = (data: unknown, message = 'success') => json({ success: true, message, data });
const fail = (message: string, status = 400, data: unknown = null) => json({ success: false, message, data }, status);

function getSecret() {
    const secret = process.env.AUTH_SECRET || 'sportverse-fullstack-local-secret-change-me';
    return new TextEncoder().encode(secret);
}

function normalizeBearerToken(request: NextRequest) {
    return (request.headers.get('authorization') || '')
        .replace(/^Bearer\s+/i, '')
        .replace(/^"(.*)"$/, '$1')
        .trim();
}

async function createPublicToken(payload: Record<string, unknown>, expiresInSeconds: number) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${expiresInSeconds}s`)
        .sign(getSecret());
}

async function verifyPublicToken(token: string) {
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload;
    } catch {
        return null;
    }
}

async function ensureSportverseUser(account: typeof demoAccounts[number]) {
    await connectToDatabase();

    const existing = await User.findOne({ username: account.email });
    if (existing) {
        return existing;
    }

    return User.create({
        username: account.email,
        fullName: account.name,
        phone: '0900000000',
        role: account.role === 'admin' ? 'ADMIN' : 'USER',
        passwordHash: hashSync(account.password, 10),
    });
}

function toLdpUserInfo(account: typeof demoAccounts[number], id: string) {
    return {
        id,
        full_name: account.name,
        name: account.name,
        email: account.email,
        role: account.role,
        is_super_admin: account.isSuperAdmin,
        organization_id: account.isSuperAdmin ? null : 9001,
        organization_name: account.isSuperAdmin ? null : 'SV Arena Quận 7',
        permissionCodes: account.role === 'admin' ? permissionCodes : [],
    };
}

async function login(request: NextRequest) {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || body.username || body.account || '').trim().toLowerCase();
    const password = String(body.password || '');
    const account = demoAccounts.find((item) => item.email === email && item.password === password);

    if (!account) {
        return fail('email_or_password_not_correct', 401, 'ACCOUNT_NOT_FOUND');
    }

    let userId = `demo:${account.email}`;
    let sessionId = crypto.randomUUID();

    try {
        const user = await ensureSportverseUser(account);
        const session = await createDbSession({
            userId: String(user._id),
            ipAddress: request.headers.get('x-forwarded-for') || 'local',
            userAgent: request.headers.get('user-agent') || undefined,
        });
        userId = String(user._id);
        sessionId = session.id;
    } catch {
        // MongoDB-backed CMS sessions are optional for the LDP-compatible API.
        // When MongoDB is not running, the app still works with signed JWT tokens.
    }

    const sessionToken = await createSessionToken({
        id: userId,
        username: account.email,
        role: account.role === 'admin' ? 'ADMIN' : 'USER',
    }, sessionId);
    const accessToken = await createPublicToken({ sub: userId, email: account.email, role: account.role, sid: sessionId, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
    const refreshToken = await createPublicToken({ sub: userId, email: account.email, role: account.role, sid: sessionId, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

    const response = ok({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
        user_info: toLdpUserInfo(account, userId),
    }, 'success');

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
    response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), csrfCookieOptions());
    return response;
}

async function refreshToken(request: NextRequest) {
    const body = await request.json().catch(() => ({}));
    const refreshTokenValue = String(body.refresh_token || '').replace(/^"(.*)"$/, '$1');
    const payload = await verifyPublicToken(refreshTokenValue);

    if (!payload || payload.type !== 'refresh' || !payload.email) {
        return fail('not_found_token', 401, 'NOT_FOUND_TOKEN');
    }

    const payloadEmail = String(payload.email || '');
    const account = demoAccounts.find((item) => item.email === payloadEmail);
    if (!account) {
        return fail('not_found_token', 401, 'ACCOUNT_NOT_FOUND');
    }

    const accessToken = await createPublicToken({ sub: payload.sub, email: account.email, role: account.role, sid: payload.sid, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
    const nextRefreshToken = await createPublicToken({ sub: payload.sub, email: account.email, role: account.role, sid: payload.sid, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

    return ok({
        access_token: accessToken,
        refresh_token: nextRefreshToken,
        expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
        user_info: toLdpUserInfo(account, String(payload.sub || '')),
    }, 'success');
}

async function requireSportverseAdmin(request: NextRequest) {
    try {
        const session = await getSessionFromRequest(request);
        if (session?.role === 'ADMIN') {
            return session;
        }
    } catch {
        // Fall back to the LDP bearer token when MongoDB session validation is unavailable.
    }

    const payload = await verifyPublicToken(normalizeBearerToken(request));
    if (!payload || payload.type !== 'access' || payload.role !== 'admin') {
        return null;
    }

    return payload;
}

function getAdminOrganizations() {
    return getDemoOrganizations().map((organization, index) => ({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        status: 'active',
        address: organization.address,
        manager_name: index === 0 ? 'Org Account Manager' : 'SPORTVERSE Operator',
        manager_email: index === 0 ? 'manager.org@sportverse.test' : 'operator.org@sportverse.test',
        users_count: index === 0 ? 5 : 2,
        venues_count: index === 0 ? 2 : 1,
        teams_count: index === 0 ? 3 : 1,
        bookings_count: index === 0 ? 4 : 1,
    }));
}

function getAdminVenues() {
    const organizations = ['sv-arena-quan-7', 'verse-field-thao-dien', 'pickle-hub-binh-thanh', 'northside-sport-complex']
        .map((slug) => getDemoOrganizationBySlug(slug))
        .filter(Boolean);

    return organizations.flatMap((organization) => (organization?.venues || []).map((venue, index) => ({
        id: venue.id,
        organization_name: organization?.name || null,
        name: venue.name,
        sport_type: venue.sport_type,
        venue_type: venue.venue_type,
        field_format: venue.field_format,
        status: 'active',
        is_bookable: true,
        capacity: venue.capacity,
        default_duration_minutes: venue.default_duration_minutes,
        default_price: venue.default_price,
        currency: venue.currency,
        bookings_count: index + 1,
        next_booking_at: demoMatches[index]?.starts_at || null,
    })));
}

function getAdminBookings() {
    return demoMatches.map((match, index) => ({
        id: 10000 + match.id,
        organization_name: match.organization_name,
        venue_name: match.venue_name,
        user_name: index === 0 ? 'Org Member' : 'Booking Operator',
        user_email: index === 0 ? 'member.org@sportverse.test' : 'operator.org@sportverse.test',
        team_name: match.team_name,
        starts_at: match.starts_at,
        ends_at: match.ends_at,
        status: index === 0 ? 'pending' : 'confirmed',
        payment_status: index === 0 ? 'unpaid' : 'paid',
        total_amount: index === 0 ? 470000 : 350000 + index * 100000,
        currency: 'VND',
    }));
}

function getAdminUsers() {
    return demoAccounts.map((account, index) => ({
        id: index + 1,
        name: account.name,
        email: account.email,
        organization_name: account.isSuperAdmin ? null : 'SV Arena Quận 7',
        role_name: account.isSuperAdmin ? 'Super Admin' : account.role === 'admin' ? 'Organization Operator' : 'Member',
        role_code: account.isSuperAdmin ? 'super_admin' : account.role === 'admin' ? 'organization_admin' : 'member',
        is_super_admin: account.isSuperAdmin,
        permission_codes_count: account.role === 'admin' ? permissionCodes.length : 0,
    }));
}

function getAdminRoles() {
    return [
        {
            id: 1,
            organization_name: null,
            name: 'Super Admin',
            code: 'super_admin',
            is_system: true,
            users_count: 1,
            permissions_count: permissionCodes.length,
            permissions_preview: permissionCodes.slice(0, 4),
        },
        {
            id: 2,
            organization_name: 'SV Arena Quận 7',
            name: 'Organization Owner',
            code: 'owner',
            is_system: true,
            users_count: 1,
            permissions_count: permissionCodes.length,
            permissions_preview: permissionCodes.slice(0, 4),
        },
        {
            id: 3,
            organization_name: 'SV Arena Quận 7',
            name: 'Booking Operator',
            code: 'booking_operator',
            is_system: false,
            users_count: 1,
            permissions_count: 4,
            permissions_preview: ['OVERVIEW_VIEW', 'ORGANIZATION_VIEW', 'BOOKING_VIEW', 'BOOKING_MANAGE'],
        },
    ];
}

async function getAdminPosts() {
    const [posts, categories] = await Promise.all([
        getAdminPostsFromStore(),
        getAdminPostCategoriesFromStore(),
    ]);
    return { posts, categories };
}

async function getAdminStoreItems() {
    return getAdminStoreItemsFromStore();
}

async function getAdminMenus() {
    const [bundle, targetOptions] = await Promise.all([
        getAdminMenuBundleFromStore(),
        getAdminMenuTargetOptionsFromStore(),
    ]);
    return { menus: bundle.menus, ...targetOptions };
}

async function getAdminSections() {
    const bundle = await getAdminMenuBundleFromStore();
    return { sections: bundle.sections };
}

async function getPublicHomePayload() {
    const fallback = getDemoHomePayload();
    const [posts, homeSections, headerMenu, footerMenu, storeItems] = await Promise.all([
        getPublicPostsFromStore(3),
        getPublicSectionsFromStore('home'),
        getPublicMenusFromStore('header'),
        getPublicMenusFromStore('footer'),
        getPublicStoreItemsFromStore(8),
    ]);

    return {
        ...fallback,
        sections: {
            ...fallback.sections,
            store_items: storeItems.length > 0 ? storeItems : fallback.sections.store_items,
        },
        summary: {
            ...fallback.summary,
            store_items_count: Math.max(storeItems.length, fallback.summary.store_items_count),
        },
        template: {
            posts,
            home_sections: homeSections,
            header_menu: headerMenu,
            footer_menu: footerMenu,
        },
    };
}

function getAdminOverview() {
    const organizations = getAdminOrganizations();
    const venues = getAdminVenues();
    const bookings = getAdminBookings();

    return {
        scope: {
            workspace_organization: null,
        },
        metrics: {
            organizations_count: organizations.length,
            venues_count: venues.length,
            bookings_count: bookings.length,
            pending_bookings_count: bookings.filter((booking) => booking.status === 'pending').length,
            confirmed_bookings_count: bookings.filter((booking) => booking.status === 'confirmed').length,
            users_count: getAdminUsers().length,
            roles_count: getAdminRoles().length,
            matches_count: demoMatches.length,
            monthly_revenue: bookings.reduce((total, booking) => total + Number(booking.total_amount || 0), 0),
            currency: 'VND',
        },
        recent_bookings: bookings.slice(0, 5),
        organizations: organizations.map(({ id, name, slug, status, users_count, venues_count, teams_count }) => ({ id, name, slug, status, users_count, venues_count, teams_count })),
    };
}

async function handleGet(request: NextRequest, path: string[]) {
    const [segment, second, third] = path;
    const searchParams = request.nextUrl.searchParams;

    if (segment === 'health') {
        return ok({ status: 'ok', app: 'ldp-cms-nextjs-full', now: nowIso() });
    }

    if (segment === 'home') {
        return ok(await getPublicHomePayload());
    }

    if (segment === 'posts') {
        if (second) {
            const post = await getPublicPostBySlugFromStore(second);
            return post ? ok(post) : fail('post_not_found', 404);
        }

        const limit = Number(searchParams.get('limit') || 0) || undefined;
        return ok(await getPublicPostsFromStore(limit));
    }

    if (segment === 'menus') {
        const location = searchParams.get('location') as 'header' | 'footer' | 'account' | null;
        return ok(await getPublicMenusFromStore(location || undefined));
    }

    if (segment === 'sections') {
        const page = searchParams.get('page') as 'home' | 'venue_detail' | 'match_listing' | 'store' | null;
        return ok(await getPublicSectionsFromStore(page || undefined));
    }

    if (segment === 'organizations') {
        if (!second) {
            const perPage = Number(searchParams.get('per_page') || 0) || undefined;
            return ok(getDemoOrganizations(perPage));
        }

        if (third === 'availability') {
            const data = getDemoOrganizationAvailability(second, {
                date: searchParams.get('date') || new Date().toISOString().slice(0, 10),
                start_time: searchParams.get('start_time') || '19:00',
                end_time: searchParams.get('end_time') || '20:30',
                sport_type: searchParams.get('sport_type') || undefined,
                field_format: searchParams.get('field_format') || undefined,
            });
            return data ? ok(data) : fail('organization_not_found', 404);
        }

        const organization = getDemoOrganizationBySlug(second);
        return organization ? ok(organization) : fail('organization_not_found', 404);
    }

    if (segment === 'matches') {
        const limit = Number(searchParams.get('limit') || demoMatches.length);
        return ok(demoMatches.slice(0, limit));
    }

    if (segment === 'highlights') {
        const limit = Number(searchParams.get('limit') || demoHighlights.length);
        return ok(demoHighlights.slice(0, limit));
    }

    if (segment === 'store-items') {
        const limit = Number(searchParams.get('limit') || demoStoreItems.length);
        return ok(await getPublicStoreItemsFromStore(limit));
    }

    if (segment === 'admin') {
        const admin = await requireSportverseAdmin(request);
        if (!admin) {
            return fail('missing_token', 401, 'MISSING_TOKEN');
        }

        if (second === 'overview') return ok(getAdminOverview());
        if (second === 'organizations') return ok({ organizations: getAdminOrganizations() });
        if (second === 'venues') return ok({ venues: getAdminVenues() });
        if (second === 'bookings') return ok({ bookings: getAdminBookings() });
        if (second === 'users') return ok({ users: getAdminUsers() });
        if (second === 'roles') return ok({ roles: getAdminRoles() });
        if (second === 'posts') return ok(await getAdminPosts());
        if (second === 'post-categories') return ok({ categories: await getAdminPostCategoriesFromStore() });
        if (second === 'store-items') return ok({ store_items: await getAdminStoreItems() });
        if (second === 'menus') return ok(await getAdminMenus());
        if (second === 'sections') return ok(await getAdminSections());
    }

    return fail('not_found', 404);
}

async function handlePost(request: NextRequest, path: string[]) {
    const [segment, second, third] = path;

    if (segment === 'user' && second === 'login') return login(request);
    if (segment === 'user' && second === 'register') return login(request);
    if (segment === 'user' && second === 'refresh-token') return refreshToken(request);
    if (segment === 'user' && second === 'forgotPassword') return ok({ accepted: true }, 'success');
    if (segment === 'user' && second === 'logout') return ok({ revoked: true }, 'success');

    if (segment === 'bookings' && !second) {
        const body = await request.json().catch(() => ({}));
        return ok({
            id: Date.now(),
            ...body,
            status: 'pending',
            payment_status: 'unpaid',
            created_at: nowIso(),
        }, 'success');
    }

    if (segment === 'bookings' && third === 'cancel') {
        return ok({ id: Number(second), status: 'cancelled', cancelled_at: nowIso() }, 'success');
    }

    if (segment === 'admin') {
        const admin = await requireSportverseAdmin(request);
        if (!admin) {
            return fail('missing_token', 401, 'MISSING_TOKEN');
        }

        const body = await request.json().catch(() => ({}));

        if (second === 'posts') {
            const slug = String(body.slug || '');
            const created = await createAdminPost({
                title: String(body.title || ''),
                slug,
                category: String(body.category || ''),
                excerpt: String(body.excerpt || ''),
                description: String(body.description || body.excerpt || ''),
                author_name: String(body.author_name || 'SV Super Admin'),
                status: body.status || 'draft',
                published_at: body.published_at || null,
                featured: Boolean(body.featured),
                placement: body.placement || 'news_feed',
                keywords: String(body.keywords || ''),
                meta_title: String(body.meta_title || body.title || ''),
                meta_description: String(body.meta_description || body.excerpt || ''),
                canonical: String(body.canonical || defaultPostCanonical(slug)),
                index: body.index ?? true,
                follow: body.follow ?? true,
            });
            return ok(created, 'success');
        }

        if (second === 'post-categories') {
            const name = String(body.name || '').trim();
            if (!name) {
                return fail('fill_required_infomation', 422);
            }

            const categories = await getAdminPostCategoriesFromStore();
            const normalizedName = name.toLowerCase();
            const existed = categories.some((item) => item.name.trim().toLowerCase() === normalizedName);
            if (existed) {
                return fail('name_existed', 422);
            }

            const created = await createAdminPostCategory({
                name,
                sort_order: Number(body.sort_order || 0) || undefined,
                status: body.status || 'active',
            });
            return ok(created, 'success');
        }

        if (second === 'store-items') {
            const created = await createAdminStoreItem({
                name: String(body.name || ''),
                sku: String(body.sku || ''),
                category: String(body.category || ''),
                type: body.type || 'product',
                organization_name: body.organization_name || null,
                description: body.description || null,
                price: Number(body.price || 0),
                unit: String(body.unit || ''),
                stock_quantity: body.stock_quantity ?? null,
                status: body.status || 'draft',
                featured: Boolean(body.featured),
            });
            return ok(created, 'success');
        }

        if (second === 'sections') {
            const createdSection = await createAdminSection({
                page: body.page || 'home',
                name: String(body.name || ''),
                type: body.type || 'hero',
                status: body.status || 'draft',
                display_order: Number(body.display_order || 1),
                summary: String(body.summary || ''),
            });
            return ok(createdSection, 'success');
        }

        if (second === 'menus') {
            if (body.entity === 'section') {
                const createdSection = await createAdminSection({
                    page: body.page || 'home',
                    name: String(body.name || ''),
                    type: body.type || 'hero',
                    status: body.status || 'draft',
                    display_order: Number(body.display_order || 1),
                    summary: String(body.summary || ''),
                });
                return ok(createdSection, 'success');
            }

            const createdMenu = await createAdminMenuItem({
                title: String(body.title || ''),
                path: String(body.path || '/'),
                location: body.location || 'header',
                parent_id: body.parent_id ?? null,
                sort_order: Number(body.sort_order || 1),
                badge: body.badge || null,
                page_type: body.page_type || 'custom',
                page_ref: body.page_ref ?? null,
                custom_page: body.custom_page || null,
            });
            return ok(createdMenu, 'success');
        }
    }

    return fail('not_found', 404);
}

async function handlePatch(request: NextRequest, path: string[]) {
    const [segment, second, third, fourth] = path;

    if (segment !== 'admin') {
        return fail('not_found', 404);
    }

    const admin = await requireSportverseAdmin(request);
    if (!admin) {
        return fail('missing_token', 401, 'MISSING_TOKEN');
    }

    const body = await request.json().catch(() => ({}));

    if (second === 'posts' && third) {
        const slug = String(body.slug || '');
        const updated = await updateAdminPost(Number(third), {
            title: String(body.title || ''),
            slug,
            category: String(body.category || ''),
            excerpt: String(body.excerpt || ''),
            description: String(body.description || body.excerpt || ''),
            author_name: String(body.author_name || 'SV Super Admin'),
            status: body.status || 'draft',
            published_at: body.published_at || null,
            featured: Boolean(body.featured),
            placement: body.placement || 'news_feed',
            keywords: String(body.keywords || ''),
            meta_title: String(body.meta_title || body.title || ''),
            meta_description: String(body.meta_description || body.excerpt || ''),
            canonical: String(body.canonical || defaultPostCanonical(slug)),
            index: body.index ?? true,
            follow: body.follow ?? true,
        });
        return updated ? ok(updated, 'success') : fail('record_not_found', 404);
    }

    if (second === 'post-categories' && third) {
        const name = String(body.name || '').trim();
        if (!name) {
            return fail('fill_required_infomation', 422);
        }

        const categories = await getAdminPostCategoriesFromStore();
        const normalizedName = name.toLowerCase();
        const currentId = Number(third);
        const existed = categories.some((item) => item.id !== currentId && item.name.trim().toLowerCase() === normalizedName);
        if (existed) {
            return fail('name_existed', 422);
        }

        const updated = await updateAdminPostCategory(Number(third), {
            name,
            sort_order: Number(body.sort_order || 0) || undefined,
            status: body.status || 'active',
        });
        return updated ? ok(updated, 'success') : fail('record_not_found', 404);
    }

    if (second === 'store-items' && third) {
        const updated = await updateAdminStoreItem(Number(third), {
            name: String(body.name || ''),
            sku: String(body.sku || ''),
            category: String(body.category || ''),
            type: body.type || 'product',
            organization_name: body.organization_name || null,
            description: body.description || null,
            price: Number(body.price || 0),
            unit: String(body.unit || ''),
            stock_quantity: body.stock_quantity ?? null,
            status: body.status || 'draft',
            featured: Boolean(body.featured),
        });
        return updated ? ok(updated, 'success') : fail('record_not_found', 404);
    }

    if ((second === 'menus' && third === 'sections' && fourth) || (second === 'sections' && third)) {
        const sectionId = Number(second === 'sections' ? third : fourth);
        const updatedSection = await updateAdminSection(sectionId, {
            page: body.page || 'home',
            name: String(body.name || ''),
            type: body.type || 'hero',
            status: body.status || 'draft',
            display_order: Number(body.display_order || 1),
            summary: String(body.summary || ''),
        });
        return updatedSection ? ok(updatedSection, 'success') : fail('record_not_found', 404);
    }

    if (second === 'menus' && third) {
        const updated = await updateAdminMenuItem(Number(third), {
            title: String(body.title || ''),
            path: String(body.path || '/'),
            location: body.location || 'header',
            parent_id: body.parent_id ?? null,
            sort_order: Number(body.sort_order || 1),
            badge: body.badge || null,
            page_type: body.page_type || 'custom',
            page_ref: body.page_ref ?? null,
            custom_page: body.custom_page || null,
        });
        return updated ? ok(updated, 'success') : fail('record_not_found', 404);
    }

    return fail('not_found', 404);
}

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    const params = await context.params;
    return handleGet(request, params.path || []);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    const params = await context.params;
    return handlePost(request, params.path || []);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    const params = await context.params;
    return handlePatch(request, params.path || []);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    const params = await context.params;
    const [segment, second, third, fourth] = params.path || [];

    if (segment === 'bookings' && second) {
        return ok({ id: Number(second), status: 'deleted', deleted_at: nowIso() }, 'success');
    }

    if (segment === 'admin') {
        const admin = await requireSportverseAdmin(request);
        if (!admin) {
            return fail('missing_token', 401, 'MISSING_TOKEN');
        }

        if (second === 'posts' && third) {
            const deleted = await deleteAdminPost(Number(third));
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }

        if (second === 'post-categories' && third) {
            const deleted = await deleteAdminPostCategory(Number(third));
            if (!deleted) {
                return fail('record_not_found', 404);
            }

            const reassignedCount = Number((deleted as any)?.reassigned_count || 0);
            const message = reassignedCount > 0
                ? `Đã xóa danh mục và chuyển ${reassignedCount} bài viết sang "Chưa phân loại".`
                : 'Đã xóa danh mục thành công.';

            return ok(deleted, message);
        }

        if (second === 'store-items' && third) {
            const deleted = await deleteAdminStoreItem(Number(third));
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }

        if ((second === 'menus' && third === 'sections' && fourth) || (second === 'sections' && third)) {
            const deleted = await deleteAdminSection(Number(second === 'sections' ? third : fourth));
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }

        if (second === 'menus' && third) {
            const deleted = await deleteAdminMenuItem(Number(third));
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }
    }

    return fail('not_found', 404);
}
