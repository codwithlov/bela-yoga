import { IApiResponse } from "@/interfaces/apiResponse";
import { baseApi } from "./baseApi";
import { IListingSummary } from "@/interfaces/listing";
import { TOUR } from "@/constants/route";

type ListingsResponse = {
    success: string,
    message: string,
    data: IListingSummary[],
    pagination: any | []
};

type ListingSummaryResponse = {
    data: IListingSummary[] | null
}

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // getListings: builder.query<ListingsResponse, any>({
        //     query: (param) => `tour${param}&method=paginate`,
        // }),
        getListings: builder.query<ListingsResponse, any>({
            query: (param) => `tour/retail-tour-list${param}&method=paginate`,
        }),
        getListingDetailById: builder.query<any, any>({
            query: (listingId) => ({ url: `tour/${listingId}` }),
        }),
        getRecentlyViewedListings: builder.query<ListingSummaryResponse, any>({
            query: (param) => `tour/recently-view${param}`
        }),
        getLowestDayTravelListing: builder.query({
            query: (param) => `tour/sort-day-night-lowest${param}`
        }),
        getLowestFlightDateTravelListing: builder.query({
            query: (param) => `tour/sort-flight-date-lowest${param}`
        }),
        getLowestPriceTravelListing: builder.query({
            query: (param) => `tour/sort-ticket-price-lowest${param}`
        }),
        getListingSchedules: builder.query<any, string>({
            query: (listingSlug) => ({ url: `tour/list-calendar-tour?slug=${listingSlug}` }),
        }),
        getRelatedListings: builder.query<ListingSummaryResponse, any>({
            query: (param) => `tour/relation-tour/${param}`
        }),
        getFeaturedListings: builder.query<ListingSummaryResponse, any>({
            query: (param) => `tour/tour-push-sale-by-search?${param}`
        }),
        getListingsByMarket: builder.query<ListingSummaryResponse, any>({
            query: (marketId) => `${TOUR}/tour-by-market/${marketId}`
        }),
        saveListingBooking: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `tour/${body.tour_id}/booking`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token'
                    },
                    body: JSON.stringify(body),
                }
            },
        }),
        cloneListing: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `tour/clone-tour`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token'
                    },
                    body: JSON.stringify(body),
                }
            },
        }),
    }),
})
export { extendedApi as api };
export const {
    useGetListingsQuery,
    useGetListingDetailByIdQuery,
    useGetRecentlyViewedListingsQuery,
    useGetLowestDayTravelListingQuery,
    useGetLowestFlightDateTravelListingQuery,
    useGetLowestPriceTravelListingQuery,
    useGetListingSchedulesQuery,
    useGetFeaturedListingsQuery,
    useGetListingsByMarketQuery,
    useLazyGetListingsByMarketQuery,
    useSaveListingBookingMutation,
    useGetRelatedListingsQuery,
    useCloneListingMutation,
} = extendedApi;
