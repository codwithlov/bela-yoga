import { API_PATH, BASE_URL, FETCH_API_REVALIDATE, FETCH_API_TIMEOUT_MS } from '@/constants/api';
import { IOrganizationAvailabilityQuery, IOrganizationAvailabilityResponse, IOrganizationCard, IOrganizationDetail } from '@/interfaces/organization';
import { baseApi } from './baseApi';
import { appendDemoOrganizations, getDemoOrganizationAvailability, getDemoOrganizationBySlug } from './publicDemoData';

const buildApiUrl = (path: string) => `${BASE_URL}${API_PATH}${path}`;

const objectToSearchParams = (params: Record<string, string | number | undefined | null> | undefined) => {
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

async function requestJson<T>(path: string, init?: RequestInit): Promise<T | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_API_TIMEOUT_MS);

    try {
        const response = await fetch(buildApiUrl(path), {
            ...init,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...(init?.headers || {}),
            },
            next: {
                revalidate: FETCH_API_REVALIDATE,
            },
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

export async function getOrganizations(params?: { per_page?: number }): Promise<IOrganizationCard[]> {
    const query = objectToSearchParams({ per_page: params?.per_page });
    const response = await requestJson<{ data: IOrganizationCard[] }>(`organizations${query}`);

    return appendDemoOrganizations(response?.data || [], params?.per_page);
}

export async function getOrganizationBySlug(slug: string): Promise<IOrganizationDetail | null> {
    const response = await requestJson<{ data: IOrganizationDetail }>(`organizations/${slug}`);
    return response?.data || getDemoOrganizationBySlug(slug);
}

export async function getOrganizationAvailability(
    slug: string,
    params: IOrganizationAvailabilityQuery,
): Promise<IOrganizationAvailabilityResponse | null> {
    const query = objectToSearchParams({
        date: params.date,
        start_time: params.start_time,
        end_time: params.end_time,
        sport_type: params.sport_type,
        field_format: params.field_format,
    });
    const response = await requestJson<{ data: IOrganizationAvailabilityResponse }>(`organizations/${slug}/availability${query}`);

    return response?.data || getDemoOrganizationAvailability(slug, params);
}

const organizationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrganizations: builder.query<{ data: IOrganizationCard[] }, { per_page?: number } | void>({
            query: (params) => `organizations${objectToSearchParams({ per_page: params?.per_page })}`,
        }),
        getOrganizationBySlug: builder.query<{ data: IOrganizationDetail }, string>({
            query: (slug) => `organizations/${slug}`,
        }),
        getOrganizationAvailability: builder.query<{ data: IOrganizationAvailabilityResponse }, { slug: string } & IOrganizationAvailabilityQuery>({
            query: ({ slug, ...params }) => `organizations/${slug}/availability${objectToSearchParams(params)}`,
        }),
    }),
});

export const {
    useGetOrganizationsQuery,
    useGetOrganizationBySlugQuery,
    useGetOrganizationAvailabilityQuery,
} = organizationsApi;
