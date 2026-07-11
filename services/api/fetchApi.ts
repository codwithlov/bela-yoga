import { cookies } from 'next/headers';
import { ACCESS_TOKEN_SESSION } from '@/constants/user';
import { API_PATH, BASE_URL, FETCH_API_REVALIDATE } from '@/constants/api';
import { redirect } from 'next/navigation';
import { GUEST_500 } from '@/constants/route';
import { STATUS_408, STATUS_504 } from '@/constants/status';
const fetchApi = async ({
    urlPath,
    isNoCache,
    allResponse,
    shouldRedirectOnError = true,
}: {
    urlPath: string;
    isNoCache?: boolean;
    allResponse?: boolean;
    shouldRedirectOnError?: boolean;
}) => {
    let statusCode = 0;
    try {
        const cookieStore = await cookies();
        let token = cookieStore.get(ACCESS_TOKEN_SESSION)?.value || '';
        token = token?.replace(/^"(.*)"$/, '$1');
        const baseUrl = `${BASE_URL}${API_PATH}`;
        let options: any = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
        if (!isNoCache) {
            options.next = { tags: ["all"], revalidate: FETCH_API_REVALIDATE };
        } else {
            options.cache = 'no-store';
        }
        options.signal = AbortSignal.timeout(60000) // one minute
        const response = await fetch(`${baseUrl}${urlPath}`, options);
        if (response.ok) {
            let responseData: any;
            if (allResponse) {
                responseData = (await response.json());
            } else {
                responseData = (await response.json()).data;
            }
            return responseData;
        } else {
            statusCode = response.status;
        }
    } catch (error: any) {
        if (error.name === "TimeoutError") {
            statusCode = STATUS_408;
        } else {
            return null;
        }
    } finally {
        if (shouldRedirectOnError && (statusCode === STATUS_408 || statusCode === STATUS_504)) {
            redirect(GUEST_500);
        }
    }
};

export default fetchApi;