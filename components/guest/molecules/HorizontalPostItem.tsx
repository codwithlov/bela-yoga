'use client';
import { capitalizeFirstLetter } from '@/utils/formatString';
import Image from 'next/image';
import React from 'react';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';
import { IPost } from '@/interfaces/article';
import { getFirstImageUrl } from '@/utils/htmlUtils';
import { formatDate } from '@/utils/formatDate';

const HorizontalPostItem = ({ item }: { item: IPost }) => {
    return (
        <a
            href={'/' + item.slug}
            className="flex flex-row gap-4 items-center bg-white rounded-sgt-10 shadow-md p-2.5
                 hover:shadow-sgt-primary-1/20 transition-shadow duration-300"
        >
            <div className="w-1/3 rounded-sgt-10 overflow-hidden">
                <div className="relative w-full h-32">
                    <Image
                        src={getFirstImageUrl(item.description) || DEFAULT_THUMBNAIL}
                        alt={item.meta_title}
                        fill
                        priority
                        sizes="100vw"
                        className="w-full h-full object-cover rounded-sgt-10 transition-transform duration-500 hover:scale-110"
                        unoptimized
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2">
                <h3 className="text-sub-1 font-medium text-sgt-neutral-1 line-clamp-2">
                    {capitalizeFirstLetter(item.meta_title)}
                </h3>
                <p className="text-cap-1 text-sgt-neutral-3 line-clamp-2">
                    {item.meta_description}
                </p>
                <div className="flex flex-row gap-1 items-center text-sgt-neutral-3 text-cap-1">
                    <div
                        className="w-[1.125rem] h-[1.125rem] bg-sgt-primary-1"
                        style={{
                            mask: 'url("/assets/icons/calendar-origin.svg")',
                            maskSize: 'cover',
                        }}
                    />
                    <p className="mt-0.5">{formatDate(item.publish_date)}</p>
                </div>
            </div>
        </a>
    );
};

export default React.memo(HorizontalPostItem);
