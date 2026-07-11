'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from 'antd';
import { useGetDataQuery } from '@/services/api/common';
import { toQueryString } from '@/utils/apiUtils';
import '@/styles/components/antd-reset.scss'
import Hashtag from '../general/molecules/Hashtag';
import GuestListPagination from './atoms/GuestListPagination';
import FeedbackItem from './organisms/FeedbackItem';
import { IFeedback } from '@/interfaces/feedback';

const FeedbackList = ({
    initialList,
    limit = 12,
    tagId,
    showTagList
}: {
    initialList: any;
    tagId?: any;
    limit?: number;
    showTagList?: boolean;
}) => {
    const noDataResult = 'Không có dữ liệu'
    const [page, setPage] = useState<any>(null);
    const [selectedTag, setSelectedTag] = useState<any>(tagId);
    let params = {
        by_tag: selectedTag,
        page: page,
        limit: limit,
    }
    const { data, isFetching } = useGetDataQuery(
        `feedback/get-feedback-list${toQueryString(params)}`,
        {
            skip: !page,
            refetchOnMountOrArgChange: true,
        }
    );
    const pagination = data?.data?.pagination || initialList?.pagination;
    const feedbackList: IFeedback[] = !page ? initialList?.feedbackList : data?.data?.feedbackList;
    const firstItemRef = useRef<any>(null);
    const [postHeight, setPostHeight] = useState<number | null>(null);

    useEffect(() => {
        if (firstItemRef.current) {
            setPostHeight(firstItemRef.current.offsetHeight);
        }
    }, [page]);

    useEffect(() => {
        if (!isFetching) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
        }
    }, [page, isFetching,]);

    const handleSelectHastag = (v: number) => {
        setPage(1);
        setSelectedTag(v);
    }

    return (
        <section id='feedback_list' className='pb-16 mb-1'>
            {
                initialList?.tagList?.length && showTagList &&
                <Hashtag
                    hashtags={initialList?.tagList}
                    initialTagId={Number(tagId)}
                    selectHastag={handleSelectHastag}
                />
            }
            <div className="grid grid-cols-12 gap-x-5 gap-6 mt-6">
                {isFetching ? (
                    [...Array(initialList?.pagination?.per_page || 12)].map((_, index) => (
                        <div key={index} className='col-span-4 max-sm:col-span-6'>
                            <div className='w-full rounded-sgt-10 overflow-hidden' style={{ height: postHeight || 'auto' }}>
                                <Skeleton.Node active className="!w-full !h-full" />
                            </div>
                        </div>
                    ))
                ) : (
                    feedbackList?.length ?
                        feedbackList.map((item, index) => (
                            <div key={index} id={item.g_id} className='col-span-4 max-sm:col-span-12 aspect-square' ref={index === 0 ? firstItemRef : null}>
                                <FeedbackItem item={item} canShowDetail />
                            </div>
                        )) :
                        <div className='col-span-12 h-96 pt-10 flex flex-row justify-center'>
                            <p className="text-2xl leading-tight">{noDataResult}</p>
                        </div>
                )}
            </div>
            <GuestListPagination pagination={pagination} page={page} setPage={setPage} />
        </section>
    );
};

export default React.memo(FeedbackList);
