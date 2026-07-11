'use client';
import React from 'react';
import '@/styles/components/loading.scss';

interface Props {
    onLoadMore?: any;
    className?: string;
    showArrow?: boolean;
    href?: string;
}

export const ShowMoreBtn: React.FC<Props> = (props) => {
    const { onLoadMore, className, showArrow, href } = props;
    const button = <button className='flex flex-row justify-center items-center gap-0.5 py-1.5 px-4 rounded-md border border-sgt-primary-1 h-9'
        onClick={onLoadMore ? onLoadMore : () => { }}>
        <p className='text-button text-sgt-neutral-1 leading-3'>Xem thêm</p>
        {
            showArrow &&
            <div className='bg-sgt-neutral-1'
                style={{
                    mask: 'url("/assets/icons/long-arrow-right.svg")',
                    maskSize: 'cover',
                    width: "1.5rem",
                    height: "1.5rem",
                }}
            />
        }
    </button >
    return (
        <div className={className || ''} >
            {
                href ? <a href={href}>{button}</a> : button
            }
        </div >
    );
};
