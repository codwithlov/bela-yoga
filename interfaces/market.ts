import { IImage } from "./image"
import { SlugPermalink } from "./slugPermalink";

export interface IMarketSummary {
    market_name: string,
    market_id: number,
    tour_name: string,
    day_number: number,
    night_number: number,
    nation_name: string,
    total_tour: number,
    slug: string,
    min_price_adl: string,
    min_price_adl_off: string,
    max_price_adl: string,
    max_price_adl_off: string,
    min_flight_date: string,
    max_flight_date: string
    images: IImage[],
}
export interface IMarketDetail {
    market_id: number,
    tour_name: string,
    nations: any,
    other_infos: IMarketOtherInfo[],
    market_slug: string;
    min_price_adl_off: number;
    min_price_adl: number;
    price: number;
    is_active: number;
    slugs: Array<any>;
    slugPermalink: SlugPermalink;
    allKeywords: string[];
    images: IImage[];
    rating: number;
    reviewCount: number;
    created_at: string;
    updated_at: string;
}

export interface IMarketOtherInfo {
    tour_ids: any,
    introduction: string,
    description: string,
    price_inclusive_of_info: string,
    price_exclusive_of: string,
    additional_charge_info: string,
    cancel_or_change_info: string,
    visa_info: string,
    other_info: string,
}