'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { LISTING_ID_RECENTLY_VIEWED_LOCAL_KEY } from '@/constants/listing';
import { useGetMarketRecentlyViewQuery } from '@/services/api/markets';
import ListingItemHorizontal from './ListingItemHorizontal';
import TitleSpan from './TitleSpan';
type ViewedParam = {
    marketId?: number,
}
function ListingViewed(props: ViewedParam) {
    const [viewIds, setViewIds] = useState("");
    const { data: markets, isLoading, isFetching } = useGetMarketRecentlyViewQuery('?recently_ids=' + viewIds, { skip: !viewIds });
    const [display, setDisplay] = useState('hidden')
    useEffect(() => {
        if (!isFetching && markets?.data?.length != 0) {
            setDisplay('flex flex-row');
        }
    }, [isFetching, markets]);

    useEffect(() => {
        if (props.marketId! > 0) {
            let localMarketIds: any = localStorage.getItem(LISTING_ID_RECENTLY_VIEWED_LOCAL_KEY);
            localMarketIds = localMarketIds ? JSON.parse(localMarketIds) : [];
            const marketIdExist = localMarketIds.indexOf(props.marketId?.toString());
            if (marketIdExist > -1) {
                localMarketIds.splice(marketIdExist, 1);
                localMarketIds.push(props.marketId?.toString());
            } else {
                localMarketIds.push(props.marketId?.toString());
            }
            localMarketIds = JSON.stringify(localMarketIds);
            localStorage.setItem(LISTING_ID_RECENTLY_VIEWED_LOCAL_KEY, localMarketIds);
        }
    }, [props.marketId]);

    useEffect(() => {
        let tourRecentlyViewedIds: any = localStorage.getItem(LISTING_ID_RECENTLY_VIEWED_LOCAL_KEY);
        // Ensure we have an array after parsing
        tourRecentlyViewedIds = tourRecentlyViewedIds ? JSON.parse(tourRecentlyViewedIds) : [];

        // Now we can safely filter since we guaranteed it's an array
        tourRecentlyViewedIds = tourRecentlyViewedIds.filter((item: any) => item != null);

        if (tourRecentlyViewedIds.length > 6) {
            tourRecentlyViewedIds = tourRecentlyViewedIds.slice(tourRecentlyViewedIds.length - 6, tourRecentlyViewedIds.length);
        }

        tourRecentlyViewedIds = tourRecentlyViewedIds.length ? tourRecentlyViewedIds.join(',') : "";

        if (tourRecentlyViewedIds) {
            setViewIds(tourRecentlyViewedIds);
        }
    }, []);

    return (
        <>
            {
                isLoading || isFetching || !markets
                    ?
                    <></>
                    :
                    <section className={`tour_viewed_item w-full ${display}`}>
                        <div className='w-full pb-4'>
                            {
                                markets?.data?.length > 0 &&
                                <TitleSpan title='Mục đã xem gần đây' />
                            }
                            <div className='grid grid-cols-12 gap-5 pt-5 max-sm:pt-6 pb-5 px-4 xl:px-0'>
                                {
                                    markets?.data?.map((item: any, index) =>
                                        <div key={index} className='col-span-12 md:col-span-6 lg:col-span-4 rounded-lg bg-white shadow-sgt-black-1'>
                                            <ListingItemHorizontal
                                                item={item}
                                                index={index}
                                            />
                                        </div >
                                    )
                                }
                            </div>
                        </div>
                    </section>
            }
        </>
    )
}

export default ListingViewed