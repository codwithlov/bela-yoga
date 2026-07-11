import React from 'react'
import Title from '@/components/guest/Title'
import fetchApi from '@/services/api/fetchApi'
import PostList from '@/components/guest/PostList'

interface Props {
    typeID: number;
}

const PostTypePage = async ({ typeID }: Props) => {
    const initialPostList = await fetchApi({
        urlPath: `post?by_type=${typeID}&is_tag=true`,
    });

    return (
        <>
            <section id='event_page' className='bg-sgt-neutral-6'>
                <div className='pb-6 max-sm:pb-4 pt-16 transition-all duration-300 max-sm:pt-10'>
                    <Title title={initialPostList?.title}></Title>
                </div>
                <div className='width-primary h-full flex flex-col m-auto px-4 xl:px-0'>
                    <PostList initialPostList={initialPostList} type={typeID} />
                </div>
            </section>

        </>
    )
}

export default PostTypePage