import { Tag } from '@/interfaces/tag';
import React from 'react';
import { TagOutlined } from '@ant-design/icons';

const PostTags = ({ tagList, showTitle, className }: { tagList: Tag[], showTitle?: boolean, className?: string }) => {
    if (!tagList || tagList.length === 0) return null;

    return (
        <section id="post_tag" className={`flex items-center ${className}`}>
            {showTitle &&
                <div className="flex items-center">
                    <TagOutlined className="text-bela-secondary-1 text-base mr-2" />
                    <span className="text-lg font-semibold text-bela-secondary-1">Tags:</span>
                </div>
            }
            <div className="flex flex-wrap gap-2 ml-3">
                {tagList.map((item: Tag, index) => (
                    <a key={index} href={'/' + item.tagslug?.slug}
                        className='px-3 py-1 rounded-2xl border border-bela-secondary-1 hover:bg-bela-primary-3 text-bela-neutral-2 hover:text-bela-neutral-2'>
                        {item.name}
                    </a>
                ))}
            </div>
        </section>
    );
};

export default PostTags;
