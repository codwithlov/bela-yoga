import { SlugPermalink } from "./slugPermalink";


export interface ITagBase {
    id: number;
    name: string;
    slug: string;
}

export interface Tag extends ITagBase {
    tagslug: SlugPermalink;
}

export interface ITagType {
    value: number,
    label: string,
    tag_type_id: number,
}