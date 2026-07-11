import { PostType } from "./post";
import { IAuthor } from "./user";

export interface IArticle {
    description: string,
    question: string,
    info: string,
    name: string,
    market_type_slug: string,
    market_type_name: string,
    slug_permalink: any,
    created_at: string,
    updated_at: string,
}

export interface IArticleSchema {
    slug: string;
    title: string;
    imageUrl: string;
    description: string;
    datePublished: string;
    dateModified: string;
}

export interface IPost {
    id: number;
    post_type_id: number;
    post_type: PostType;
    meta_title: string;
    meta_description: string;
    description: string;
    slug: string;
    publish_date: string;
    created_at: string;
    full_name: string;
    outgoing_link_count: number;
    author: IAuthor;
    defaultAuthor: IAuthor;
}