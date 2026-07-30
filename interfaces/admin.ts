export interface IAdminOverviewMetricSet {
    organizations_count: number;
    venues_count: number;
    bookings_count: number;
    pending_bookings_count: number;
    confirmed_bookings_count: number;
    users_count: number;
    roles_count: number;
    matches_count: number;
    monthly_revenue: string | number;
    currency: string;
}

export interface IAdminBookingRow {
    id: number;
    organization_name: string | null;
    venue_name: string | null;
    user_name: string | null;
    user_email: string | null;
    team_name: string | null;
    starts_at: string | null;
    ends_at: string | null;
    status: string;
    payment_status: string;
    total_amount: string | number;
    currency: string | null;
}

export interface IAdminOrganizationRow {
    id: number;
    name: string;
    slug: string;
    status: string;
    address: string | null;
    manager_name: string | null;
    manager_email: string | null;
    users_count: number;
    venues_count: number;
    teams_count: number;
    bookings_count: number;
}

export interface IAdminVenueRow {
    id: number;
    organization_name: string | null;
    name: string;
    sport_type: string | null;
    venue_type: string;
    field_format: string | null;
    status: string;
    is_bookable: boolean;
    capacity: number | null;
    default_duration_minutes: number | null;
    default_price: string | number | null;
    currency: string | null;
    bookings_count: number;
    next_booking_at: string | null;
}

export interface IAdminUserRow {
    id: number;
    name: string;
    email: string;
    organization_name: string | null;
    role_name: string | null;
    role_code: string | null;
    is_super_admin: boolean;
    permission_codes_count: number;
}

export interface IAdminRoleRow {
    id: number;
    organization_name: string | null;
    name: string;
    code: string;
    is_system: boolean;
    users_count: number;
    permissions_count: number;
    permissions_preview: string[];
}

export interface IAdminPostRow {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    description: string;
    author_name: string;
    status: 'draft' | 'review' | 'published';
    published_at: string | null;
    featured: boolean;
    placement: 'home_hero' | 'news_feed' | 'seo_landing' | 'organization_story';
    keywords: string;
    meta_title: string;
    meta_description: string;
    canonical: string;
    index: boolean;
    follow: boolean;
}

export interface IAdminPostCategory {
    id: number;
    name: string;
    sort_order: number;
    status: 'active' | 'hidden';
}

export interface IAdminStoreItemRow {
    id: number;
    name: string;
    sku: string;
    category: string;
    type: 'product' | 'service' | 'package';
    organization_name: string | null;
    price: number;
    unit: string;
    stock_quantity: number | null;
    status: 'active' | 'draft' | 'hidden';
    featured: boolean;
}

export interface IAdminMenuCustomPageSection {
    id: number;
    title: string;
    summary: string;
    content: string;
    cta_label: string | null;
    cta_href: string | null;
    sort_order: number;
}

export interface IAdminMenuCustomPage {
    eyebrow: string;
    summary: string;
    content: string;
    sections: IAdminMenuCustomPageSection[];
    related_post_ids: number[];
    keywords: string;
    meta_title: string;
    meta_description: string;
}

export interface IAdminMenuItemRow {
    id: number;
    title: string;
    path: string;
    location: 'header' | 'footer' | 'account';
    parent_id: number | null;
    sort_order: number;
    badge: string | null;
    page_type: 'custom' | 'post' | 'cms_page';
    page_ref: number | null;
    custom_page?: IAdminMenuCustomPage | null;
}

export interface IAdminMenuTargetOption {
    id: number;
    title: string;
    path: string;
    type: 'post' | 'cms_page';
    status: string;
}

export interface IAdminSectionRow {
    id: number;
    page: 'home' | 'venue_detail' | 'match_listing' | 'store';
    name: string;
    type: 'hero' | 'listing' | 'cta' | 'feature_grid' | 'faq';
    status: 'active' | 'draft';
    display_order: number;
    summary: string;
}

export interface IAdminCustomerRow {
    id: string;
    name: string | null;
    address: string | null;
    contact: string;
    phone: string | null;
    email: string | null;
    contact_type: 'phone' | 'email';
    source: string;
    status: 'new' | 'contacted' | 'closed';
    request_count: number;
    first_request_at: string;
    last_request_at: string;
    ip_address: string | null;
    user_agent: string | null;
    note: string | null;
}

export interface IAdminOverviewPayload {
    scope: {
        workspace_organization: {
            id: number;
            name: string;
            slug: string;
        } | null;
    };
    metrics: IAdminOverviewMetricSet;
    recent_bookings: IAdminBookingRow[];
    organizations: Array<{
        id: number;
        name: string;
        slug: string;
        status: string;
        users_count: number;
        venues_count: number;
        teams_count: number;
    }>;
}
