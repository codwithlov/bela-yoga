import { IApiResponse } from "@/interfaces/apiResponse";
import { baseApi } from "./baseApi";
import { INationFilter, INationSummary } from "@/interfaces/nation";

type PostsResponse = {
    success: boolean,
    message: string,
    data: INationSummary[]
};

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNationOptionList: builder.query<PostsResponse, any>({
            query: (param) => `nation/option-list${param}`,
        }),
    }),
})
export { extendedApi as nationApi };
export const { useGetNationOptionListQuery } = extendedApi;


