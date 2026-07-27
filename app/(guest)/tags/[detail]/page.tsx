import React from 'react'
import fetchApi from '@/services/api/fetchApi';
import { Metadata } from 'next';
import { STATUS_404 } from '@/constants/status';
import { redirect } from 'next/navigation';
import { GUEST_404 } from '@/constants/route';
import { addSEO } from '@/utils/htmlUtils';
import PostList from '@/components/guest/PostList';
import Title from '@/components/guest/Title';
import FeedBackList from '@/components/guest/FeedBackList';

type TagDetailPageProps = {
    params: Promise<{ detail: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

const getDefaultData = async (slug: string, admin: any) => {
    const urlPath = `tag/show?slug=${slug}${!!admin ? '&admin=true' : ''}`;
    const responseJson = await fetchApi({
        urlPath: urlPath,
        isNoCache: !!admin,
    });
    return responseJson;
}

export async function generateMetadata(
    { params, searchParams }: TagDetailPageProps,
): Promise<Metadata> {
    const { detail } = await params;
    const resolvedSearchParams = await searchParams;
    const tagSlug = 'tags/' + detail;
    let metadata: Metadata = {};
    let defaultData = await getDefaultData(tagSlug, !!resolvedSearchParams?.admin);
    metadata = addSEO(metadata, defaultData?.slugPermalink, [], !!resolvedSearchParams?.admin, tagSlug);
    return metadata;
}

const Detail = async ({ params, searchParams }: TagDetailPageProps) => {
    const { detail } = await params;
    const resolvedSearchParams = await searchParams;
    const tagSlug = 'tags/' + detail;
    const admin = !!resolvedSearchParams?.admin;
    const responseJson = await getDefaultData(tagSlug, admin);
    if (responseJson == STATUS_404) {
        redirect(GUEST_404);
    }
    const tagId = responseJson?.tag?.id || '';
    let initialList = [];
    if (!responseJson?.isFeedback) {
        initialList = await fetchApi({
            urlPath: `post?by_tag=${tagId}${!!admin ? '&admin=true' : ''}`,
            isNoCache: !!admin,
        });
    } else {
        initialList = await fetchApi({
            urlPath: `feedback/get-feedback-list?by_tag=${tagId}`,
            isNoCache: !!admin,
        });
    }
    const title = !responseJson?.isFeedback ? 'Bài viết liên quan tới ' + responseJson?.tag?.name : responseJson?.tag?.name;
    return (
        <>
            <section id='tag_page' className='bg-bela-neutral-6'>
                <div className='pb-6 max-sm:pb-4 pt-16 transition-all duration-300 max-sm:pt-10'>
                    <Title title={title} />
                </div>
                <div className='width-primary h-full flex flex-col m-auto px-4 xl:px-0'>
                    {!responseJson?.isFeedback ?
                        <PostList initialPostList={initialList} tagId={tagId} /> :
                        <FeedBackList initialList={initialList} tagId={tagId} />
                    }
                </div>
            </section>
        </>
    )
}

export default Detail