import { useAppSelector } from '@/store/hooks';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react'
import { FLIGHT_DATE_KEY, SLUG_PERMALINK_KEY } from '../constants/searchParams';
import { VI_DATE_FORMAT } from '@/constants/ui';
import dayjs from 'dayjs';
import usePathUrlToSlugOfSearch from './usePathUrlToSlugOfSearch';
type initUrlParam = {
    [k: string]: string
}
const useInitUrlParamOfSearch = (): initUrlParam => {
    const flightDateKey = FLIGHT_DATE_KEY;
    const slugPermalinkKey = SLUG_PERMALINK_KEY;
    const searchParams = useSearchParams();
    const search = useAppSelector((state) => state.search);
    const slug = usePathUrlToSlugOfSearch();
    const initUrlParams = useMemo(() => {
        let currentUrl = search.pathWithParam ?? searchParams?.toString();
        let currentUrlObj = Object.fromEntries(new URLSearchParams(currentUrl));
        /** Init flight date if not exist */
        currentUrlObj[flightDateKey] = currentUrlObj[flightDateKey] ?? null;
        /** Convert pathname to param */
        currentUrlObj[slugPermalinkKey] = slug;
        return currentUrlObj;
    }, [search.pathWithParam, slug, flightDateKey, searchParams, slugPermalinkKey])
    return initUrlParams;
}

export default useInitUrlParamOfSearch