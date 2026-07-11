'use client'
import { GUEST_SEARCH, GUEST_TAGS } from "@/constants/route";
import { useAppSelector } from "@/store/hooks";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import dayjs from "dayjs";
import { VI_DATE_FORMAT } from "@/constants/ui";

interface SearchBarButtonParams {
    iconClass?: string | undefined,
    iconName?: IconDefinition | undefined,
    btnClass?: string | undefined,
    oldSlug?: string | null,
}
const SearchBarButton: React.FC<SearchBarButtonParams> = ({
    iconClass,
    iconName,
    btnClass,
    oldSlug
}) => {
    const searchParams = useSearchParams()
    const oldFlightDate = searchParams?.get('flight_date')

    const search = useAppSelector((state) => state.search);
    const flightDate = search.flightDateParam || oldFlightDate || dayjs().format(VI_DATE_FORMAT);
    const slug = search.slug || oldSlug;

    const keyword = search.keyword;
    const defaultParam = `flight_date=${flightDate}`;
    const pathConvert = slug ? slug : keyword ? `${GUEST_SEARCH}?keyword=${keyword}` : `${search.marketTypeSlug}`;
    let searchPath = pathConvert.search('keyword') == -1 && pathConvert.search(GUEST_TAGS.replace(/\//, '')) == -1 ?
        `${pathConvert}?${defaultParam}` :
        `${pathConvert}`;
    searchPath = !searchPath.startsWith('/', 0) ? `/${searchPath}` : searchPath;
    return <a id="search" href={`${searchPath}`} className={btnClass}>
        <Image src="/assets/icons/search.svg" alt="search-icon" width={24} height={24} />
        <span className='pl-2'>Tìm sân</span>
    </a>;
}

export default SearchBarButton;