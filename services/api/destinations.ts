import { baseApi } from "./baseApi";
import { IApiResponse } from "@/interfaces/apiResponse";
import { DESTINATION } from "@/constants/route";
import { postRequest, toQueryString } from "@/utils/apiUtils";
import { IDestinationBase } from "@/interfaces/destination";

type ListResponse = { data: any, pagination: any, nations: any };
type PostsResponse = {
    success: boolean,
    message: string,
    data: IDestinationBase[]
};

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDestinationOptionList: builder.query<PostsResponse, any>({
            query: (params) => `destination/option-list${params}`,
        }),
        getDestinations: builder.query<ListResponse, any>({
            query: (params) => `destination${toQueryString(params)}`,
        }),
        createEditDestinations: builder.query<IApiResponse, any>({
            query: (params) => `${DESTINATION}/${params}`,
        }),
        storeOrUpdateDestination: builder.mutation<IApiResponse, any>({
            query(body) { return postRequest(body.url, body.data) }
        }),
        deleteDestination: builder.mutation<IApiResponse, any>({
            query(body) { return postRequest(`${DESTINATION}/${body.id}`, null, 'DELETE') }
        })
    }),
})

export const {
    useGetDestinationOptionListQuery,
    useGetDestinationsQuery,
    useCreateEditDestinationsQuery,

    useStoreOrUpdateDestinationMutation,
    useDeleteDestinationMutation,
} = extendedApi;