import { API_PATH, BASE_URL } from "@/constants/api";
import { ACCESS_TOKEN_SESSION, REFRESH_TOKEN_SESSION, TOKEN_EXPIRES_TIME, USER_INFO } from "@/constants/user";
import { ILogin, IUser } from "@/interfaces/user";
import dayjs from 'dayjs';
import Cookies from "universal-cookie";
import { isEmpty } from "./helper";

const cookies = new Cookies();

export const getAccessToken = () => cookies.get(ACCESS_TOKEN_SESSION);
export const getRefreshToken = () => cookies.get(REFRESH_TOKEN_SESSION);
export const getTokenExpiresTime = () => cookies.get(TOKEN_EXPIRES_TIME);
export const getUserInfo = () => cookies.get(USER_INFO) as IUser;

export const getTokenData = () => {
    return {
        access_token: getAccessToken(),
        refresh_token: getRefreshToken(),
        expires_at: getTokenExpiresTime(),
    };
}

export const setTokens = (
    accessToken: string,
    refreshToken: string,
    expiresAt: string
) => {
    cookies.set(ACCESS_TOKEN_SESSION, accessToken, { path: '/' });
    cookies.set(REFRESH_TOKEN_SESSION, refreshToken, { path: '/' });
    cookies.set(TOKEN_EXPIRES_TIME, expiresAt, { path: '/' });
};

export const setUserInfo = (user: IUser) => {
    cookies.set(USER_INFO, user, { path: '/' });
}

export const removeTokens = () => {
    cookies.remove(ACCESS_TOKEN_SESSION, { path: '/' });
    cookies.remove(REFRESH_TOKEN_SESSION, { path: '/' });
    cookies.remove(TOKEN_EXPIRES_TIME, { path: '/' });
    cookies.remove(USER_INFO, { path: '/' });
};

export const isTokenExpired = (time?: any) => {
    const expiresAt = time || getTokenExpiresTime();
    return dayjs(expiresAt).isBefore(dayjs());
};

export const checkToken = async () => {
    const access_token = getAccessToken();
    const gefresh_token = getRefreshToken();
    if (!access_token) {
        return { access_token: null, isAuth: false };
    }
    return { access_token, gefresh_token, isAuth: true };
};

export async function refreshToken() {
    try {
        const refresh_token = getRefreshToken();
        if (isEmpty(refresh_token)) {
            return {
                access_token: null,
                refresh_token: null,
                isAuth: false,
                is_empty_refresh_token: true,
            };
        } else {
            const formData = {
                access_token: getAccessToken(),
                refresh_token: refresh_token,
            }
            const refreshUrl = `${BASE_URL}${API_PATH}user/refresh-token`;
            const response = await fetch(refreshUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "X-STATIC-SITE-TOKEN": 'token',
                },
                body: JSON.stringify(
                    formData
                )
            })
            if (response.ok) {
                // removeTokens();
                const payload = await response.json();
                await handleStoreCookies(payload?.data);
                return {
                    access_token: payload?.data?.access_token,
                    refresh_token: payload?.data?.refresh_token,
                    isAuth: true
                };
            } else {
                // console.log(await response.json())
                throw new Error('Failed to refresh token');
            }
        }
    } catch (error) {
        console.log('Refresh token error', error);
        return { access_token: null, refresh_token: null, isAuth: false };
    }
}

export const handleStoreCookies = (data: ILogin) => {
    return new Promise((resolve, reject) => {
        try {
            let access_token = JSON.stringify(data?.access_token);
            let refresh_token = JSON.stringify(data?.refresh_token);
            let expires_at = JSON.stringify(data?.expires_at);
            setTokens(access_token, refresh_token, expires_at);
            setUserInfo(data?.user_info);
            resolve('OK');
        } catch (error) {
            reject(error);
            console.error(error);
        }
    });
}