
'use client';
import React, { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ListingItemHorizontal from '@/components/guest/ListingItemHorizontal';
import ListingItemVertical from '@/components/guest/ListingItemVertical';
import { HORIZONTAL_VIEW, VERTICAL_VIEW, VI_DATE_FORMAT } from '@/constants/ui';
import SearchViewBy from './SearchViewBy';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Pagination, Skeleton } from 'antd';
import ListingItemSkeletonHorizontal from '@/components/guest/ListingItemSkeletonHorizontal';
import ListingItemSkeletonVertical from '@/components/guest/ListingItemSkeletonVertical';
import { setDefaultPage, setDuringFilter, setSearchResultLoadMore } from '@/store/searchSlice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import useWindowSize from '@/hooks/useWindowSize';
import { useGetMarketSummaryBySearchQuery } from '@/services/api/markets';
import useInitUrlParamOfSearch from '../hooks/useInitUrlParamOfSearch';
import { toQueryString } from '@/utils/apiUtils';
import { FLIGHT_DATE_KEY, SORT_BY_TYPE_KEY } from '../constants/searchParams';
import { IMarketSummary } from '@/interfaces/market';
import { ShowMoreBtn } from '@/components/guest/atoms/ShowMoreBtn';

type SearchResultParam = {
    slugType: string;
    optionListData: any;
    marketData: any;
    slug: string;
}

const SearchResult = React.memo((props: SearchResultParam) => {
    type dynamicObj = {
        [x: string]: any
    }
    const sortByKey = SORT_BY_TYPE_KEY;
    const flightDateKey = FLIGHT_DATE_KEY;
    const pageKey = 'page';
    const limitKey = 'limit';
    const sortByDefault = '';
    const flightDateDefault = dayjs().format(VI_DATE_FORMAT);
    const pageDefault = 1;
    const initLimitDefault = 9;
    const defaultPageSize = 9;

    /** Use Hook */
    const windowSize = useWindowSize();
    const dispatch = useAppDispatch();
    const search = useAppSelector((state) => state.search);
    const [page, setPage] = useState<any>(null);
    const [dataList, setDataList] = useState<any[]>([]);
    const [dataLength, setDataLength] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    let pathname = usePathname();
    const [marketParam, setMarketParam] = useState('');
    const initUrlParamOfSearch = useInitUrlParamOfSearch();
    let marketList: IMarketSummary[] = [];
    const { data: marketData, isFetching: isMarketFetching, refetch } = useGetMarketSummaryBySearchQuery(
        marketParam,
        {
            refetchOnMountOrArgChange: true,
            skip: page == null || !marketParam,
        }
    );
    let pagination = page == null ? props.marketData?.pagination : marketData?.pagination;
    marketList = page == null ? props.marketData?.data : marketData?.data;
    // marketList = page == null ? props.marketData?.data : [];
    // let newListconvert: IMarketSummary[] = [];
    // marketList?.forEach((element: any) => {
    //     if (element.tours.length > 0) {
    //         let tours = [...element.tours];
    //         let images = [...element.imageList];
    //         let imgIndex = Math.floor(Math.random() * images.length);
    //         tours.forEach((t, tIndex) => {
    //             element = { ...element, ...t };
    //             element.images = images[tIndex] ?? images[imgIndex];
    //             element.carrier = element.carrier_logo;
    //             newListconvert.push(element);
    //         });
    //     } else {
    //         newListconvert.push(element);
    //     }
    // });

    useEffect(() => {
        setIsLoading(false);
        dispatch(setSearchResultLoadMore(false));
        if (marketList && marketList?.length as number > 0 && !isMarketFetching) {
            let newListconvert = [] as any[];
            let marketLength = marketList.length as number;
            marketLength = dataLength + marketLength;
            setDataLength(marketLength);
            marketList?.forEach((element: any) => {
                if (element.tours.length > 0) {
                    let tours = [...element.tours];
                    let images = [...element.imageList];
                    let imgIndex = Math.floor(Math.random() * images.length);
                    tours.forEach((t, tIndex) => {
                        element = { ...element, ...t };
                        element.images = images[tIndex] ?? images[imgIndex];
                        element.carrier = element.carrier_logo;
                        newListconvert.push(element);
                    });
                } else {
                    newListconvert.push(element);
                }
            });
            let newList = dataList?.concat(newListconvert);
            setDataList(newList);
        }
    }, [!isMarketFetching])

    const onLoadMore = () => {
        let pageMore = page;
        if (page == null) {
            pageMore = 2;
        } else {
            pageMore++;
        }
        setPage(pageMore);
        dispatch(setSearchResultLoadMore(true));
    }

    const initUrlParams = () => {
        return initUrlParamOfSearch;
    };

    const objToUrlParams = (obj: {}) => {
        return toQueryString(obj, true);
    };

    useEffect(() => {
        if (page !== null) {
            let urlParamObject = initUrlParams();
            urlParamObject = { ...urlParamObject };
            urlParamObject[limitKey] = page == 1 ? initLimitDefault as any : defaultPageSize;
            if (!urlParamObject[sortByKey]) {
                urlParamObject[sortByKey] = sortByDefault;
            };
            // if (!urlParamObject[flightDateKey]) {
            //     urlParamObject[flightDateKey] = flightDateDefault;
            // };
            if (search.isSearchResultLoadMore) {
                urlParamObject[pageKey] = page as any;
            } else {
                setDataLength(0);
                setDataList([]);
                setPage(1);
                urlParamObject[pageKey] = pageDefault as any;
            }

            if (marketParam == objToUrlParams(urlParamObject)) {
                refetch();
            } else {
                setMarketParam(objToUrlParams(urlParamObject));
            }
        } else {
            if (search.isDuringFilter || search.defaultPage == 1) {
                setPage(1);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pathname,
        search.pathWithParam,
        page,
        dispatch,
        search.defaultPage,
        searchParams,
        search.isDuringFilter
    ])

    return (
        <section id='search_result' className='pb-16 mb-1 max-sm:pb-10 max-sm:px-4'>
            <SearchViewBy tourNumber={pagination?.total} tourName={''} slugType={props.slugType} optionListData={props.optionListData} />
            <div className='search_result'>
                <div className='grid grid-cols-12 gap-5'>
                    {
                        dataList && dataList.length > 0 ?
                            dataList.map((tour, index) =>
                                windowSize.width ?
                                    search.viewType == VERTICAL_VIEW && (windowSize.width as number) > 768 ?
                                        <ListingItemVertical
                                            isShowDiscount={true}
                                            key={index}
                                            item={tour}
                                            index={index}
                                            className=' col-span-12 sm:max-md:col-span-6 md:col-span-4 !mb-0'
                                        />
                                        :
                                        <ListingItemHorizontal
                                            key={index}
                                            item={tour}
                                            index={index}
                                        />
                                    : <ListingItemVertical
                                        isShowDiscount={true}
                                        key={index}
                                        item={tour}
                                        index={index}
                                        className=' col-span-12 sm:max-md:col-span-6 md:col-span-4 !mb-0'
                                    />
                            ) : null
                    }
                    {
                        isMarketFetching || isLoading ?
                            Array.from(Array(page == 1 ? initLimitDefault : defaultPageSize))
                                .map((item, index) =>
                                    windowSize.width ?
                                        search.viewType == VERTICAL_VIEW && (windowSize.width as number) > 768 ?
                                            <ListingItemSkeletonVertical
                                                key={index}
                                                className='col-span-12 sm:max-md:col-span-6 md:col-span-4'
                                            /> :
                                            <ListingItemSkeletonHorizontal
                                                key={index}
                                                className='col-span-12'
                                            /> :
                                        <Fragment key={index}>
                                            <ListingItemSkeletonHorizontal
                                                key={index + 1}
                                                className='hidden max-sm:block col-span-12'
                                            />
                                            <ListingItemSkeletonVertical
                                                key={index + 2}
                                                className='hidden md:block col-span-12 sm:max-md:col-span-6 md:col-span-4'
                                            />
                                        </Fragment>

                                ) :


                            Array.from(Array(page == 1 ? initLimitDefault : defaultPageSize))
                                .map((item, index) =>
                                    windowSize.width ?
                                        search.viewType == VERTICAL_VIEW && (windowSize.width as number) > 768 ?
                                            <ListingItemSkeletonVertical
                                                key={index}
                                                className='col-span-12 sm:max-md:col-span-6 md:col-span-4 max_height_to_0'
                                            /> :
                                            <ListingItemSkeletonHorizontal
                                                key={index}
                                                className='col-span-12 max_height_to_0'
                                            /> :
                                        <Fragment key={index}>
                                            <ListingItemSkeletonHorizontal
                                                key={index + 1}
                                                className='hidden max-sm:block col-span-12 max_height_to_0'
                                            />
                                            <ListingItemSkeletonVertical
                                                key={index + 2}
                                                className='hidden md:block col-span-12 sm:max-md:col-span-6 md:col-span-4 max_height_to_0'
                                            />
                                        </Fragment>

                                )

                    }
                </div>
                {
                    !isMarketFetching && (pagination?.total as number != dataLength && pagination?.total > 0) ?
                        <ShowMoreBtn onLoadMore={onLoadMore} className='col-span-12 flex flex-row justify-center items-center pt-6' showArrow={true} />
                        : null
                }
            </div>
        </section >
    )
})
SearchResult.displayName = 'SearchResult';
export default SearchResult


{/* <div className='text-center'>
    <Pagination
        className='!mt-4 flex flex-row justify-center items-end'
        onChange={(page, pageSize) => {
            setPage(page)
            setIsLoading(true)
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
        }}
        defaultPageSize={pagination?.per_page}
        responsive={true}
        showSizeChanger={false}
        total={pagination?.total}
        current={page}
        hideOnSinglePage={true}
    />
</div> */}