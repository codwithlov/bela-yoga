import { IMarketSummary } from "@/interfaces/market";
import { baseApi } from "./baseApi";
import { IApiResponse } from "@/interfaces/apiResponse";
import { GUEST_MARKET, MARKET } from "@/constants/route";

type PostsResponse = {
    success: boolean,
    message: string,
    data: IMarketSummary[],
    pagination: any | []
};

type MarketFilterResponse = {
    success: boolean,
    message: string,
    data: IMarketSummary
};

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMarkets: builder.query<PostsResponse, any>({
            query: (param) => `${GUEST_MARKET}${param}`,
        }),
        getMarketOptionList: builder.query<PostsResponse, any>({
            query: (param) => `${GUEST_MARKET}/option-list${param}`
        }),
        getMarketSummaryBySearch: builder.query<PostsResponse, any>({
            query: (param) => `${GUEST_MARKET}/market-summary-by-search${param}`
        }),
        getMarketOtherInfoBySearch: builder.query({
            query: (param) => `${GUEST_MARKET}/market-other-info-by-search${param}`
        }),
        getMarketRecentlyView: builder.query<PostsResponse, any>({
            query: (param) => `${GUEST_MARKET}/market-recently-view${param}`
        }),
        getMarketRelated: builder.query<PostsResponse, any>({
            query: (param) => `${GUEST_MARKET}/market-related?slug=${param}`
        }),
        getMarketImages: builder.query<MarketFilterResponse, any>({
            query: (market_id) => `${MARKET}/${market_id}/list-image`,
        }),
        getMarketAssignedTopic: builder.query<PostsResponse, any>({
            query: (topic_id) => `${MARKET}/market-assigned-topic/${topic_id}`
        }),
        getMarketNotAssignedTopic: builder.query<PostsResponse, any>({
            query: (topic_id) => `${MARKET}/market-not-assigned-topic/${topic_id}`
        }),
        storeOrUpdateOtherInfos: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `${MARKET}/${body.market_id}/other-infos`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                    },
                    body: JSON.stringify(body),
                }
            }
        }),
        assignedTopic: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `${MARKET}/${body.market_id}/assigned-topic?topic_id=${body.topic_id}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                    },
                    body: JSON.stringify(body),
                }
            }
        }),
        unassignedTopic: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `${MARKET}/${body.market_id}/unassigned-topic?topic_id=${body.topic_id}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                    },
                    body: JSON.stringify(body),
                }
            }
        }),
        cloneMarket: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `${MARKET}/clone-market`,
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
export { extendedApi as marketApi };
export const {
    useGetMarketOptionListQuery,
    useGetMarketSummaryBySearchQuery,
    useGetMarketOtherInfoBySearchQuery,
    useGetMarketRecentlyViewQuery,
    useGetMarketRelatedQuery,
    useGetMarketsQuery,

    useGetMarketAssignedTopicQuery,
    useGetMarketNotAssignedTopicQuery,

    useStoreOrUpdateOtherInfosMutation,
    useAssignedTopicMutation,
    useUnassignedTopicMutation,
    useCloneMarketMutation,
} = extendedApi;