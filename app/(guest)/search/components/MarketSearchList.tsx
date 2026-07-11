'use client';
import React, { useEffect, useState } from 'react';
import { useGetDataQuery } from '@/services/api/common';
import { toQueryString } from '@/utils/apiUtils';
import ListingItemHorizontal from '@/components/guest/ListingItemHorizontal';
import { ShowMoreBtn } from '@/components/guest/atoms/ShowMoreBtn';
import ListingItemSkeletonHorizontal from '@/components/guest/ListingItemSkeletonHorizontal';

const MarketSearchList = ({ keyword, setHasMarktes }: { keyword: string; setHasMarktes: any }) => {
    const [page, setPage] = useState(1);
    const [dataList, setDataList] = useState<any[]>([]);
    const marketParams = { keyword, page };

    const { data: marketData, isFetching: fetchingMarkets } =
        useGetDataQuery(`market/guest-search/${toQueryString(marketParams)}`, { skip: !keyword });

    useEffect(() => {
        if (marketData?.data?.data && !fetchingMarkets) {
            setDataList((prevData) => [...prevData, ...marketData.data.data]);
            if (marketData?.data?.data?.length === 0) {
                setHasMarktes(false);
            }
        }
    }, [fetchingMarkets, marketData, page, setHasMarktes]);

    const pagination = marketData?.data?.pagination;
    const totalPages = Math.ceil(pagination?.total / pagination?.per_page);
    const hasMore = page < totalPages;

    return (
        <section className='pb-10'>
            <h2 className="flex flex-row justify-start items-start gap-2 text-sgt-secondary-1 font-bold max-sm:text-lg sm:text-xl md:text-h3 mb-5">
                Tour du lịch: <strong className='text-sgt-primary-1'>{keyword}</strong>
            </h2>
            <div className='flex flex-col items-center gap-4'>

                {dataList.map((tour, index) => (
                    <div key={index} className='bg-white rounded-sgt-10 shadow-md w-full hover:shadow-sgt-primary-1/20 transition-shadow duration-300'>
                        <ListingItemHorizontal item={tour} index={index} />
                    </div>
                ))}

                {fetchingMarkets &&
                    Array.from({ length: 5 }).map((_, index) => (
                        <ListingItemSkeletonHorizontal
                            key={index + 1}
                            className='w-full h-36'
                        />
                    ))}

                {!fetchingMarkets && hasMore && (
                    <ShowMoreBtn onLoadMore={() => setPage((prev) => prev + 1)} className='mt-3' />
                )}
            </div>
        </section>

    );
};

export default MarketSearchList;
