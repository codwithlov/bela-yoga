export interface IOrganizationCard {
    id: number;
    name: string;
    slug: string;
    address: string | null;
    description: string | null;
    featured_image_url: string | null;
}

export interface IOrganizationVenueSummary {
    id: number;
    name: string;
    sport_type: string | null;
    venue_type: string;
    field_format: string | null;
    venue_number: number | null;
    capacity: number | null;
    default_duration_minutes: number | null;
    default_price: string | number | null;
    currency: string | null;
    cover_image_url: string | null;
    description: string | null;
}

export interface IOrganizationDetail extends IOrganizationCard {
    map_pin_url: string | null;
    venues: IOrganizationVenueSummary[];
}

export interface IOrganizationAvailabilityQuery {
    date: string;
    start_time: string;
    end_time: string;
    sport_type?: string;
    field_format?: string;
}

export interface IOrganizationAvailabilityVenue {
    id: number;
    name: string;
    sport_type: string | null;
    venue_type: string;
    field_format: string | null;
    venue_number: number | null;
    cover_image_url: string | null;
    status: string;
    is_bookable: boolean;
    availability: {
        is_available: boolean;
        reason: string | null;
        blocking_range: {
            starts_at: string;
            ends_at: string;
        } | null;
    };
    pricing: {
        pricing_rule_id?: number | null;
        field_price_amount?: number | string | null;
        total_amount?: number | string | null;
        currency?: string | null;
        [key: string]: unknown;
    };
}

export interface IOrganizationAvailabilityResponse {
    organization: {
        id: number;
        name: string;
        slug: string;
    };
    query: {
        sport_type: string | null;
        field_format: string | null;
        date: string;
        start_time: string;
        end_time: string;
        duration_minutes: number;
        timezone: string;
    };
    summary: {
        total_venues: number;
        available_venues: number;
        busy_venues: number;
        maintenance_venues: number;
    };
    venues: IOrganizationAvailabilityVenue[];
}
