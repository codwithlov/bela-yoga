import { IImage } from "./image";

export interface IListingSummary {
    [key: string]: any;
    tour_id: any,
    market_id: number,
    series_code: string,
    market_name: string,
    market_type_name: string,
    market_type_slug: string,
    market_slug: string,
    tour_name: string,
    nations: any,
    day_number: number,
    night_number: number,
    flight_date: string,
    price_adl: string,
    price_chd: string,
    price_inf: string,
    price_adl_off: string,
    price_chd_off: string,
    price_inf_off: string,
    total_seat: number,
    remaining_seats: number,
    push_sale_price_adl_off: number,
    is_push_sale: number,
    images: IImage[],
}

export interface IListingLowestDay {
    day_number: number,
    night_number: number
}

export interface IListingLowestFlightDate {
    flight_date: string,
}

export interface IListingLowestPrice {
    price_adl: string,
    price_adl_off: string
}
export interface IListingDetail extends IListingSummary {
    flight_date_back: string,
    remaining_seats: number,
    takeoff_time: string,
    takeoff_time_back: string,
    tour_guide_full_name: string,
    tour_guide_phone: string,
    arrive_time: string,
    arrive_time_back: string,
    shcb: string,
    shcb_back: string,
}