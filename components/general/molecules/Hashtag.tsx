'use client'
import { DIARY } from '@/constants/Post';
import { ITagBase } from '@/interfaces/tag';
import React, { use, useState } from 'react'
const Hashtag = ({
    selectHastag,
    hashtags,
    type,
    initialTagId,
}: {
    selectHastag: (v: number) => void,
    hashtags: ITagBase[],
    type?: number,
    initialTagId?: number,
}) => {
    const [currentHashtag, setCurrentHashtag] = useState<number>(initialTagId || 0);
    const handleSelectHastag = (value: number) => {
        if (currentHashtag == value) {
            setCurrentHashtag(0);
            selectHastag(0);
        } else {
            setCurrentHashtag(value);
            selectHastag(value);
        }
    }

    if (!hashtags || hashtags?.length === 0) return;
    return (
        <>
            <section id='post_list_hashtag' className='w-9/12 pb-6 mx-auto mb-0.5 max-sm:w-full max-sm:pb-4'>
                <div className='flex flex-row flex-wrap justify-center items-center gap-2.5'>
                    {
                        hashtags?.map((item: ITagBase, index: number) => {
                            return <button
                                key={index}
                                onClick={() => handleSelectHastag(item.id)}
                                className={
                                    [
                                        `px-4 py-1.5 rounded-sgt-10 text-body-2 transition-all duration-300 text-sgt-neutral-3      `,
                                        `hover:bg-sgt-primary-light hover:text-sgt-secondary-1`,
                                        `${type !== DIARY ? 'border border-sgt-neutral-4' : 'bg-sgt-neutral-7'}`,
                                        `    ${currentHashtag === item.id ? 'bg-sgt-primary-2 text-sgt-secondary-1' : ''}`,
                                    ]
                                        .map(e => e.trim())
                                        .join(' ')
                                }
                            >
                                #{item.name}
                            </button>
                        })
                    }
                </div>
            </section>
        </>
    )
}

export default Hashtag