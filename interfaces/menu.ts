import { SlugPermalink } from "./slugPermalink";

export interface MenuCustomPageSection {
    id: number;
    title: string;
    summary: string;
    content: string;
    cta_label: string | null;
    cta_href: string | null;
    sort_order: number;
}

export interface MenuCustomPage {
    eyebrow: string;
    summary: string;
    content: string;
    sections: MenuCustomPageSection[];
    related_post_ids: number[];
    keywords: string;
    meta_title: string;
    meta_description: string;
}

export interface Menu {
    title: string;
    slug_permalink_id?: number;
    slug_permalink?: SlugPermalink;
    url_to?: string;
    slug?: string;
    page_type?: 'custom' | 'post' | 'cms_page';
    page_ref?: number | null;
    custom_page?: MenuCustomPage | null;
    key: number;
    children?: Menu[];
    image?: any;
}