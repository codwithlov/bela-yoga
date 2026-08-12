import {
    IAdminBookingRow,
    IAdminCustomerRow,
    IAdminPostCategory,
    IAdminMenuItemRow,
    IAdminMenuTargetOption,
    IAdminOrganizationRow,
    IAdminOverviewPayload,
    IAdminPostRow,
    IAdminRoleRow,
    IAdminSectionRow,
    IAdminStoreItemRow,
    IAdminUserRow,
    IAdminVenueRow,
} from '@/interfaces/admin';
import { baseApi } from './baseApi';

type CreateAdminUserPayload = {
    username: string;
    fullName?: string;
    phone?: string;
    role: 'ADMIN' | 'USER';
    password: string;
};

type UpdateAdminUserPayload = {
    userId: string;
    role?: 'ADMIN' | 'USER';
    fullName?: string;
    phone?: string;
    password?: string;
};

const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminOverview: builder.query<{ data: IAdminOverviewPayload }, void>({
            query: () => 'admin/overview',
        }),
        getAdminOrganizations: builder.query<{ data: { organizations: IAdminOrganizationRow[] } }, void>({
            query: () => 'admin/organizations',
        }),
        getAdminVenues: builder.query<{ data: { venues: IAdminVenueRow[] } }, void>({
            query: () => 'admin/venues',
        }),
        getAdminBookings: builder.query<{ data: { bookings: IAdminBookingRow[] } }, void>({
            query: () => 'admin/bookings',
        }),
        getAdminUsers: builder.query<{ data: { users: IAdminUserRow[] } }, void>({
            query: () => 'admin/users',
        }),
        createAdminUser: builder.mutation<{ data: IAdminUserRow }, CreateAdminUserPayload>({
            query: (payload) => ({
                url: 'admin/users',
                method: 'POST',
                body: payload,
            }),
        }),
        updateAdminUser: builder.mutation<{ data: IAdminUserRow }, UpdateAdminUserPayload>({
            query: ({ userId, ...payload }) => ({
                url: `admin/users/${userId}`,
                method: 'PATCH',
                body: payload,
            }),
        }),
        getAdminRoles: builder.query<{ data: { roles: IAdminRoleRow[] } }, void>({
            query: () => 'admin/roles',
        }),
        getAdminPosts: builder.query<{ data: { posts: IAdminPostRow[]; categories: IAdminPostCategory[] } }, void>({
            query: () => 'admin/posts',
        }),
        getAdminStoreItems: builder.query<{ data: { store_items: IAdminStoreItemRow[] } }, void>({
            query: () => 'admin/store-items',
        }),
        getAdminMenus: builder.query<{ data: { menus: IAdminMenuItemRow[]; post_options: IAdminMenuTargetOption[]; page_options: IAdminMenuTargetOption[] } }, void>({
            query: () => 'admin/menus',
        }),
        getAdminSections: builder.query<{ data: { sections: IAdminSectionRow[] } }, void>({
            query: () => 'admin/sections',
        }),
        getAdminCustomers: builder.query<{ data: { customers: IAdminCustomerRow[] } }, void>({
            query: () => 'admin/customers',
        }),
    }),
});

export const {
    useGetAdminOverviewQuery,
    useGetAdminOrganizationsQuery,
    useGetAdminVenuesQuery,
    useGetAdminBookingsQuery,
    useGetAdminUsersQuery,
    useCreateAdminUserMutation,
    useUpdateAdminUserMutation,
    useGetAdminRolesQuery,
    useGetAdminPostsQuery,
    useGetAdminStoreItemsQuery,
    useGetAdminMenusQuery,
    useGetAdminSectionsQuery,
    useGetAdminCustomersQuery,
} = adminApi;
