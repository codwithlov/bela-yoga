
export const postRequest = (url: string, body: any, method?: any, isFormData?: boolean) => ({
    url,
    method: method || 'POST',
    headers: isFormData ? {} : {
        'Content-Type': 'application/json',
        "X-STATIC-SITE-TOKEN": 'token',
    },
    body: isFormData ? body : JSON.stringify(body),
});

export function toQueryString(params: object, useQuestionMark: boolean = true): string {
    let queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    let questionMark = useQuestionMark ? '?' : '';
    return questionMark + queryString;
}
