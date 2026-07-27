'use client';
import '@/styles/components/post-list.scss';
import Image from 'next/image';
import React from 'react';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';
import { IPost } from '@/interfaces/article';
import { getFirstImageUrl } from '@/utils/htmlUtils';
import { capitalizeFirstLetter } from '@/utils/formatString';
import { formatDate } from '@/utils/formatDate';

interface CardPostProps {
  post: IPost;
  index: number;
}

const CardPost: React.FC<CardPostProps> = ({ post, index }) => {
  const imageUrl = getFirstImageUrl(post.description) || DEFAULT_THUMBNAIL;

  return (
    <a key={index} href={`/${post.slug}`} className="post_item">
      <div className="w-full aspect-16/9 rounded-bela-10 overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={post.meta_title}
            width={0}
            height={0}
            priority={true}
            sizes="100vw"
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between gap-2.5 pt-3 pb-4 my-0.5 px-4 mx-0.5">
        <div className="flex flex-col gap-0.5">
          <h3 className="pi_title">{capitalizeFirstLetter(post.meta_title)}</h3>
        </div>
        <div className="flex flex-col gap-4">
          <p className="pi_content">{post.meta_description}</p>
          <div className="pi_date flex flex-row gap-1 justify-start items-center max-sm:gap-1">
            <div
              className="pi_date_icon"
              style={{
                mask: 'url("/assets/icons/calendar-origin.svg")',
                maskSize: 'cover',
              }}
            ></div>
            <p className="pi_date_text">{formatDate(post.created_at)}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default CardPost;
