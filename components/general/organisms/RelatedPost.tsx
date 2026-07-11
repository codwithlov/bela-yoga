import React from 'react';
import { isEmpty } from '@/utils/helper';
import { IPost } from '@/interfaces/article';
import RelatedPostCard from '../molecules/RelatedPostCard';

type RelatedPostProps = {
  relatedPosts: IPost[];
};

const RelatedPost: React.FC<RelatedPostProps> = ({ relatedPosts }) => {
  if (isEmpty(relatedPosts)) {
    return null; // Trả về null nếu không có bài viết liên quan
  }

  return (
    <div>
      <h3 className="text-h3 text-sgt-secondary-1 mb-6">
        Bài viết liên quan
      </h3>
      <div>
        {relatedPosts.map((item: IPost, index: number) => <RelatedPostCard key={index} item={item}/>)}
      </div>
    </div>
  );
};

export default RelatedPost;
