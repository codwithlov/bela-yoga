import { API_PATH, BASE_URL } from '@/constants/api';
import { getAccessToken, getTokenData, refreshToken, removeTokens } from '@/utils/authenticate';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ADMIN_LOGIN } from '@/constants/route';
import { isEmpty } from '@/utils/helper';
import { responseMessages } from '@/constants/ui';
import { Mutex } from 'async-mutex'
import { getAdminPathFromPermissions } from '../../utils/adminNavigation';
import { showErrorToastr } from '@/utils/toastr';

let counterOpenNotify = 0;
const PERMISSION_DENIED = 'PERMISSION_DENIED';
const NOT_FOUND_TOKEN = 'NOT_FOUND_TOKEN';
const MISSING_TOKEN = 'MISSING_TOKEN';
const REFRESH_TOKEN_EXPIRES = 'REFRESH_TOKEN_EXPIRES';
const ACCESS_TOKEN_EXPIRES = 'ACCESS_TOKEN_EXPIRES';
const ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';
const ACCOUNT_NOT_ACTIVE = 'ACCOUNT_NOT_ACTIVE';

const openNotification = (message: string, errorType?: string, permissions?: string[]) => {
    const okFunc = () => {
        if (errorType == PERMISSION_DENIED) {
            let firstHref = getAdminPathFromPermissions(permissions);
            setTimeout(() => {
                window.location.href = firstHref;
            })
        } else {
            removeTokens();
            counterOpenNotify--;
            window.location.href = ADMIN_LOGIN;
        }

    }
    if (counterOpenNotify == 0) {
        counterOpenNotify++;
        showErrorToastr(responseMessages[message] || message);
        setTimeout(() => {
            okFunc();
        }, 1200);
    }
};

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}${API_PATH}`,
    prepareHeaders: async (headers) => {
        const token = getAccessToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// && typeof window !== 'undefined'

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && !isEmpty(result.error)) {
        const error = (result.error as any)?.data as any;
        const errorStatus = error?.data ?? error?.code ?? '';
        const errorMessage = error?.message || (result.error as any)?.error || 'server_error';
        const errorStatusCode = (result.error as any)?.status;
        if (errorStatusCode === 401) {
            if (errorStatus === ACCESS_TOKEN_EXPIRES || errorStatus === NOT_FOUND_TOKEN) {
                // checking whether the mutex is locked
                if (!mutex.isLocked()) {
                    const release = await mutex.acquire();
                    try {
                        const { isAuth, is_empty_refresh_token } = await refreshToken();
                        if (is_empty_refresh_token) {
                            openNotification('missing_token');
                        } else {
                            if (isAuth) {
                                result = await baseQuery(args, api, extraOptions);
                            } else {
                                // Token refresh failed, remove tokens and redirect to login
                                openNotification('not_found_token');
                            }
                        }
                    } finally {
                        // release must be called once the mutex should be released again.
                        release();
                    }
                } else {
                    // wait until the mutex is available without locking it
                    await mutex.waitForUnlock()
                    result = await baseQuery(args, api, extraOptions)
                }
                // } else if (errorStatus === NOT_FOUND_TOKEN) {
                // openNotification(errorMessage);
                // await mutex.waitForUnlock()
                // result = await baseQuery(args, api, extraOptions)
            } else if (
                errorStatus === MISSING_TOKEN
                || errorStatus === ACCOUNT_NOT_FOUND
                || errorStatus === ACCOUNT_NOT_ACTIVE
            ) {
                openNotification(errorMessage);
            }
        }
        if (errorStatusCode === 403) {
            if (errorStatus === PERMISSION_DENIED) {
                const permissions = Array.isArray(error?.permissions) ? error.permissions : [];
                openNotification(
                    errorStatus.toLowerCase(),
                    'PERMISSION_DENIED',
                    permissions
                );
            }
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'baseAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
