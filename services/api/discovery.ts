import { baseApi } from './baseApi';
import { API_PATH, BASE_URL, FETCH_API_REVALIDATE, FETCH_API_TIMEOUT_MS } from '@/constants/api';
import { IPublicHighlightCard, IPublicHomePayload, IPublicStoreItem, IPublicTemplatePost, IPublicTemplateSection } from '@/interfaces/discovery';
import { Menu } from '@/interfaces/menu';
import { appendDemoHighlights, appendDemoStoreItems, withDemoHomeFallback } from './publicDemoData';
import { templateSiteConfig } from '@/config/template/site';

const buildApiUrl = (path: string) => `${BASE_URL}${API_PATH}${path}`;

const objectToSearchParams = (params?: Record<string, string | number | undefined | null>) => {
    const searchParams = new URLSearchParams();

    if (!params) {
        return '';
    }

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        searchParams.set(key, String(value));
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

const toFallbackMenus = (location?: 'header' | 'footer' | 'account'): Menu[] => {
    const source = location === 'footer'
        ? templateSiteConfig.navigation.footer
        : location === 'account'
            ? templateSiteConfig.navigation.account
            : templateSiteConfig.navigation.primary;

    return source.map((item) => ({
        key: item.key,
        title: item.title,
        url_to: item.url_to,
        slug: (item as { slug?: string }).slug,
        children: [],
    }));
};

async function requestJson<T>(path: string): Promise<T | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_API_TIMEOUT_MS);
    const shouldBypassCache = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_FORCE_FRESH_CMS === 'true';

    try {
        const response = await fetch(buildApiUrl(path), {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
            ...(shouldBypassCache
                ? { cache: 'no-store' as const }
                : {
                    next: {
                        tags: ['all'],
                        revalidate: FETCH_API_REVALIDATE,
                    },
                }),
        });

        if (!response.ok) {
            return null;
        }

        return response.json() as Promise<T>;
    } catch {
        return null;
    } finally {
        clearTimeout(timeoutId);
    }
}

const normalizeTitle = (value?: string) => (value || '').trim().toLowerCase();

const isLegacyDefaultMenu = (menus: Menu[], location?: 'header' | 'footer' | 'account') => {
    if (!menus.length) {
        return false;
    }

    const titles = menus.map((item) => normalizeTitle(item.title));

    if (location === 'account') {
        return titles.includes('sản phẩm') && titles.includes('bài viết');
    }

    return titles.includes('trang chủ')
        && titles.includes('sản phẩm')
        && titles.includes('bài viết')
        && titles.includes('giới thiệu');
};

export async function getPublicHomeData(): Promise<IPublicHomePayload | null> {
    const response = await requestJson<{ data: IPublicHomePayload }>('home');
    return withDemoHomeFallback(response?.data || null);
}

export async function getPublicActions(limit = 12): Promise<IPublicTemplatePost[]> {
    const safeLimit = Math.max(1, Number(limit || 12));
    const fetchLimit = Math.min(200, Math.max(24, safeLimit * 6));

    const response = await requestJson<{ data: IPublicTemplatePost[] }>(`posts${objectToSearchParams({ limit: fetchLimit })}`);
    const posts = response?.data || [];
    const actions = posts.filter(isActionPost);

    return actions.slice(0, safeLimit);
}

export async function getPublicHighlights(limit = 12): Promise<IPublicHighlightCard[]> {
    const response = await requestJson<{ data: IPublicHighlightCard[] }>(`highlights${objectToSearchParams({ limit })}`);
    return appendDemoHighlights(response?.data || [], limit);
}

export async function getPublicStoreItems(limit = 12): Promise<IPublicStoreItem[]> {
    const response = await requestJson<{ data: IPublicStoreItem[] }>(`store-items${objectToSearchParams({ limit })}`);
    return appendDemoStoreItems(response?.data || [], limit);
}

export async function getPublicPosts(limit = 12): Promise<IPublicTemplatePost[]> {
    const response = await requestJson<{ data: IPublicTemplatePost[] }>(`posts${objectToSearchParams({ limit })}`);
    return response?.data || [];
}

export async function getPublicPostBySlug(slug: string): Promise<IPublicTemplatePost | null> {
    const response = await requestJson<{ data: IPublicTemplatePost }>(`posts/${slug}`);
    return response?.data || null;
}

export async function getPublicMenus(location?: 'header' | 'footer' | 'account'): Promise<Menu[]> {
    const preferTemplateMenus = process.env.NODE_ENV === 'development';

    if (preferTemplateMenus) {
        return toFallbackMenus(location);
    }

    const response = await requestJson<{ data: Menu[] }>(`menus${objectToSearchParams({ location })}`);
    const menus = response?.data || [];

    return menus.length ? menus : toFallbackMenus(location);
}

export async function getPublicSections(page?: 'home' | 'venue_detail' | 'match_listing' | 'store'): Promise<IPublicTemplateSection[]> {
    const response = await requestJson<{ data: IPublicTemplateSection[] }>(`sections${objectToSearchParams({ page })}`);
    return response?.data || [];
}

const normalizeForCompare = (value?: string) => (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isActionPost = (post: IPublicTemplatePost) => normalizeForCompare(post.category) === 'tap yoga';

const isCoursePost = (post: IPublicTemplatePost) => normalizeForCompare(post.category) === 'khoa hoc';

export async function getPublicCourses(limit = 12): Promise<IPublicTemplatePost[]> {
    const safeLimit = Math.max(1, Number(limit || 12));
    const fetchLimit = Math.min(200, Math.max(24, safeLimit * 6));

    const response = await requestJson<{ data: IPublicTemplatePost[] }>(`posts${objectToSearchParams({ limit: fetchLimit })}`);
    const posts = response?.data || [];
    const courses = posts.filter(isCoursePost);

    return courses.slice(0, safeLimit);
}

const discoveryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicHome: builder.query<{ data: IPublicHomePayload }, void>({
            query: () => 'home',
        }),
        getPublicAction: builder.query<{ data: IPublicTemplatePost[] }, { limit?: number } | void>({
            query: (params) => `actions${objectToSearchParams({ limit: params?.limit })}`,
        }),
        getPublicCourses: builder.query<{ data: IPublicTemplatePost[] }, { limit?: number } | void>({
            query: (params) => `courses${objectToSearchParams({ limit: params?.limit })}`,
        }),
        getPublicStoreItems: builder.query<{ data: IPublicStoreItem[] }, { limit?: number } | void>({
            query: (params) => `store-items${objectToSearchParams({ limit: params?.limit })}`,
        }),
    }),
});

export const {
    useGetPublicHomeQuery,
    useGetPublicActionQuery,
    useGetPublicCoursesQuery,
    useGetPublicStoreItemsQuery,
} = discoveryApi;
