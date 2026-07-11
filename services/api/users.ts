import { IUser } from "@/interfaces/user";
import { baseApi } from "./baseApi";
import { IApiResponse } from "@/interfaces/apiResponse";

type PostsResponse = IUser[];

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<PostsResponse, { name: string, id: string }>({
            query: (name) => 'users',
        }),
        getUser: builder.query<PostsResponse, void>({
            query: () => 'users',
        }),
        refreshToken: builder.mutation<IApiResponse, any>({
            query(body) {
                return {
                    url: `user/refresh-token`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                    },
                    body: JSON.stringify(body),
                }
            }
        }),
        logout: builder.mutation<IApiResponse, any>({
            query(TOKEN) {
                return {
                    url: `user/logout`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-STATIC-SITE-TOKEN": 'token',
                        'Authorization': `Bearer ${TOKEN}`
                    }
                }
            }
        })
    }),
})

export { extendedApi as usersApi };

export const {
    useGetUserQuery,
    useGetUsersQuery,
    useRefreshTokenMutation,
    useLogoutMutation
} = extendedApi;