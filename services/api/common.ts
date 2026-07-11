import { baseApi } from "./baseApi";
import { IApiResponse } from "@/interfaces/apiResponse";
import { postRequest } from "@/utils/apiUtils";

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getData: builder.query<any, any>({
            query: (url) => url,
        }),
        postData: builder.mutation<IApiResponse, any>({
            query(body) { return postRequest(body.url, body.data, body.method || 'POST', body.isFormData) }
        }),
        delete: builder.mutation<IApiResponse, any>({
            query(body: any) { return postRequest(body.url, body.data, 'DELETE') }
        }),
    }),
});

export const {
    useGetDataQuery,
    useLazyGetDataQuery,
    usePostDataMutation,
    useDeleteMutation,
} = extendedApi;
