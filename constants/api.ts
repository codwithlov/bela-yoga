export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
export const HOST_NAME = process.env.NEXT_PUBLIC_WEB_URL;
export const FETCH_API_REVALIDATE = 24 * 60 * 60; //1 day
export const FETCH_API_TIMEOUT_MS = 2500;
export const AUTO_SAVE_DRAFT_TIME = 60 * 1000; //1 minute
// export const AUTO_SAVE_DRAFT_TIME = 30 * 1000; //1 minute
// export const FETCH_API_REVALIDATE = 3600; // Second

export const GET_METHOD = 'get';
export const FIRST_METHOD = 'first';
export const PAGINATE_METHOD = 'paginate';
