import { postRequest, toQueryString } from "@/utils/apiUtils";
import { baseApi } from "./baseApi";
import { GALLERY_IMAGE } from "@/constants/route";

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getImages: builder.query<any, any>({
            query: (params) => `${GALLERY_IMAGE}/list-image${toQueryString(params)}`,
        }),
        deleteImage: builder.mutation<any, any>({
            query(body) { return postRequest(`${GALLERY_IMAGE}`, body, 'DELETE') }
        })
    }),
})

export const {
    useGetImagesQuery,

    useDeleteImageMutation,
} = extendedApi;