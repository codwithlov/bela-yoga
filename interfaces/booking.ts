export interface IBookingAddonPayload {
    organization_item_id: number;
    quantity: number;
    note?: string;
}

export interface ICreateBookingPayload {
    organization_id: number;
    organization_venue_id: number;
    team_id?: number | null;
    starts_at: string;
    ends_at: string;
    note?: string;
    addons?: IBookingAddonPayload[];
}

export interface IBookingItem {
    id: number;
    organization_item_id: number;
    item_type: string;
    name_snapshot: string;
    unit_price: number | string;
    quantity: number;
    total_amount: number | string;
    note: string | null;
}

export interface IBookingSummary {
    id: number;
    organization_id: number;
    organization_venue_id: number;
    booked_by_user_id?: number;
    team_id: number | null;
    starts_at: string;
    ends_at: string;
    duration_minutes: number;
    pricing_rule_id: number | null;
    field_price_amount: number | string;
    addon_total_amount: number | string;
    total_amount: number | string;
    currency: string;
    status: string;
    payment_status?: string;
    note: string | null;
    cancelled_at?: string | null;
    match?: {
        id: number | null;
        title?: string | null;
        status: string | null;
    };
    items?: IBookingItem[];
}
