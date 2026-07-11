export interface IListingSchedule {
    tour_id: number,
    flight_date: string,
    remaining_seats: number,
    series_code: string,
    price_inf: string,
    price_chd: string,
    price_adl: string,
    from: string,
}

export interface IListingScheduleDetail extends IListingSchedule {
    tour_name: string,
}