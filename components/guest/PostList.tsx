'use client';
import '@/styles/components/post-list.scss';
import { capitalizeFirstLetter } from '@/utils/formatString';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';
import { Skeleton } from 'antd';
import { IPost } from '@/interfaces/article';
import { getFirstImageUrl } from '@/utils/htmlUtils';
import { formatDate } from '@/utils/formatDate';
import { useGetDataQuery } from '@/services/api/common';
import { toQueryString } from '@/utils/apiUtils';
import Hashtag from '../general/molecules/Hashtag';
import { ITagBase } from '@/interfaces/tag';
import { DIARY, GROUP_TOUR } from '@/constants/Post';
import GuestListPagination from './atoms/GuestListPagination';

const PostList = ({
    initialPostList,
    type,
    limit = 12,
    isMedia,
    tagId,
    authorId,
}: {
    initialPostList: any;
    type?: number;
    tagId?: number;
    authorId?: number;
    limit?: number;
    isMedia?: boolean;
}) => {
    const noDataResult = 'Không có dữ liệu'
    const [page, setPage] = useState<any>(null);
    const [selectHastag, setSelectHastag] = useState<number>(tagId ?? 0);
    let params = {
        by_type: type,
        by_tag: selectHastag,
        tag_is_filter: selectHastag > 0 ? true : false,
        by_author: authorId,
        page: page,
        limit: limit,
    }
    const { data, isFetching } = useGetDataQuery(
        `post${toQueryString(params)}`,
        {
            skip: !page,
            refetchOnMountOrArgChange: true,
        }
    );
    const pagination = data?.data?.pagination || initialPostList?.pagination;
    const posts: any[] = !page ? initialPostList?.listData : data?.data?.listData;
    const tags: ITagBase[] = useMemo(() => (initialPostList?.tagList ? initialPostList?.tagList : []), [initialPostList?.tagList]);
    const firstPostRef = useRef<HTMLAnchorElement | null>(null);
    const [postHeight, setPostHeight] = useState<number | null>(null);


    useEffect(() => {
        if (firstPostRef.current) {
            setPostHeight(firstPostRef.current.offsetHeight);
        }
    }, [page]);

    useEffect(() => {
        if (!isFetching) {
            // const lastPage = Math.ceil(pagination?.total / pagination?.per_page);
            // if (page === lastPage) {
            //     const totalLastPage = pagination?.total % pagination?.per_page;
            //     const heightDiff = Math.floor((12 - totalLastPage) / 3) * (postHeight || 0);
            //     window.scrollBy({ top: -heightDiff, behavior: "smooth" });
            // }
            if (type !== GROUP_TOUR) {
                window.scrollTo({
                    top: type == DIARY && page ? 100 : 0,
                    left: 0,
                    behavior: "smooth"
                });
            }
        }
    }, [page, isFetching, type]);

    const handleSelectHastag = (v: number) => {
        params.by_tag = v;
        setPage(1);
        setSelectHastag(v);
    }

    /** Components */
    const PostDateInfo = ({ publishDate }: { publishDate: string }) => (
        <div className='pi_date flex flex-row gap-1 justify-start items-center max-sm:gap-1'>
            <div
                className='pi_date_icon'
                style={{
                    mask: 'url("/assets/icons/calendar-origin.svg")',
                    maskSize: 'cover',
                }}
            />
            <p className='pi_date_text'>{formatDate(publishDate)}</p>
        </div>
    );

    return (
        <>
            <section id='post_list' className='pb-16 mb-1'>
                {
                    tags?.length > 0 ?
                        < Hashtag
                            hashtags={tags}
                            selectHastag={(v) => handleSelectHastag(v)}
                            type={type as number}
                        /> : null
                }
                <div className="grid grid-cols-12 gap-x-5 gap-6 mt-6">
                    {isFetching ? (
                        [...Array(initialPostList?.pagination?.per_page || 12)].map((_, index) => (
                            <div key={index} className='col-span-4 max-sm:col-span-6'>
                                <div className='w-full rounded-bela-10 overflow-hidden' style={{ height: postHeight || 'auto' }}>
                                    <Skeleton.Node active className="!w-full !h-full" />
                                </div>
                            </div>
                        ))
                    ) : (
                        posts?.length > 0 ?
                            posts.map((item: IPost, index: number) => (
                                <a key={index} href={'/' + item.slug} className='post_item' ref={index === 0 ? firstPostRef : null}>
                                    <div className={`w-full ${isMedia ? 'aspect-3/2' : 'aspect-16/9'} rounded-bela-10 overflow-hidden`}>
                                        <div className='relative w-full h-full'>
                                            <Image
                                                src={getFirstImageUrl(item.description) || DEFAULT_THUMBNAIL}
                                                alt={item.meta_title}
                                                width={0}
                                                height={0}
                                                priority={true}
                                                sizes='100vw'
                                                className='w-full h-full object-cover'
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className='flex-1 flex flex-col justify-between gap-2.5 pt-3 pb-4 my-0.5 px-4 mx-0.5'>
                                        {isMedia && <PostDateInfo publishDate={item.publish_date} />}
                                        <div className={`flex flex-col gap-0.5 ${isMedia ? 'mb-4' : ''}`}>
                                            <h3 className='pi_title'>{capitalizeFirstLetter(item.meta_title)}</h3>
                                        </div>
                                        {!isMedia &&
                                            <div className='flex flex-col gap-4'>
                                                <p className='pi_content'>{item.meta_description}</p>
                                                <PostDateInfo publishDate={item.publish_date} />
                                            </div>
                                        }
                                    </div>
                                </a>
                            )) :
                            <div className=' col-span-12 h-96 pt-10 flex flex-row justify-center'>
                                <p className="text-2xl leading-tight">{noDataResult}</p>
                            </div>
                    )}
                </div>
                <GuestListPagination pagination={pagination} page={page} setPage={setPage} />
            </section>
        </>
    );
};

export default React.memo(PostList);
