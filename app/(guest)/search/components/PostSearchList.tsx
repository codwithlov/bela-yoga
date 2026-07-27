'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useGetDataQuery } from '@/services/api/common';
import { toQueryString } from '@/utils/apiUtils';
import { ShowMoreBtn } from '@/components/guest/atoms/ShowMoreBtn';
import ListingItemSkeletonHorizontal from '@/components/guest/ListingItemSkeletonHorizontal';
import HorizontalPostItem from '@/components/guest/molecules/HorizontalPostItem';

const PostSearchList = ({ keyword, setHasPosts }: { keyword: string; setHasPosts: any }) => {
    const [page, setPage] = useState(1);
    const [postList, setPostList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const postParams = { keyword, page, limit: 8 };

    const { data: postData, isFetching: fetchingPosts } =
        useGetDataQuery(`post/${toQueryString(postParams)}`, { skip: !keyword });

    useEffect(() => {
        if (postData?.data?.listData && !fetchingPosts) {
            setPostList((prevData) => [...prevData, ...postData.data.listData]);
            if (postData?.data?.listData?.length === 0) {
                setHasPosts(false);
            }
        }
    }, [fetchingPosts, postData, page, setHasPosts]);

    useEffect(() => {
        if (fetchingPosts) {
            setLoading(true);
        } else {
            setTimeout(() => {
                setLoading(false);
            }, 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchingPosts]);

    const postPagination = postData?.data?.pagination;
    const postTotalPages = Math.ceil(postPagination?.total / postPagination?.per_page);
    const hasMorePosts = page < postTotalPages;

    return (
        <>
            {
                postList.length > 0 &&
                <h2 className="flex flex-row justify-start items-start gap-2 text-bela-secondary-1 font-bold max-sm:text-lg sm:text-xl md:text-h3 mb-5">
                    Bài viết liên quan tới: <strong className='text-bela-primary-1'>{keyword}</strong>
                </h2>

            }
            <div className='flex flex-col items-center gap-4'>
                {postList.map((post, index) => (
                    <div
                        key={`post-${index}`}
                        className='bg-white rounded-bela-10 shadow-md w-full transition-opacity duration-700'
                    >
                        <HorizontalPostItem item={post} />
                    </div>
                ))}

                {loading &&
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={`post-skeleton-${index}`} className="w-full h-28 animate-pulse">
                            <ListingItemSkeletonHorizontal className="w-full h-28 bg-gray-200 rounded-md" />
                        </div>
                    ))}

                {!loading && hasMorePosts && (
                    <ShowMoreBtn onLoadMore={() => setPage((prev) => prev + 1)} className='mt-3' />
                )}
            </div>
        </>
    );
};

export default PostSearchList;
