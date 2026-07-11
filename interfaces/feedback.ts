export interface IFeedback {
    id: number;
    g_id?: string;
    avatar_image: string;
    full_name: string;
    feedback_date?: string;
    created_at: string;
    rating: number | string;
    content: string;
    feedback_type: string;
    image_options: string[];
    images?: string[];
}