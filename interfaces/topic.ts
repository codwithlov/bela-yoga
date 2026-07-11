export interface ITopicSummary {
    topic_id?: number,
    name: string,
    slug: string,
    is_active?: number,
    deleted?: boolean,
    iconTitle?: string,
    iconSize?: number,
    type?: string,
    start_date?: string,
    end_date?: string,
    isShowTimer?: boolean,
}

export interface IAdminTopicSummary {
    key: React.Key;
    name: string;
    slug: string;
    is_active: number | boolean;
    deleted: number | boolean;
    topic_id: number;
    parent_id: number | null;
    meta_title: string;
    meta_description: string;
    canonical: string;
    index: number;
    follow: number;
    type: any;
    start_date: any;
    end_date: any;
    sort_order: any;
    description: string;
    question: string;
    info: string;
}