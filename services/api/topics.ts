import { IApiResponse } from "@/interfaces/apiResponse";
import { baseApi } from "./baseApi";
import { ITopicSummary } from "@/interfaces/topic";
import { TOPIC } from "@/constants/route";

type PostsResponse = {
    success: string,
    message: string,
    data: ITopicSummary[],
    draftCount: number,
    draftList: any[],
    pagination: any | []
};
type DetailResponse = {
    success: string,
    message: string,
    data: ITopicSummary
};
const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // query list topic
        getAdminTopics: builder.query<PostsResponse, any>({
            query: (param) => `${TOPIC}${param}`,
        }),
        // query list topic
        getTopics: builder.query<PostsResponse, any>({
            query: (param) => `topic${param}`,
        }),
        // query detail topic by slug
        getTopic: builder.query<DetailResponse, any>({
            query: (slug) => `topic/${slug}`
        }),
        storeTopic: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `${TOPIC}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                    },
                    body: JSON.stringify(body),
                }
            }
        }),
        updateTopic: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `${TOPIC}/${body.topic_id}`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                    },
                    body: JSON.stringify(body),
                }
            }
        }),
        deleteTopic: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `${TOPIC}/${body.topic_id}`,
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                    },
                    body: JSON.stringify(body),
                }
            }
        })
    }),
})
export { extendedApi as topicApi };
export const {
    useGetTopicsQuery,
    useGetAdminTopicsQuery,
    useGetTopicQuery,
    useStoreTopicMutation,
    useUpdateTopicMutation,
    useDeleteTopicMutation
} = extendedApi;