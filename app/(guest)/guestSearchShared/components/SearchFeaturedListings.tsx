
'use client'
import ListingCarousel from '@/components/guest/ListingCarousel'
import TitleOfTopic from '@/components/guest/TitleOfTopic'
import ListingItemSkeletonVertical from '@/components/guest/ListingItemSkeletonVertical'
import { ITopicSummary } from '@/interfaces/topic'
import { IListingSummary } from '@/interfaces/listing'
import { useGetFeaturedListingsQuery } from '@/services/api/listings'
import { useAppSelector } from '@/store/hooks'
import React, { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ListingItemHorizontal from '@/components/guest/ListingItemHorizontal'
import { toQueryString } from '@/utils/apiUtils'
import useInitUrlParamOfSearch from '../hooks/useInitUrlParamOfSearch'
import { SORT_BY_TYPE_KEY } from '../constants/searchParams'
import ListingItemSkeletonHorizontal from '@/components/guest/ListingItemSkeletonHorizontal'


export const SearchFeaturedListingsSkeleton = ({ defaultPageSize }: { defaultPageSize: number }) => {
    return <Fragment>
        <div className='flex flex-row justify-start items-center pb-5'>
            <TitleOfTopic title='Ưu đãi nổi bật' />
        </div>
        <div className='grid grid-cols-12 gap-5'>
            {
                Array.from(Array(defaultPageSize)).map((sk, index) => (
                    <Fragment key={index}>
                        <ListingItemSkeletonHorizontal
                            key={index + 1}
                            className='col-span-12 hidden max-sm:block'
                        />
                        <ListingItemSkeletonVertical
                            key={index + 2}
                            className='hidden md:block col-span-12 sm:max-md:col-span-6 md:col-span-4 mt-5 mb-5'
                        />
                    </Fragment>
                ))
            }
        </div>
    </Fragment>
}
const SearchFeaturedListings = ({
    data,
    // params,
    // searchParams,
}: {
    data: any
    // params?: { slug: string }
    // searchParams?: { [key: string]: string | string[] | undefined }
}) => {

    let goodPriceTour: IListingSummary[] = useMemo(() => data, [data]);
    const topic: ITopicSummary = {
        name: 'Ưu đãi nổi bật',
        slug: 'featured-offers'
    }
    const sortByTypeKey = SORT_BY_TYPE_KEY;
    const goodPriceRef = useRef<HTMLElement>(null)
    const [goodPriceTourPagination, setGoodPriceTourPagination] = useState<IListingSummary[]>();
    const [currentpage, setCurrentpage] = useState<number>(1);
    const search = useAppSelector((state) => state.search);
    const initUrlParamOfSearch = useInitUrlParamOfSearch();
    if (initUrlParamOfSearch[sortByTypeKey]) {
        delete initUrlParamOfSearch[sortByTypeKey];
    }
    let currentUrl = toQueryString(initUrlParamOfSearch, false);
    const {
        data: goodPriceTourFetchList,
        isLoading: isLoading,
        isFetching: isFetching
    } = useGetFeaturedListingsQuery(currentUrl, {
        skip: !search.isDuringFilter,
        refetchOnMountOrArgChange: true,
    })

    if (search.isDuringFilter && (!isLoading || !isFetching)) {
        goodPriceTour = goodPriceTourFetchList?.data as IListingSummary[];
    }


    const defaultPageSize = 3;
    const skeletonCol = 4;
    const slidesToShow = 3
    const skeletonTourData: number[] = Array.from(Array(slidesToShow).keys());
    const startDate = '2024-09-11 10:00:00';
    const endDate = '2024-09-11 13:27:30';

    useLayoutEffect(() => {
        if (!isFetching) {
            setTimeout(() => {
                let goodPriceElem = goodPriceRef.current;
                if (goodPriceElem?.classList.contains('is_hidden')) {
                    goodPriceElem?.classList.add('good_price_hidden');
                }
            }, 300)
        }
    }, [isFetching]);

    useEffect(() => {
        setCurrentpage(1);
        if (goodPriceTour?.length > 0) {
            setGoodPriceTourPagination(goodPriceTour.slice(0, defaultPageSize));
        }
    }, [goodPriceTour])

    const onLoadMore = () => {
        let page = currentpage + 1;
        let startIndex = ((page * defaultPageSize) - (defaultPageSize));
        let endIndex = page * defaultPageSize;
        let list = goodPriceTour.slice(startIndex, endIndex);
        list = goodPriceTourPagination?.concat(list) as IListingSummary[];
        setGoodPriceTourPagination(list);
        setCurrentpage(page);
    }

    return (
        <section id='search_good_price_tour' className='max-sm:mb-0 max-sm:px-4'>
            {
                isFetching ?
                    <SearchFeaturedListingsSkeleton defaultPageSize={defaultPageSize} /> :
                    goodPriceTour?.length > 0 ?
                        <section key={topic.slug} className={`w-full pb-5`}>
                            <div className='good_price_tour'>
                                <div className='flex flex-row justify-start items-center gap-4 pb-5'>
                                    <TitleOfTopic className='!pl-0' title='Ưu đãi nổi bật' />
                                    {/* <FlashSaleTimer startDate={startDate} endDate={endDate} /> */}
                                </div>
                                <div className='hidden md:block'>
                                    <ListingCarousel
                                        isShowTitle={false}
                                        key={topic.slug}
                                        tourList={goodPriceTour}
                                        topic={topic}
                                        slidesToShow={slidesToShow}
                                        isShowTimerInCard={true}
                                    />
                                </div>
                                <div className='hidden max-sm:grid grid-cols-12 gap-4 pt-4 max-sm:pt-1'>
                                    {
                                        goodPriceTourPagination?.length as number > 0 ?
                                            goodPriceTourPagination?.map((item: any, index: number) => {
                                                return <ListingItemHorizontal
                                                    key={index}
                                                    item={item}
                                                    isAnimation={true}
                                                    isShowDiscount={true}
                                                    discountPosition='top-left'
                                                    cardBorder='border border-bela-third-2'
                                                >
                                                </ListingItemHorizontal>
                                            }) :
                                            Array.from(Array(defaultPageSize)).map((item: any, index: number) => {
                                                return <ListingItemSkeletonHorizontal key={index} className='col-span-12 ' />
                                            })

                                    }
                                </div>
                                {
                                    goodPriceTourPagination?.length == goodPriceTour?.length ?
                                        null :
                                        <div className='md:hidden col-span-12 flex flex-row justify-center items-center pt-6'>
                                            <button className='flex flex-row justify-center items-center gap-0.5 py-1.5 px-4 rounded-md border border-bela-primary-1'
                                                onClick={onLoadMore}>
                                                <p className='text-button text-bela-neutral-1'>Xem thêm</p>
                                                <p className='text-button text-bela-neutral-1'>({defaultPageSize})</p>
                                                <div className='bg-bela-neutral-1'
                                                    style={{
                                                        mask: 'url("/assets/icons/long-arrow-right.svg")',
                                                        maskSize: 'cover',
                                                        width: "1.5rem",
                                                        height: "1.5rem",
                                                    }}
                                                >
                                                </div>
                                            </button>
                                        </div>
                                }
                            </div>
                        </section> :
                        search.isDuringFilter ?
                            <section
                                ref={goodPriceRef}
                                key={topic.slug}
                                className={`w-full good_price ${goodPriceTour && goodPriceTour.length > 0 ? '' : 'is_hidden'}`}
                            >
                                <SearchFeaturedListingsSkeleton defaultPageSize={defaultPageSize} />
                            </section> : null
            }
        </section >
    )
}
export default SearchFeaturedListings