'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDefaultPage, setDuringFilter, setSortActive, setUrlWithParam } from '@/store/searchSlice';
import { formatPrice } from '@/utils/formatPrice';
import { Skeleton } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { SORT_BY_DAY_NUMBER, SORT_BY_FLIGHT_DATE, SORT_BY_PRICE, VI_DATE_FORMAT } from '@/constants/ui';
import { useGetMarketOtherInfoBySearchQuery } from '@/services/api/markets';

const SkeletonFetch = () => {
    return (
        <div className='text-center'>
            <Skeleton
                title={false}
                paragraph={{
                    rows: 1,
                    width: [100]
                }}
                active
            />
        </div>
    );
}

type SearchArrangeNavBarParam = {
    isMobile?: boolean,
    setCloseArrange?: any,
};

const SearchArrange = (props: SearchArrangeNavBarParam) => {
    const formatDateVI = VI_DATE_FORMAT;
    const dateTime = new Date();
    const router = useRouter();
    const search = useAppSelector((state) => state.search);
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    // Set default value of loading each fecht data
    const [lowestDayLoading, setLowestDayIsLoading] = useState(true);
    const [lowestFlightDateLoading, setLowestFlightDateIsLoading] = useState(true);
    const [lowestPriceLoading, setLowestPriceIsLoading] = useState(true);
    // Set default value of class active each sort button
    const [activeSortDay, setActiveSortDay] = useState('bg-sgt-secondary-default bg-opacity-5');
    const [activeSortFlightDate, setActiveSortFlightDate] = useState('');
    const [activeSortPrice, setActiveSortPrice] = useState('');
    const [param, setParam] = useState('');
    const [flightDateParam, setFlightDateParam] = useState('');
    const [priceParam, setPriceParam] = useState('');

    const sortActiveClass = 'bg-sgt-secondary-default bg-opacity-5';
    const sortActiveString = search.sortActive ?? SORT_BY_DAY_NUMBER as string;

    useEffect(() => {
        let currentUrl = search.pathWithParam ?? searchParams?.toString();
        const parseParamUrl = new URLSearchParams(currentUrl);
        parseParamUrl.delete('sort_by');
        let param, flightDateParam, priceParam;

        // param = '?' + parseParamUrl.toString() + "&sort_by=day_number:asc,night_number:asc";
        param = '?' + parseParamUrl.toString();
        // flightDateParam = '?' + parseParamUrl.toString() + "&sort_by=flight_date:asc";
        // priceParam = '?' + parseParamUrl.toString() + "&sort_by=price_adl_off:asc,price_adl:asc";

        setParam(param);
        // setFlightDateParam(flightDateParam);
        // setPriceParam(priceParam);
    }, [search.pathWithParam, searchParams]);

    // Fetch listing with lowest duration day
    // const {
    //     data: lowestDayInfo,
    //     isLoading: lowestDayIsLoading,
    //     isFetching: lowestTourFetching
    // } = useGetLowestDayTravelListingQuery(param, {
    //     skip: !param,
    //     refetchOnMountOrArgChange: true,
    // });
    // Fetch listing with lowest flight date
    // const {
    //     data: lowestDateInfo,
    //     isLoading: lowestDateIsLoading,
    //     isFetching: lowestDateFetching
    // } = useGetLowestFlightDateTravelListingQuery(flightDateParam, {
    //     skip: !flightDateParam,
    //     refetchOnMountOrArgChange: true,
    // });
    // Fetch listing with lowest price 
    // const {
    //     data: lowestPriceInfo,
    //     isLoading: lowestPriceIsLoading,
    //     isFetching: lowestPriceFetching
    // } = useGetLowestPriceTravelListingQuery(priceParam, {
    //     skip: !priceParam,
    //     refetchOnMountOrArgChange: true,
    // });


    const {
        data: marketOtherInfo,
        isLoading: marketOtherInfoLoading,
        isFetching: marketOtherInfoFetching
    } = useGetMarketOtherInfoBySearchQuery(param, {
        skip: !param,
        refetchOnMountOrArgChange: true,
    })

    useEffect(() => {
        if (!marketOtherInfoLoading) {
            setActiveSortDay('bg-sgt-secondary-default bg-opacity-5');
            setLowestDayIsLoading(false)
        }
        // if (!lowestDateIsLoading) {
        //     setActiveSortFlightDate('');
        //     setLowestFlightDateIsLoading(false)
        // }

        // if (!lowestPriceIsLoading) {
        //     setActiveSortPrice('');
        //     setLowestPriceIsLoading(false)
        // }
    },
        [
            marketOtherInfoLoading,
            // lowestDateInfo,
            // lowestPriceInfo
        ]
    );

    // Function change the path for event click sort listing data
    const changePathSortBy = (param: string) => {
        const currentUrl = search.pathWithParam ?? searchParams?.toString();
        const params = new URLSearchParams(currentUrl)
        params.delete('sort_by');
        const pathUrl = `${params.toString()}&sort_by=${param}`;
        // router.push(
        //     `search?${pathUrl}`,
        //     { shallow: true } as any
        // );
        dispatch(setDuringFilter(false));
        dispatch(setUrlWithParam(`${pathUrl}`));
        dispatch(setDefaultPage(1));
    }

    return (
        <section id='search_arrange'>
            <div className='search_content_tour_arrange text-sm font-semibold flex flex-col justify-around bg-white text-sgt-secondary-light py-2.5 lg:rounded-lg lg:shadow lg:flex-row'>
                <div className={`py-3 px-4 border-b border-gray-100 lg:p-0 lg:border-none search_content_tour_arrange_item ${sortActiveString == SORT_BY_DAY_NUMBER ? sortActiveClass : ''}  `}
                    onClick={() => {
                        changePathSortBy('');
                        dispatch(setSortActive(SORT_BY_DAY_NUMBER))
                        if (props.isMobile) {
                            props.setCloseArrange();
                        }
                    }}
                >
                    <div>Thời lượng ngắn nhất </div>
                    {
                        marketOtherInfoLoading || marketOtherInfoFetching
                            ?
                            SkeletonFetch()
                            :
                            <div className='text-xs text-sgt-secondary-dark'>
                                {marketOtherInfo?.day_number} Ngày {marketOtherInfo?.night_number} Đêm
                            </div>
                    }
                </div>
                <div className={`py-3 px-4 border-b border-gray-100 lg:p-0 lg:border-none search_content_tour_arrange_item ' ${sortActiveString == SORT_BY_FLIGHT_DATE ? sortActiveClass : ''}`}
                    onClick={() => {
                        changePathSortBy('flight_date:asc');
                        dispatch(setSortActive(SORT_BY_FLIGHT_DATE))
                        if (props.isMobile) {
                            props.setCloseArrange();
                        }
                    }}
                >
                    <div>Khởi hành sớm nhất</div>
                    {
                        marketOtherInfoLoading || marketOtherInfoFetching
                            ?
                            SkeletonFetch()
                            :
                            <div className='text-xs text-sgt-secondary-dark' >
                                {
                                    marketOtherInfo?.flight_date ? dayjs(marketOtherInfo?.flight_date).format(formatDateVI) : '00/00/0000'
                                }
                            </div>
                    }
                </div>
                <div className={`py-3 px-4 border-b border-gray-100 lg:p-0 lg:border-none search_content_tour_arrange_item ' ${sortActiveString == SORT_BY_PRICE ? sortActiveClass : ''}`}
                    onClick={() => {
                        changePathSortBy('price_adl_off:asc,price_adl:asc');
                        dispatch(setSortActive(SORT_BY_PRICE))
                        if (props.isMobile) {
                            props.setCloseArrange();
                        }
                    }}
                >
                    <div>Giá thấp nhất</div>
                    {
                        marketOtherInfoLoading || marketOtherInfoFetching
                            ?
                            SkeletonFetch()
                            :
                            <div className='text-xs text-sgt-secondary-dark'>
                                {
                                    marketOtherInfo?.price_adl != marketOtherInfo?.price_adl_off
                                        ?
                                        formatPrice(marketOtherInfo?.price_adl_off)
                                        :
                                        marketOtherInfo?.price_adl ? formatPrice(marketOtherInfo?.price_adl) : 0
                                }
                            </div>
                    }
                </div>
            </div>
        </section>
    )
}

export default SearchArrange
