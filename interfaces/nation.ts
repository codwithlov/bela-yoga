import { IImage } from "./image";

export interface INationSummary {
    nation_id: number,
    nation_name: string,
    nation_code: string,
    total_tour: number,
    url_media: string,
    slug: string,
    market_type_slug: string,
    images: IImage,
}

export interface INationFilter {
    nation_name: string
}