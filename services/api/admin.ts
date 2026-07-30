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
    useGetAdminRolesQuery,
    useGetAdminPostsQuery,
    useGetAdminStoreItemsQuery,
    useGetAdminMenusQuery,
    useGetAdminSectionsQuery,
    useGetAdminCustomersQuery,
} = adminApi;
