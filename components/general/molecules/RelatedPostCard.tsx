import React from 'react';
import Image from 'next/image';
import { IPost } from '@/interfaces/article';
import { getFirstImageUrl } from '@/utils/htmlUtils';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';
import { formatDate } from '@/utils/formatDate';

type RelatedPostCardProps = {
  item: IPost;
};

const RelatedPostCard: React.FC<RelatedPostCardProps> = ({ item }) => {
  return (
    <a
      href={item.slug}
      className="flex flex-1 gap-5 mb-5 cursor-pointer"
    >
      {/* Hình ảnh bài viết */}
      <div className="flex-1 w-full h-28">
        <Image
          src={getFirstImageUrl(item.description) || DEFAULT_THUMBNAIL}
          alt={item.meta_title || 'Hình ảnh bài viết'}
          width={180}
          height={110}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Nội dung bài viết */}
      <div className="flex-1">
        <h3 className="text-sub-1 mb-1.5">
          {item.meta_title || 'Tiêu đề bài viết'}
        </h3>
        <div className="flex items-center gap-1">
          {/* Icon thời gian */}
          <div
            className="bg-bela-neutral-4"
            style={{
              mask: 'url("/assets/icons/clock.svg")',
              maskSize: 'cover',
              width: '1rem',
              height: '1rem',
            }}
          />
          <p className="text-cap-1 text-bela-neutral-4">
            {item.created_at ? formatDate(item.created_at) : 'Không rõ ngày'}
          </p>
        </div>
      </div>
    </a>
  );
};

export default RelatedPostCard;
