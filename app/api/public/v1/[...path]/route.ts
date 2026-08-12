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
import { Customer } from '@/models/Customer';
import { compareSync, hashSync } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { createUserSchema, updateUserSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

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
const isDuplicateKeyError = (error: any) => Number(error?.code) === 11000;

const normalizePhone = (value: unknown) => String(value || '').replace(/\D+/g, '').trim();
const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const customerStatuses = ['new', 'contacted', 'closed'] as const;
type CustomerStatus = typeof customerStatuses[number];

const normalizeCustomerStatus = (value: unknown, fallback: CustomerStatus = 'new'): CustomerStatus => {
    const normalized = String(value || '').trim().toLowerCase();
    return (customerStatuses as readonly string[]).includes(normalized) ? (normalized as CustomerStatus) : fallback;
};

const revalidatePublicCache = () => {
    try {
        revalidateTag('all', 'max');
    } catch {
        // no-op
    }
};

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

    return User.findOne({ username: account.email });
}

function toLdpUserInfo(account: typeof demoAccounts[number], id: string, profile?: { fullName?: string | null; avatar?: string | null }) {
    return {
        id,
        full_name: profile?.fullName || account.name,
        name: profile?.fullName || account.name,
        email: account.email,
        role: account.role,
        avatar: profile?.avatar || '',
        is_super_admin: account.isSuperAdmin,
        organization_id: account.isSuperAdmin ? null : 9001,
        organization_name: account.isSuperAdmin ? null : 'SV Arena Quận 7',
        permissionCodes: account.role === 'admin' ? permissionCodes : [],
    };
}

async function requireAuthenticatedUser(request: NextRequest) {
    const payload = await verifyPublicToken(normalizeBearerToken(request));
    if (!payload || payload.type !== 'access' || (!payload.email && !payload.username)) {
        return null;
    }
    return payload;
}

function toLdpUserInfoFromDbUser(user: any) {
    const isAdmin = String(user?.role || '').toUpperCase() === 'ADMIN';
    const username = String(user?.username || '').trim().toLowerCase();
    const isUsernameEmail = isValidEmail(username);
    const normalizedPhone = normalizePhone(user?.phone || '');
    const fallbackPhone = !isUsernameEmail ? normalizePhone(username) : '';
    const phone = normalizedPhone || fallbackPhone;
    return {
        id: String(user?._id || ''),
        full_name: user?.fullName || username || '',
        name: user?.fullName || username || '',
        email: isUsernameEmail ? username : '',
        phone: phone || '',
        role: isAdmin ? 'admin' : 'guest',
        avatar: user?.avatar || '',
        is_super_admin: false,
        organization_id: null,
        organization_name: null,
        permissionCodes: isAdmin ? permissionCodes : [],
    };
}

function toLdpUserInfoFromCustomer(customer: any) {
    const accountEmail = normalizeEmail(customer?.accountEmail || customer?.email || '');
    const accountPhone = normalizePhone(customer?.accountPhone || customer?.phone || '');
    return {
        id: String(customer?._id || ''),
        full_name: customer?.name || accountEmail || accountPhone || '',
        name: customer?.name || accountEmail || accountPhone || '',
        email: accountEmail,
        phone: accountPhone,
        role: 'guest',
        avatar: customer?.avatar || '',
        is_super_admin: false,
        organization_id: null,
        organization_name: null,
        permissionCodes: [],
    };
}

const normalizeNameKey = (value: unknown) => String(value || '').trim().toLowerCase();

async function createCustomerLeadFromRequest(
    request: NextRequest,
    body: any,
    options?: { source?: string; defaultNote?: string; responseMessage?: string },
) {
    const inputPhone = normalizePhone(body.phone);
    const inputEmail = normalizeEmail(body.email);
    const rawContact = String(body.contact || body.phone || body.email || '').trim();
    const contactFromField = String(body.contact || '').trim().toLowerCase();

    const normalizedPhone = inputPhone || normalizePhone(rawContact);
    const normalizedEmail = inputEmail || normalizeEmail(rawContact);
    const hasEmailLikeContact = rawContact.toLowerCase().includes('@') || contactFromField.includes('@') || Boolean(inputEmail);

    const name = String(body.name || body.full_name || '').trim() || null;
    const address = String(body.address || '').trim() || null;
    const note = String(body.note || '').trim() || options?.defaultNote || null;
    const source = String(body.source || options?.source || 'Website').trim() || String(options?.source || 'Website');

    if (!rawContact) {
        return fail('fill_required_infomation', 422, 'CONTACT_REQUIRED');
    }

    const isEmail = hasEmailLikeContact;
    if (isEmail && !isValidEmail(normalizedEmail)) {
        return fail('invalid_email', 422, 'INVALID_EMAIL');
    }

    if (!isEmail && (normalizedPhone.length < 9 || normalizedPhone.length > 15)) {
        return fail('invalid_phone_number', 422, 'INVALID_PHONE_NUMBER');
    }

    const contactType: 'phone' | 'email' = isEmail ? 'email' : 'phone';
    const phone = !isEmail ? normalizedPhone : null;

    try {
        await connectToDatabase();

        const now = new Date();
        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'local';
        const userAgent = request.headers.get('user-agent') || undefined;

        const nameKey = normalizeNameKey(name);
        const linkedDoc = await Customer.findOne({
            $or: [
                ...(normalizedEmail ? [{ email: normalizedEmail }, { accountEmail: normalizedEmail }] : []),
                ...(normalizedPhone ? [{ phone: normalizedPhone }, { accountPhone: normalizedPhone }] : []),
                ...(nameKey ? [{ source, name: new RegExp(`^${nameKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }] : []),
            ],
        }).lean();

        const doc = await Customer.findOneAndUpdate(
            linkedDoc ? { _id: (linkedDoc as any)._id } : {
                source,
                ...(normalizedEmail ? { email: normalizedEmail } : {}),
                ...(normalizedPhone ? { phone: normalizedPhone } : {}),
            },
            {
                $set: {
                    source,
                    email: normalizedEmail || null,
                    phone,
                    accountEmail: normalizedEmail || (linkedDoc as any)?.accountEmail || null,
                    accountPhone: normalizedPhone || (linkedDoc as any)?.accountPhone || null,
                    name,
                    address,
                    note,
                    contactType,
                    rawValue: rawContact,
                    status: 'new',
                    lastRequestAt: now,
                    ipAddress,
                    userAgent,
                },
                $setOnInsert: {
                    firstRequestAt: now,
                },
                $inc: {
                    requestCount: 1,
                },
            },
            {
                upsert: true,
                new: true,
            },
        ).lean();

        return ok({
            id: String((doc as any)?._id || ''),
            phone: contactType === 'phone' ? normalizedPhone : null,
            email: contactType === 'email' ? normalizedEmail : null,
            name,
            address,
            note,
            contact_type: contactType,
            source,
            request_count: Number((doc as any)?.requestCount || 1),
        }, options?.responseMessage || 'support_request_received');
    } catch (error: any) {
        if (isDuplicateKeyError(error)) {
            return fail('server_error', 500, 'DUPLICATE_KEY');
        }

        return fail('server_error', 500, error?.message || 'SERVER_ERROR');
    }
}

async function login(request: NextRequest, audience: 'internal' | 'customer' = 'customer') {
    const body = await request.json().catch(() => ({}));
    const rawAccount = String(body.email || body.username || body.account || '').trim();
    const email = normalizeEmail(rawAccount);
    const isEmailAccount = rawAccount.includes('@');
    const normalizedPhone = isEmailAccount ? '' : normalizePhone(rawAccount);
    const password = String(body.password || '');

    if (audience === 'customer') {
        try {
            await connectToDatabase();
            const customer = await Customer.findOne({
                $or: isEmailAccount
                    ? [{ accountEmail: email }, { email }]
                    : [{ accountPhone: normalizedPhone }, { phone: normalizedPhone }],
            });

            if (!customer?.passwordHash || !compareSync(password, String(customer.passwordHash || ''))) {
                return fail('email_or_password_not_correct', 401, 'ACCOUNT_NOT_FOUND');
            }

            const username = isEmailAccount
                ? normalizeEmail(customer.accountEmail || customer.email || email)
                : normalizePhone(customer.accountPhone || customer.phone || normalizedPhone);
            const emailClaim = isValidEmail(username) ? username : normalizeEmail(customer.accountEmail || customer.email || '');
            const sessionId = crypto.randomUUID();
            const sessionToken = await createSessionToken({
                id: String(customer._id),
                username,
                role: 'USER',
            }, sessionId);
            const accessToken = await createPublicToken({ sub: String(customer._id), email: emailClaim || '', username, role: 'guest', sid: sessionId, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
            const refreshToken = await createPublicToken({ sub: String(customer._id), email: emailClaim || '', username, role: 'guest', sid: sessionId, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

            const response = ok({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
                user_info: toLdpUserInfoFromCustomer(customer),
            }, 'success');

            response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
            response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), csrfCookieOptions());
            return response;
        } catch {
            return fail('email_or_password_not_correct', 401, 'ACCOUNT_NOT_FOUND');
        }
    }

    try {
        await connectToDatabase();

        const dbUser = await User.findOne({
            $or: [
                { username: email },
                ...(!isEmailAccount && normalizedPhone ? [{ phone: normalizedPhone }] : []),
            ],
        });

        if (dbUser?.passwordHash && compareSync(password, dbUser.passwordHash)) {
            const isAdmin = String(dbUser.role || '').toUpperCase() === 'ADMIN';

            if (audience === 'internal' && !isAdmin) {
                return fail('email_or_password_not_correct', 401, 'ACCOUNT_NOT_FOUND');
            }

            const role = isAdmin ? 'admin' : 'guest';
            let sessionId = crypto.randomUUID();

            if (isAdmin) {
                const session = await createDbSession({
                    userId: String(dbUser._id),
                    ipAddress: request.headers.get('x-forwarded-for') || 'local',
                    userAgent: request.headers.get('user-agent') || undefined,
                });
                sessionId = session.id;
            }

            const username = String(dbUser.username || email || normalizedPhone || '').trim();
            const emailClaim = isValidEmail(username) ? username : '';

            const sessionToken = await createSessionToken({
                id: String(dbUser._id),
                username,
                role: isAdmin ? 'ADMIN' : 'USER',
            }, sessionId);
            const accessToken = await createPublicToken({ sub: String(dbUser._id), email: emailClaim, username, role, sid: sessionId, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
            const refreshToken = await createPublicToken({ sub: String(dbUser._id), email: emailClaim, username, role, sid: sessionId, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

            const response = ok({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
                user_info: toLdpUserInfoFromDbUser(dbUser),
            }, 'success');

            response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
            response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), csrfCookieOptions());
            return response;
        }
    } catch {
        // Fall back to demo account auth.
    }

    const account = demoAccounts.find((item) => item.email === email && item.password === password);

    if (!account) {
        return fail('email_or_password_not_correct', 401, 'ACCOUNT_NOT_FOUND');
    }

    if (audience === 'internal' && account.role !== 'admin') {
        return fail('email_or_password_not_correct', 401, 'ACCOUNT_NOT_FOUND');
    }

    let userId = `demo:${account.email}`;
    let sessionId = crypto.randomUUID();
    let profile: { fullName?: string | null; avatar?: string | null } | undefined;

    try {
        const user = await ensureSportverseUser(account);
        if (user) {
            profile = {
                fullName: user.fullName || account.name,
                avatar: user.avatar || '',
            };
            const session = await createDbSession({
                userId: String(user._id),
                ipAddress: request.headers.get('x-forwarded-for') || 'local',
                userAgent: request.headers.get('user-agent') || undefined,
            });
            userId = String(user._id);
            sessionId = session.id;
        }
    } catch {
        // MongoDB-backed CMS sessions are optional for the LDP-compatible API.
        // When MongoDB is not running, the app still works with signed JWT tokens.
    }

    const sessionToken = await createSessionToken({
        id: userId,
        username: account.email,
        role: account.role === 'admin' ? 'ADMIN' : 'USER',
    }, sessionId);
    const accessToken = await createPublicToken({ sub: userId, email: account.email, username: account.email, role: account.role, sid: sessionId, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
    const refreshToken = await createPublicToken({ sub: userId, email: account.email, username: account.email, role: account.role, sid: sessionId, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

    const response = ok({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
        user_info: toLdpUserInfo(account, userId, profile),
    }, 'success');

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
    response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), csrfCookieOptions());
    return response;
}

async function refreshToken(request: NextRequest) {
    const body = await request.json().catch(() => ({}));
    const refreshTokenValue = String(body.refresh_token || '').replace(/^"(.*)"$/, '$1');
    const payload = await verifyPublicToken(refreshTokenValue);

    if (!payload || payload.type !== 'refresh' || (!payload.email && !payload.username)) {
        return fail('not_found_token', 401, 'NOT_FOUND_TOKEN');
    }

    if (payload.role === 'guest') {
        try {
            await connectToDatabase();
            const customer = await Customer.findById(String(payload.sub || '')).lean();
            if (!customer) {
                return fail('not_found_token', 401, 'ACCOUNT_NOT_FOUND');
            }

            const accountEmail = normalizeEmail((customer as any).accountEmail || (customer as any).email || payload.email || '');
            const accountPhone = normalizePhone((customer as any).accountPhone || (customer as any).phone || payload.username || '');
            const username = accountEmail || accountPhone;

            const accessToken = await createPublicToken({ sub: payload.sub, email: accountEmail || '', username, role: 'guest', sid: payload.sid, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
            const nextRefreshToken = await createPublicToken({ sub: payload.sub, email: accountEmail || '', username, role: 'guest', sid: payload.sid, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

            return ok({
                access_token: accessToken,
                refresh_token: nextRefreshToken,
                expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
                user_info: toLdpUserInfoFromCustomer(customer),
            }, 'success');
        } catch {
            return fail('not_found_token', 401, 'ACCOUNT_NOT_FOUND');
        }
    }

    const payloadEmail = normalizeEmail(payload.email || payload.username || '');
    const account = demoAccounts.find((item) => item.email === payloadEmail);

    if (account) {
        const accessToken = await createPublicToken({ sub: payload.sub, email: account.email, username: account.email, role: account.role, sid: payload.sid, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
        const nextRefreshToken = await createPublicToken({ sub: payload.sub, email: account.email, username: account.email, role: account.role, sid: payload.sid, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

        return ok({
            access_token: accessToken,
            refresh_token: nextRefreshToken,
            expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
            user_info: toLdpUserInfo(account, String(payload.sub || '')),
        }, 'success');
    }

    try {
        await connectToDatabase();
        const dbUser = await User.findById(String(payload.sub || '')).lean();
        if (!dbUser) {
            return fail('not_found_token', 401, 'ACCOUNT_NOT_FOUND');
        }

        const username = String((dbUser as any).username || payload.username || payload.email || '').trim();
        const emailClaim = isValidEmail(username) ? username : '';
        const role = String((dbUser as any).role || '').toUpperCase() === 'ADMIN' ? 'admin' : 'guest';

        const accessToken = await createPublicToken({ sub: payload.sub, email: emailClaim, username, role, sid: payload.sid, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
        const nextRefreshToken = await createPublicToken({ sub: payload.sub, email: emailClaim, username, role, sid: payload.sid, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

        return ok({
            access_token: accessToken,
            refresh_token: nextRefreshToken,
            expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
            user_info: toLdpUserInfoFromDbUser(dbUser),
        }, 'success');
    } catch {
        return fail('not_found_token', 401, 'ACCOUNT_NOT_FOUND');
    }
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

function getDemoAdminUsers() {
    return demoAccounts.map((account, index) => ({
        id: index + 1,
        name: account.name,
        email: account.email,
        username: account.email,
        organization_name: account.isSuperAdmin ? null : 'SV Arena Quận 7',
        role_name: account.isSuperAdmin ? 'Super Admin' : account.role === 'admin' ? 'Organization Operator' : 'Member',
        role_code: account.isSuperAdmin ? 'super_admin' : account.role === 'admin' ? 'organization_admin' : 'member',
        is_super_admin: account.isSuperAdmin,
        permission_codes_count: account.role === 'admin' ? permissionCodes.length : 0,
        is_editable: false,
    }));
}

function mapDbUserToAdminRow(user: any) {
    const username = String(user?.username || '').trim();
    const isAdmin = String(user?.role || '').toUpperCase() === 'ADMIN';
    const isSuperAdmin = normalizeEmail(username) === normalizeEmail(process.env.ADMIN_USERNAME || 'superadmin@gmail.com');

    return {
        id: String(user?._id || ''),
        name: String(user?.fullName || username || 'Người dùng'),
        email: username,
        username,
        organization_name: isSuperAdmin ? null : 'SV Arena Quận 7',
        role_name: isSuperAdmin ? 'Super Admin' : isAdmin ? 'Organization Operator' : 'Member',
        role_code: isSuperAdmin ? 'super_admin' : isAdmin ? 'organization_admin' : 'member',
        is_super_admin: isSuperAdmin,
        permission_codes_count: isAdmin ? permissionCodes.length : 0,
        is_editable: true,
    };
}

async function getAdminUsers() {
    const demoRows = getDemoAdminUsers();

    try {
        await connectToDatabase();
        const dbUsers = await User.find().sort({ createdAt: -1 }).lean();
        const dbRows = dbUsers.map(mapDbUserToAdminRow);

        if (dbRows.length === 0) {
            return demoRows;
        }

        const mergedByEmail = new Map<string, any>();
        demoRows.forEach((row) => mergedByEmail.set(normalizeEmail(row.email), row));
        dbRows.forEach((row) => mergedByEmail.set(normalizeEmail(row.email), row));

        return Array.from(mergedByEmail.values());
    } catch {
        return demoRows;
    }
}

function getAdminRoles(users: any[] = getDemoAdminUsers()) {
    const adminUsersCount = users.filter((item) => item.role_code === 'super_admin' || item.role_code === 'organization_admin').length;
    const memberUsersCount = users.filter((item) => item.role_code === 'member').length;

    return [
        {
            id: 1,
            organization_name: null,
            name: 'Super Admin',
            code: 'super_admin',
            is_system: true,
            users_count: users.filter((item) => item.role_code === 'super_admin').length,
            permissions_count: permissionCodes.length,
            permissions_preview: permissionCodes.slice(0, 4),
        },
        {
            id: 2,
            organization_name: 'SV Arena Quận 7',
            name: 'Organization Owner',
            code: 'owner',
            is_system: true,
            users_count: 0,
            permissions_count: permissionCodes.length,
            permissions_preview: permissionCodes.slice(0, 4),
        },
        {
            id: 3,
            organization_name: 'SV Arena Quận 7',
            name: 'Booking Operator',
            code: 'organization_admin',
            is_system: false,
            users_count: adminUsersCount,
            permissions_count: permissionCodes.length,
            permissions_preview: permissionCodes.slice(0, 4),
        },
        {
            id: 4,
            organization_name: 'SV Arena Quận 7',
            name: 'Member',
            code: 'member',
            is_system: false,
            users_count: memberUsersCount,
            permissions_count: 0,
            permissions_preview: [],
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

async function getAdminCustomers() {
    await connectToDatabase();
    const docs = await Customer.find().sort({ lastRequestAt: -1, updatedAt: -1 }).lean();

    const grouped = new Map<string, any>();
    for (const raw of docs as any[]) {
        const emailKey = normalizeEmail(raw.accountEmail || raw.email || '');
        const phoneKey = normalizePhone(raw.accountPhone || raw.phone || '');
        const nameKey = normalizeNameKey(raw.name || '');
        const sourceKey = String(raw.source || 'Footer').trim().toLowerCase();
        const key = emailKey
            ? `email:${emailKey}`
            : phoneKey
                ? `phone:${phoneKey}`
                : nameKey
                    ? `name:${nameKey}:${sourceKey}`
                    : `id:${String(raw._id)}`;

        if (!grouped.has(key)) {
            grouped.set(key, { ...raw });
            continue;
        }

        const prev = grouped.get(key);
        prev.requestCount = Number(prev.requestCount || 1) + Number(raw.requestCount || 1);
        prev.firstRequestAt = new Date(Math.min(new Date(prev.firstRequestAt || Date.now()).getTime(), new Date(raw.firstRequestAt || Date.now()).getTime()));
        prev.lastRequestAt = new Date(Math.max(new Date(prev.lastRequestAt || 0).getTime(), new Date(raw.lastRequestAt || 0).getTime()));
        prev.updatedAt = new Date(Math.max(new Date(prev.updatedAt || 0).getTime(), new Date(raw.updatedAt || 0).getTime()));
        prev.email = prev.email || raw.email || raw.accountEmail || null;
        prev.accountEmail = prev.accountEmail || raw.accountEmail || raw.email || null;
        prev.phone = prev.phone || raw.phone || raw.accountPhone || null;
        prev.accountPhone = prev.accountPhone || raw.accountPhone || raw.phone || null;
        prev.name = prev.name || raw.name || null;
        prev.address = prev.address || raw.address || null;
        prev.avatar = prev.avatar || raw.avatar || null;
        prev.note = prev.note || raw.note || null;
    }

    const mergedDocs = Array.from(grouped.values()).sort((a, b) => new Date(b.lastRequestAt || 0).getTime() - new Date(a.lastRequestAt || 0).getTime());

    return {
        customers: mergedDocs.map((doc: any) => ({
            id: String(doc._id),
            name: doc.name ? String(doc.name) : null,
            address: doc.address ? String(doc.address) : null,
            contact: String(doc.accountEmail || doc.email || doc.accountPhone || doc.phone || doc.rawValue || ''),
            phone: doc.phone ? String(doc.phone || '') : (doc.accountPhone ? String(doc.accountPhone || '') : null),
            email: doc.email ? String(doc.email || '') : (doc.accountEmail ? String(doc.accountEmail || '') : null),
            contact_type: (doc.accountEmail || doc.email ? 'email' : 'phone') as 'phone' | 'email',
            source: String(doc.source || 'Footer'),
            status: normalizeCustomerStatus(doc.status, 'new'),
            request_count: Number(doc.requestCount || 1),
            first_request_at: doc.firstRequestAt ? new Date(doc.firstRequestAt).toISOString() : nowIso(),
            last_request_at: doc.lastRequestAt ? new Date(doc.lastRequestAt).toISOString() : nowIso(),
            ip_address: doc.ipAddress ? String(doc.ipAddress) : null,
            user_agent: doc.userAgent ? String(doc.userAgent) : null,
            note: doc.note ? String(doc.note) : null,
        })),
    };
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

async function getAdminOverview() {
    const organizations = getAdminOrganizations();
    const venues = getAdminVenues();
    const bookings = getAdminBookings();
    const users = await getAdminUsers();
    const roles = getAdminRoles(users);

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
            users_count: users.length,
            roles_count: roles.length,
            matches_count: demoMatches.length,
            monthly_revenue: bookings.reduce((total, booking) => total + Number(booking.total_amount || 0), 0),
            currency: 'VND',
        },
        recent_bookings: bookings.slice(0, 5),
        organizations: organizations.map(({ id, name, slug, status, users_count, venues_count, teams_count }) => ({ id, name, slug, status, users_count, venues_count, teams_count })),
    };
}

const normalizeCourseText = (value?: string | null) => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isActionPost = (post: { category?: string }) => normalizeCourseText(post.category) === 'tap yoga';

const isCoursePost = (post: { category?: string }) => normalizeCourseText(post.category) === 'khoa hoc';

const normalizePostStatus = (value: unknown, fallback: 'draft' | 'review' | 'published' = 'draft'): 'draft' | 'review' | 'published' => {
    const normalized = String(value || '').trim().toLowerCase();

    if (!normalized) {
        return fallback;
    }

    if (['published', 'done', 'active', 'public'].includes(normalized)) {
        return 'published';
    }

    if (['review', 'pending'].includes(normalized)) {
        return 'review';
    }

    if (['draft', 'inactive', 'hidden'].includes(normalized)) {
        return 'draft';
    }

    return fallback;
};

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

    if (segment === 'actions') {
        const limit = Number(searchParams.get('limit') || 0) || undefined;
        const posts = await getPublicPostsFromStore();
        const actions = posts.filter((post) => isActionPost(post));
        return ok(limit ? actions.slice(0, limit) : actions);
    }

    if (segment === 'courses') {
        const limit = Number(searchParams.get('limit') || 0) || undefined;
        const posts = await getPublicPostsFromStore();
        const courses = posts.filter((post) => isCoursePost(post));
        return ok(limit ? courses.slice(0, limit) : courses);
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

        if (second === 'overview') return ok(await getAdminOverview());
        if (second === 'organizations') return ok({ organizations: getAdminOrganizations() });
        if (second === 'venues') return ok({ venues: getAdminVenues() });
        if (second === 'bookings') return ok({ bookings: getAdminBookings() });
        if (second === 'users') return ok({ users: await getAdminUsers() });
        if (second === 'roles') return ok({ roles: getAdminRoles(await getAdminUsers()) });
        if (second === 'posts') return ok(await getAdminPosts());
        if (second === 'post-categories') return ok({ categories: await getAdminPostCategoriesFromStore() });
        if (second === 'store-items') return ok({ store_items: await getAdminStoreItems() });
        if (second === 'menus') return ok(await getAdminMenus());
        if (second === 'sections') return ok(await getAdminSections());
        if (second === 'customers') return ok(await getAdminCustomers());
    }

    return fail('not_found', 404);
}

async function handlePost(request: NextRequest, path: string[]) {
    const [segment, second, third] = path;

    if ((segment === 'updateUserInfo' && !second) || (segment === 'customer' && second === 'update-profile')) {
        const authUser = await requireAuthenticatedUser(request);
        if (!authUser) {
            return fail('missing_token', 401, 'MISSING_TOKEN');
        }

        const contentType = request.headers.get('content-type') || '';
        const isFormData = contentType.includes('multipart/form-data');

        const body = isFormData
            ? Object.fromEntries((await request.formData()).entries())
            : await request.json().catch(() => ({}));

        const fullName = String((body as any).full_name || (body as any).fullName || '').trim();
        const inputEmail = normalizeEmail((body as any).email || '');
        const inputPhone = normalizePhone((body as any).phone || '');
        if (!fullName) {
            return fail('fill_required_infomation', 422, 'FULL_NAME_REQUIRED');
        }

        if (inputEmail && !isValidEmail(inputEmail)) {
            return fail('invalid_email', 422, 'INVALID_EMAIL');
        }

        if (inputPhone && (inputPhone.length < 9 || inputPhone.length > 15)) {
            return fail('invalid_phone_number', 422, 'INVALID_PHONE_NUMBER');
        }

        await connectToDatabase();

        const currentUsername = String(authUser.username || authUser.email || '').trim().toLowerCase();
        const authSub = String(authUser.sub || '').trim();
        const isLikelyObjectId = /^[a-f0-9]{24}$/i.test(authSub);

        if (String(authUser.role || '').toLowerCase() === 'guest') {
            let targetCustomer: any = null;

            if (isLikelyObjectId) {
                targetCustomer = await Customer.findById(authSub);
            }
            if (!targetCustomer && currentUsername) {
                targetCustomer = await Customer.findOne({
                    $or: [
                        { accountEmail: currentUsername },
                        { email: currentUsername },
                        { accountPhone: normalizePhone(currentUsername) },
                        { phone: normalizePhone(currentUsername) },
                    ],
                });
            }

            if (!targetCustomer) {
                return fail('record_not_found', 404, 'ACCOUNT_NOT_FOUND');
            }

            const nextEmail = inputEmail || normalizeEmail(targetCustomer.accountEmail || targetCustomer.email || '');
            const nextPhone = inputPhone || normalizePhone(targetCustomer.accountPhone || targetCustomer.phone || '');
            if (!nextEmail && !nextPhone) {
                return fail('fill_required_infomation', 422, 'CONTACT_REQUIRED');
            }

            const duplicateCustomer = await Customer.findOne({
                _id: { $ne: targetCustomer._id },
                $or: [
                    ...(nextEmail ? [{ accountEmail: nextEmail }, { email: nextEmail }] : []),
                    ...(nextPhone ? [{ accountPhone: nextPhone }, { phone: nextPhone }] : []),
                ],
            });

            let duplicateAvatar = '';
            if (duplicateCustomer) {
                duplicateAvatar = String(duplicateCustomer.avatar || '');
                await Customer.findByIdAndDelete(duplicateCustomer._id);
            }

            const updatePayload: Record<string, any> = {
                name: fullName,
                email: nextEmail || null,
                phone: nextPhone || null,
                accountEmail: nextEmail || null,
                accountPhone: nextPhone || null,
                contactType: nextEmail ? 'email' : 'phone',
                rawValue: nextEmail || nextPhone,
                lastRequestAt: new Date(),
            };

            const file = (body as any).file;
            if (file && typeof file === 'object' && typeof file.arrayBuffer === 'function') {
                const buffer = Buffer.from(await file.arrayBuffer());
                const mime = String((file as any).type || 'image/jpeg');
                updatePayload.avatar = `data:${mime};base64,${buffer.toString('base64')}`;
            } else if (duplicateAvatar && !targetCustomer.avatar) {
                updatePayload.avatar = duplicateAvatar;
            }

            const updatedCustomer: any = await Customer.findOneAndUpdate(
                { _id: targetCustomer._id },
                { $set: updatePayload },
                { new: true },
            ).lean();

            if (!updatedCustomer) {
                return fail('record_not_found', 404, 'ACCOUNT_NOT_FOUND');
            }

            return ok({
                full_name: updatedCustomer.name || fullName,
                avatar: updatedCustomer.avatar || '',
                email: normalizeEmail(updatedCustomer.accountEmail || updatedCustomer.email || ''),
                phone: normalizePhone(updatedCustomer.accountPhone || updatedCustomer.phone || ''),
            }, 'update_success');
        }

        let targetUser: any = null;
        if (isLikelyObjectId) {
            targetUser = await User.findById(authSub);
        }
        if (!targetUser && currentUsername) {
            targetUser = await User.findOne({ username: currentUsername });
        }

        if (!targetUser) {
            return fail('record_not_found', 404, 'ACCOUNT_NOT_FOUND');
        }

        const nextUsername = inputEmail || inputPhone || String(targetUser.username || '').trim().toLowerCase();
        if (!nextUsername) {
            return fail('fill_required_infomation', 422, 'CONTACT_REQUIRED');
        }

        if (nextUsername !== String(targetUser.username || '').trim().toLowerCase()) {
            const existedUser = await User.findOne({ username: nextUsername, _id: { $ne: targetUser._id } }).lean();
            if (existedUser) {
                return fail(inputEmail ? 'email_existed' : 'phone_existed', 422, 'CONTACT_EXISTS');
            }
        }

        const updatePayload: Record<string, any> = {
            fullName,
            username: nextUsername,
            phone: inputPhone || (!isValidEmail(nextUsername) ? normalizePhone(nextUsername) : null),
        };

        const file = (body as any).file;
        if (file && typeof file === 'object' && typeof file.arrayBuffer === 'function') {
            const buffer = Buffer.from(await file.arrayBuffer());
            const mime = String((file as any).type || 'image/jpeg');
            updatePayload.avatar = `data:${mime};base64,${buffer.toString('base64')}`;
        }

        const updatedUser: any = await User.findOneAndUpdate(
            { _id: targetUser._id },
            { $set: updatePayload },
            { new: true },
        ).lean();

        if (!updatedUser) {
            return fail('record_not_found', 404, 'ACCOUNT_NOT_FOUND');
        }

        return ok({
            full_name: updatedUser.fullName || fullName,
            avatar: updatedUser.avatar || '',
            email: isValidEmail(String(updatedUser.username || '')) ? String(updatedUser.username || '') : '',
            phone: isValidEmail(String(updatedUser.username || '')) ? String(updatedUser.phone || '') : String(updatedUser.username || ''),
        }, 'update_success');
    }

    if (segment === 'user' && second === 'login') return login(request, 'internal');
    if (segment === 'user' && second === 'register') {
        return fail('permission_denied', 403, 'INTERNAL_PATH_ONLY');
    }
    if (segment === 'user' && second === 'refresh-token') return refreshToken(request);
    if (segment === 'user' && second === 'forgotPassword') return ok({ accepted: true }, 'success');
    if (segment === 'user' && second === 'logout') return ok({ revoked: true }, 'success');

    if (segment === 'customer' && second === 'login') return login(request, 'customer');
    if (segment === 'customer' && second === 'register') {
        const body = await request.json().catch(() => ({}));
        const rawContact = String(body.contact || body.phone || body.email || '').trim();
        const inputPhone = normalizePhone(body.phone);
        const inputEmail = normalizeEmail(body.email);
        const contactFromField = String(body.contact || '').trim().toLowerCase();

        const normalizedPhone = inputPhone || normalizePhone(rawContact);
        const normalizedEmail = inputEmail || normalizeEmail(rawContact);
        const hasEmailLikeContact = rawContact.toLowerCase().includes('@') || contactFromField.includes('@') || Boolean(inputEmail);

        if (!rawContact) {
            return fail('fill_required_infomation', 422, 'CONTACT_REQUIRED');
        }

        const isEmail = hasEmailLikeContact;
        if (isEmail && !isValidEmail(normalizedEmail)) {
            return fail('invalid_email', 422, 'INVALID_EMAIL');
        }

        if (!isEmail && (normalizedPhone.length < 9 || normalizedPhone.length > 15)) {
            return fail('invalid_phone_number', 422, 'INVALID_PHONE_NUMBER');
        }

        const password = String(body.password || '').trim();
        const passwordConfirmation = String(body.password_confirmation || '').trim();
        if (!password || password.length < 6) {
            return fail('password_required', 422, 'PASSWORD_REQUIRED');
        }
        if (password !== passwordConfirmation) {
            return fail('password_confirm_not_match', 422, 'PASSWORD_CONFIRM_NOT_MATCH');
        }

        const username = isEmail ? normalizedEmail : normalizedPhone;
        const source = String(body.source || 'Guest Register').trim() || 'Guest Register';
        const fullName = String(body.full_name || body.name || '').trim() || username;
        const note = String(body.note || '').trim() || 'Đăng ký tài khoản khách hàng';

        try {
            await connectToDatabase();

            const existingCustomer: any = await Customer.findOne({
                $or: [
                    ...(normalizedEmail ? [{ accountEmail: normalizedEmail }, { email: normalizedEmail }] : []),
                    ...(normalizedPhone ? [{ accountPhone: normalizedPhone }, { phone: normalizedPhone }] : []),
                ],
            }).lean();

            if (existingCustomer?.passwordHash) {
                return fail(isEmail ? 'email_existed' : 'phone_existed', 422, 'ACCOUNT_EXISTS');
            }

            const now = new Date();
            const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'local';
            const userAgent = request.headers.get('user-agent') || undefined;

            const createdCustomer: any = await Customer.findOneAndUpdate(
                existingCustomer ? { _id: (existingCustomer as any)._id } : {
                    source,
                    ...(normalizedEmail ? { email: normalizedEmail } : {}),
                    ...(normalizedPhone ? { phone: normalizedPhone } : {}),
                },
                {
                    $set: {
                        source,
                        email: normalizedEmail || null,
                        phone: normalizedPhone || null,
                        accountEmail: normalizedEmail || null,
                        accountPhone: normalizedPhone || null,
                        passwordHash: hashSync(password, 10),
                        name: fullName,
                        note,
                        contactType: isEmail ? 'email' : 'phone',
                        rawValue: rawContact,
                        status: 'new',
                        lastRequestAt: now,
                        ipAddress,
                        userAgent,
                    },
                    $setOnInsert: {
                        firstRequestAt: now,
                    },
                    $inc: {
                        requestCount: 1,
                    },
                },
                {
                    upsert: true,
                    new: true,
                },
            ).lean();

            if (!createdCustomer?.passwordHash) {
                return fail('server_error', 500, 'CUSTOMER_PASSWORD_NOT_SAVED');
            }

            const sessionId = crypto.randomUUID();
            const sessionToken = await createSessionToken({
                id: String(createdCustomer._id),
                username: username,
                role: 'USER',
            }, sessionId);

            const accessToken = await createPublicToken({ sub: String(createdCustomer._id), email: normalizedEmail || '', username, role: 'guest', sid: sessionId, type: 'access' }, ACCESS_TOKEN_TTL_SECONDS);
            const refreshToken = await createPublicToken({ sub: String(createdCustomer._id), email: normalizedEmail || '', username, role: 'guest', sid: sessionId, type: 'refresh' }, REFRESH_TOKEN_TTL_SECONDS);

            const response = ok({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: futureIso(ACCESS_TOKEN_TTL_SECONDS),
                user_info: toLdpUserInfoFromCustomer(createdCustomer),
            }, 'register_successfully');

            response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
            response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), csrfCookieOptions());
            return response;
        } catch (error: any) {
            if (isDuplicateKeyError(error)) {
                return fail(isEmail ? 'email_existed' : 'phone_existed', 422, 'ACCOUNT_EXISTS');
            }

            return fail('server_error', 500, error?.message || 'SERVER_ERROR');
        }
    }
    if (segment === 'customer' && second === 'forgotPassword') return ok({ accepted: true }, 'success');
    if (segment === 'customer' && second === 'logout') return ok({ revoked: true }, 'success');

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

    if (segment === 'support-request' && !second) {
        const body = await request.json().catch(() => ({}));
        return createCustomerLeadFromRequest(request, body, {
            source: 'Footer',
            responseMessage: 'success',
        });
    }

    if (segment === 'admin') {
        const admin = await requireSportverseAdmin(request);
        if (!admin) {
            return fail('missing_token', 401, 'MISSING_TOKEN');
        }

        const body = await request.json().catch(() => ({}));

        if (second === 'posts') {
            const slug = String(body.slug || '');
            const status = normalizePostStatus(body.status, 'draft');
            const created = await createAdminPost({
                title: String(body.title || ''),
                slug,
                category: String(body.category || ''),
                excerpt: String(body.excerpt || ''),
                description: String(body.description || body.excerpt || ''),
                author_name: String(body.author_name || 'SV Super Admin'),
                status,
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
            revalidatePublicCache();
            return ok(created, 'success');
        }

        if (second === 'users') {
            const parsed = createUserSchema.safeParse(body);

            if (!parsed.success) {
                return fail(parsed.error.issues[0]?.message || 'Dữ liệu user không hợp lệ.', 422, 'VALIDATION_ERROR');
            }

            await connectToDatabase();

            const existing = await User.findOne({ username: parsed.data.username }).lean();
            if (existing) {
                return fail('name_existed', 409, 'USERNAME_EXISTS');
            }

            const created = await User.create({
                username: parsed.data.username,
                fullName: parsed.data.fullName || '',
                phone: parsed.data.phone || '',
                role: parsed.data.role,
                passwordHash: hashSync(parsed.data.password, 10),
            });

            return ok(mapDbUserToAdminRow(created.toObject()), 'success');
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
            revalidatePublicCache();
            return ok(created, 'success');
        }

        if (second === 'store-items') {
            try {
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
                revalidatePublicCache();
                return ok(created, 'success');
            } catch (error: any) {
                if (error?.code === 'SKU_EXISTS') {
                    return fail('sku_existed', 422, 'SKU_EXISTS');
                }
                if (error?.code === 'SKU_REQUIRED') {
                    return fail('fill_required_infomation', 422, 'SKU_REQUIRED');
                }
                if (isDuplicateKeyError(error)) {
                    return fail('sku_existed', 422, 'SKU_EXISTS');
                }
                if (error?.name === 'ValidationError') {
                    return fail('fill_required_infomation', 422, error?.message || 'VALIDATION_ERROR');
                }
                return fail('server_error', 500, error?.message || 'SERVER_ERROR');
            }
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
            revalidatePublicCache();
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
            revalidatePublicCache();
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

    if (second === 'users' && third) {
        if (!/^[a-f0-9]{24}$/i.test(String(third))) {
            return fail('record_not_found', 404);
        }

        const parsed = updateUserSchema.safeParse(body);
        if (!parsed.success) {
            return fail(parsed.error.issues[0]?.message || 'Dữ liệu user không hợp lệ.', 422, 'VALIDATION_ERROR');
        }

        await connectToDatabase();

        const current = await User.findById(String(third));
        if (!current) {
            return fail('record_not_found', 404);
        }

        if (parsed.data.username && parsed.data.username !== current.username) {
            const existed = await User.findOne({ username: parsed.data.username }).lean();
            if (existed) {
                return fail('name_existed', 409, 'USERNAME_EXISTS');
            }
            current.username = parsed.data.username;
        }

        if (parsed.data.fullName !== undefined) current.fullName = parsed.data.fullName;
        if (parsed.data.phone !== undefined) current.phone = parsed.data.phone;
        if (parsed.data.role !== undefined) current.role = parsed.data.role;
        if (parsed.data.password) current.passwordHash = hashSync(parsed.data.password, 10);

        await current.save();
        return ok(mapDbUserToAdminRow(current.toObject()), 'success');
    }

    if (second === 'posts' && third) {
        const currentPosts = await getAdminPostsFromStore();
        const currentPost = currentPosts.find((item) => item.id === Number(third));
        const slug = String(body.slug || '');
        const status = normalizePostStatus(body.status, (currentPost?.status as 'draft' | 'review' | 'published' | undefined) || 'draft');
        const updated = await updateAdminPost(Number(third), {
            title: String(body.title || ''),
            slug,
            category: String(body.category || ''),
            excerpt: String(body.excerpt || ''),
            description: String(body.description || body.excerpt || ''),
            author_name: String(body.author_name || 'SV Super Admin'),
            status,
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
        if (updated) {
            revalidatePublicCache();
        }
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
        if (updated) {
            revalidatePublicCache();
        }
        return updated ? ok(updated, 'success') : fail('record_not_found', 404);
    }

    if (second === 'store-items' && third) {
        try {
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
            if (updated) {
                revalidatePublicCache();
            }
            return updated ? ok(updated, 'success') : fail('record_not_found', 404);
        } catch (error: any) {
            if (error?.code === 'SKU_EXISTS') {
                return fail('sku_existed', 422, 'SKU_EXISTS');
            }
            if (error?.code === 'SKU_REQUIRED') {
                return fail('fill_required_infomation', 422, 'SKU_REQUIRED');
            }
            if (isDuplicateKeyError(error)) {
                return fail('sku_existed', 422, 'SKU_EXISTS');
            }
            if (error?.name === 'ValidationError') {
                return fail('fill_required_infomation', 422, error?.message || 'VALIDATION_ERROR');
            }
            return fail('server_error', 500, error?.message || 'SERVER_ERROR');
        }
    }

    if (second === 'customers' && third) {
        const status = normalizeCustomerStatus(body.status, 'new');
        const note = body.note === undefined || body.note === null ? null : String(body.note).trim();
        const name = body.name === undefined || body.name === null ? null : String(body.name).trim() || null;
        const address = body.address === undefined || body.address === null ? null : String(body.address).trim() || null;
        const contactRaw = String(body.contact || '').trim();
        const inputEmail = normalizeEmail(body.email || '');
        const inputPhone = normalizePhone(body.phone || '');
        const contactEmail = normalizeEmail(contactRaw);
        const contactPhone = normalizePhone(contactRaw);
        const contactLooksLikeEmail = contactRaw.includes('@');

        await connectToDatabase();

        const currentDoc: any = await Customer.findById(third).lean();
        if (!currentDoc) {
            return fail('record_not_found', 404);
        }

        const nextEmail = inputEmail || (contactLooksLikeEmail ? contactEmail : '') || normalizeEmail(currentDoc.accountEmail || currentDoc.email || '');
        const nextPhone = inputPhone || (!contactLooksLikeEmail ? contactPhone : '') || normalizePhone(currentDoc.accountPhone || currentDoc.phone || '');

        if (nextEmail && !isValidEmail(nextEmail)) {
            return fail('invalid_email', 422, 'INVALID_EMAIL');
        }

        if (nextPhone && (nextPhone.length < 9 || nextPhone.length > 15)) {
            return fail('invalid_phone_number', 422, 'INVALID_PHONE_NUMBER');
        }

        if (!nextEmail && !nextPhone) {
            return fail('fill_required_infomation', 422, 'CONTACT_REQUIRED');
        }

        let updated: any = null;
        try {
            updated = await Customer.findByIdAndUpdate(
                third,
                {
                    $set: {
                        status,
                        note,
                        name,
                        address,
                        email: nextEmail || null,
                        phone: nextPhone || null,
                        accountEmail: nextEmail || null,
                        accountPhone: nextPhone || null,
                        contactType: nextEmail ? 'email' : 'phone',
                        rawValue: nextEmail || nextPhone,
                    },
                },
                { new: true },
            ).lean();
        } catch (error: any) {
            if (isDuplicateKeyError(error)) {
                return fail(nextEmail ? 'email_existed' : 'phone_existed', 422, 'CONTACT_EXISTS');
            }
            return fail('server_error', 500, error?.message || 'SERVER_ERROR');
        }

        if (!updated) {
            return fail('record_not_found', 404);
        }

        return ok({
            id: String((updated as any)._id),
            name: (updated as any).name ? String((updated as any).name) : null,
            address: (updated as any).address ? String((updated as any).address) : null,
            email: (updated as any).accountEmail ? String((updated as any).accountEmail) : null,
            phone: (updated as any).accountPhone ? String((updated as any).accountPhone) : null,
            contact: String((updated as any).accountEmail || (updated as any).accountPhone || ''),
            status: normalizeCustomerStatus((updated as any).status, 'new'),
            note: (updated as any).note ? String((updated as any).note) : null,
        }, 'success');
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
        if (updatedSection) {
            revalidatePublicCache();
        }
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
        if (updated) {
            revalidatePublicCache();
        }
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
            if (deleted) {
                revalidatePublicCache();
            }
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }

        if (second === 'post-categories' && third) {
            const deleted = await deleteAdminPostCategory(Number(third));
            if (!deleted) {
                return fail('record_not_found', 404);
            }

            revalidatePublicCache();

            const reassignedCount = Number((deleted as any)?.reassigned_count || 0);
            const message = reassignedCount > 0
                ? `Đã xóa danh mục và chuyển ${reassignedCount} bài viết sang "Chưa phân loại".`
                : 'Đã xóa danh mục thành công.';

            return ok(deleted, message);
        }

        if (second === 'store-items' && third) {
            const deleted = await deleteAdminStoreItem(Number(third));
            if (deleted) {
                revalidatePublicCache();
            }
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }

        if (second === 'customers' && third) {
            await connectToDatabase();
            const deleted = await Customer.findByIdAndDelete(third).lean();
            return deleted ? ok({ id: String((deleted as any)._id), deleted: true }, 'delete_success') : fail('record_not_found', 404);
        }

        if ((second === 'menus' && third === 'sections' && fourth) || (second === 'sections' && third)) {
            const deleted = await deleteAdminSection(Number(second === 'sections' ? third : fourth));
            if (deleted) {
                revalidatePublicCache();
            }
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }

        if (second === 'menus' && third) {
            const deleted = await deleteAdminMenuItem(Number(third));
            if (deleted) {
                revalidatePublicCache();
            }
            return deleted ? ok(deleted, 'success') : fail('record_not_found', 404);
        }
    }

    return fail('not_found', 404);
}
