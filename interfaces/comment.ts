export interface IComment {
    avatar_image: string;
    full_name: string;
    publish_date?: string;
    created_at: string;
    rating: number | string;
    content: string;
    images?: string[];
}