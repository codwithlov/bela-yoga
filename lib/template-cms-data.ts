export type AdminTemplatePost = {
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
};

export type AdminTemplatePostCategory = {
    id: number;
    name: string;
    sort_order: number;
    status: 'active' | 'hidden';
};

export type AdminTemplateStoreItem = {
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
};

export type AdminTemplateMenuItem = {
    id: number;
    title: string;
    path: string;
    location: 'header' | 'footer' | 'account';
    parent_id: number | null;
    sort_order: number;
    badge: string | null;
    page_type: 'custom' | 'post' | 'cms_page';
    page_ref: number | null;
    custom_page?: AdminTemplateCustomPage | null;
};

export type AdminTemplateCustomPageSection = {
    id: number;
    title: string;
    summary: string;
    content: string;
    cta_label: string | null;
    cta_href: string | null;
    sort_order: number;
};

export type AdminTemplateCustomPage = {
    eyebrow: string;
    summary: string;
    content: string;
    sections: AdminTemplateCustomPageSection[];
    related_post_ids: number[];
    keywords: string;
    meta_title: string;
    meta_description: string;
};

export type AdminTemplatePage = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: 'draft' | 'published';
    keywords: string;
    meta_title: string;
    meta_description: string;
    canonical: string;
    index: boolean;
    follow: boolean;
};

export type AdminTemplateSection = {
    id: number;
    page: 'home' | 'venue_detail' | 'match_listing' | 'store';
    name: string;
    type: 'hero' | 'listing' | 'cta' | 'feature_grid' | 'faq';
    status: 'active' | 'draft';
    display_order: number;
    summary: string;
};

// Demo seed data đã được vô hiệu hóa.
// Hệ thống chỉ đọc/ghi dữ liệu từ DB.
export const demoAdminPosts: AdminTemplatePost[] = [];

// Demo seed data đã được vô hiệu hóa.
// Hệ thống chỉ đọc/ghi dữ liệu từ DB.
export const demoAdminPostCategories: AdminTemplatePostCategory[] = [];

// Demo seed data đã được vô hiệu hóa.
// Hệ thống chỉ đọc/ghi dữ liệu từ DB.
export const demoAdminStoreItems: AdminTemplateStoreItem[] = [];

// Demo seed data đã được vô hiệu hóa.
// Hệ thống chỉ đọc/ghi dữ liệu từ DB.
export const demoAdminMenuItems: AdminTemplateMenuItem[] = [];

// Demo seed data đã được vô hiệu hóa.
// Hệ thống chỉ đọc/ghi dữ liệu từ DB.
export const demoAdminPages: AdminTemplatePage[] = [];

// Demo seed data đã được vô hiệu hóa.
// Hệ thống chỉ đọc/ghi dữ liệu từ DB.
export const demoAdminSections: AdminTemplateSection[] = [];
