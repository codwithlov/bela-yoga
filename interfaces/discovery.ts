import { IOrganizationCard } from './organization';
import { Menu } from './menu';

export interface IPublicMatchCard {
    id: number;
    title: string;
    description: string | null;
    organization_name: string | null;
    organization_slug: string | null;
    venue_name: string | null;
    team_name: string | null;
    sport_type: string | null;
    match_type: string;
    participation_mode: string;
    starts_at: string | null;
    ends_at: string | null;
    status: string;
    visibility: string;
    max_participants: number | null;
}

export interface IPublicHighlightCard {
    id: number;
    title: string;
    description: string | null;
    organization_name: string | null;
    venue_name: string | null;
    team_name?: string | null;
    starts_at: string | null;
    status: string;
    source_type: string;
}

export interface IPublicStoreItem {
    id: number;
    organization_id: number;
    organization_name: string | null;
    name: string;
    type: string;
    category: string | null;
    price: string | number | null;
    unit: string | null;
    description: string | null;
    sport_type: string | null;
    field_format: string | null;
    is_addon: boolean;
    stock_quantity: number | null;
}

export interface IPublicTemplatePost {
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

export interface IPublicTemplateSection {
    id: number;
    page: 'home' | 'venue_detail' | 'match_listing' | 'store';
    name: string;
    type: 'hero' | 'listing' | 'cta' | 'feature_grid' | 'faq';
    status: 'active' | 'draft';
    display_order: number;
    summary: string;
}

export interface IPublicHomePayload {
    sections: {
        organizations: IOrganizationCard[];
        matches: IPublicMatchCard[];
        highlights: IPublicHighlightCard[];
        store_items: IPublicStoreItem[];
    };
    template: {
        posts: IPublicTemplatePost[];
        home_sections: IPublicTemplateSection[];
        header_menu: Menu[];
        footer_menu: Menu[];
    };
    summary: {
        organizations_count: number;
        matches_count: number;
        store_items_count: number;
    };
}
