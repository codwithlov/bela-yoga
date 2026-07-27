import React from 'react'
import Breadcrumb from '@/components/guest/Breadcrumb'
import Avatar from '@/components/general/molecules/Avartar'
import Image from 'next/image'
import { SlugPermalink } from '@/interfaces/slugPermalink'
import fetchApi from '@/services/api/fetchApi'
import SchemaScript from '@/components/general/atoms/SchemaScript'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/utils/schema'
import { IPost } from '@/interfaces/article'
import { formatDate } from '@/utils/formatDate'
import { addHeadingIdsForContent, getFirstImageUrl } from '@/utils/htmlUtils'
import { DEFAULT_THUMBNAIL } from '@/constants/ui'
import { isEmpty } from '@/utils/helper'
import SupportForm from './postComponents/SupportForm'
import AdminNavBarReduxUpdater from '@/components/guest/AdminNavBarReduxUpdater'
import ListingCarousel from '@/components/guest/ListingCarousel'
import Index from '@/components/general/organisms/Index'

import AuthorInfo from '../components/AuthorInfo'
import { IAuthor } from '@/interfaces/user'
import PostTags from '@/components/general/molecules/PostTags'
interface Props {
    slugPermalink: SlugPermalink;
    admin: boolean;
}

const PostPage = async ({ slugPermalink, admin }: Props) => {
    console.log(slugPermalink?.entity_id);
    const postData = await fetchApi({
        urlPath: `post/${slugPermalink?.entity_id}${admin ? '?admin=true' : ''}`,
        isNoCache: !!admin,
    });

    const post = postData?.post as IPost;
    const author = post?.author as IAuthor ?? post?.defaultAuthor as IAuthor;
    if (!post) {
        return null;
    }

    // const type = postTypes.find(i => i.value === post.type);
    const breadcrumb = [
        { value: post?.post_type?.slug || '', label: post?.post_type?.title || '' },
        { value: slugPermalink?.slug, label: slugPermalink?.meta_title },
    ];
    const editedContent = addHeadingIdsForContent(post.description || '');
    return (
        <div className='bg-bela-bg-primary w-full px-4'>
            <SchemaScript id="article-schema" schema={generateArticleSchema(post, slugPermalink)} />
            <SchemaScript id="breadcrumb-schema" schema={generateBreadcrumbSchema(breadcrumb)} />
            <section id='diary_page' className='text-bela-neutral-1 width-primary m-auto lg:pt-10 pb-16'>
                <AdminNavBarReduxUpdater slugPermalink={slugPermalink} />
                <Breadcrumb items={breadcrumb} />
                <div className='grid grid-cols-12 gap-x-5 pt-10 mb-10'>
                    <div className='col-span-12 lg:col-span-8 overflow-hidden'>
                        <h1 className='text-h3 text-bela-secondary-1'>{slugPermalink?.meta_title}</h1>
                        <p className='text-body-2 mt-4'>{`Posted on ${formatDate(post.publish_date)} by `}
                            <a href={author?.author_slug ? `author/${author.author_slug}` : '/#'}>
                                {author?.display_name || 'Thảo Yoko'}
                            </a>
                        </p>
                        <Index content={editedContent} />
                        <div
                            className="ck-content mt-4 text-justify"
                            dangerouslySetInnerHTML={{
                                __html: editedContent
                            }}
                        />
                        {author &&
                            <AuthorInfo props={author} />
                        }
                    </div>
                    <div className='col-span-12 lg:col-span-4'>
                        <SupportForm source={slugPermalink?.meta_title} />
                        {!isEmpty(postData?.relatedPosts) &&
                            <h2 className='text-h3 text-bela-secondary-1 mb-6'>
                                Bài viết liên quan
                            </h2>
                        }
                        {(postData?.relatedPosts || []).map((item: IPost, index: number) => (
                            <a key={index} href={item.slug} className='flex flex-1 gap-5 mb-5 cursor-pointer'>
                                <div className='flex-1 w-full h-28'>
                                    <Image
                                        src={getFirstImageUrl(item.description) || DEFAULT_THUMBNAIL}
                                        alt={item.meta_title}
                                        width={180}
                                        height={110}
                                        className="w-full h-full object-cover rounded-md"
                                        unoptimized
                                    />
                                </div>
                                <div className='flex-1'>
                                    {/* <p className='text-body-2 text-bela-neutral-3 mb-0.5'>Đoàn Nhật Bản 5N5Đ</p> */}
                                    <h3 className='text-sub-1 mb-1.5'>
                                        {item?.meta_title}
                                    </h3>
                                    <div className='flex items-center gap-1'>
                                        <div className='bg-bela-neutral-4'
                                            style={{
                                                mask: 'url("/assets/icons/clock.svg")',
                                                maskSize: 'cover',
                                                width: '1rem',
                                                height: '1rem',
                                            }}
                                        />
                                        <p className='text-cap-1 text-bela-neutral-4'>{formatDate(item.publish_date)}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                <PostTags tagList={postData?.tags} showTitle className='mb-10' />
                <ListingCarousel
                    key={slugPermalink?.slug}
                    showAllBtn={false}
                    tourList={postData?.relatedMarkets?.data}
                    topic={{ name: 'Mục liên quan', slug: '' }}
                />
            </section >
        </div>
    )
}

export default PostPage
