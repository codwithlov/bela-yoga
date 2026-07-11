export interface Post {
    id: number;
    type: string;
    description: string;
    deleted: string;
    is_active: string;
}

export interface PostHistory {
    content: any;
    id: number;
    created_at?: string;
    status?: string;
    user_name?: string;
}

export interface PostType {
    value: number,
    label: string,
    slug: string,
    title: string,
    tag_type_id: number,
}