'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Modal } from 'antd';
import Rating from '../atoms/Rating';
import Avatar from '@/components/general/molecules/Avartar';
import { formatDate } from '@/utils/formatDate';
import { DEFAULT_THUMBNAIL, ratings } from '@/constants/ui';
import { useMediaQuery } from 'react-responsive';
import { IFeedback } from '@/interfaces/feedback';

const FeedbackItem = ({ item, canShowDetail }: { item: IFeedback, canShowDetail?: boolean }) => {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

    const topSection = () => (
        <>
            <div className="flex gap-2 text-md">
                <Avatar src={item.avatar_image} name={item.full_name} />
                <div className='flex flex-col justify-center'>
                    <p className="text-xs lg:text-base font-semibold leading-none max-md:mb-1">
                        {item.full_name}
                    </p>
                    <p className="text-2xs lg:text-xs font-normal leading-none mb-1">
                        {item.feedback_date}
                    </p>
                </div>
            </div>
            <div className="flex items-center mt-1.5 mb-2">
                <Rating rating={item.rating} small />
                <p className="text-2xs ml-1 mr-[6px] font-light text-sgt-neutral-3">|</p>
                <p className="text-2xs lg:text-xs mt-[1px] font-normal text-sgt-neutral-3">
                    {ratings.find(rating => rating.value === Number(item.rating))?.label}
                </p>
            </div>
        </>
    )
    const popupImageParams = (item.feedback_type === 'GOOGLE' && item?.image_options?.[1]) ? ('=' + item?.image_options?.[1]) : '';
    const renderPopupContent = () => (
        <div className="w-full">
            {topSection()}
            <div className='max-h-[60vh] overflow-y-auto custom-scrollbar pr-1'>
                <p className="whitespace-pre-line text-sm mb-2">
                    {item.content}
                </p>

                <div className={`grid ${(item.images?.length === 1 || isMobile) ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                    {item.images?.map((src, i) => (
                        <div key={i} className="relative w-full aspect-3/2 overflow-hidden rounded-md">
                            <Image
                                src={src + popupImageParams}
                                alt={`feedback-${i}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderImages = (images: string[] = []) => {
        if (!images?.length) images = [DEFAULT_THUMBNAIL];
        const count = images.length;
        const imageParams = (item.feedback_type === 'GOOGLE' && item.image_options?.[0] && count > 3) ? ('=' + item?.image_options?.[0]) : '';
        const renderImage = (src: string, i: number, extraClass = '') => (
            <div key={i} className={`relative w-full h-full overflow-hidden ${extraClass}`}>
                <Image
                    src={src + imageParams}
                    alt={`feedback-${i}`}
                    fill
                    className="object-cover transition duration-500 ease-in-out hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
        );

        return (
            <div className="flex flex-col flex-1 gap-0.5 w-full h-full rounded-md overflow-hidden">
                {count === 1 && renderImage(images[0], 0)}
                {count === 2 && (
                    <div className="grid grid-cols-2 gap-0.5 flex-1 h-full">
                        {images.slice(0, 2).map((img, i) => renderImage(img, i))}
                    </div>
                )}
                {count === 3 && (
                    <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
                        {renderImage(images[0], 0, 'col-span-1 row-span-2')}
                        {images.slice(1, 3).map((img, i) => renderImage(img, i + 1))}
                    </div>
                )}
                {count >= 4 && (
                    <div className="grid grid-cols-2 gap-0.5 h-full">
                        {images.slice(0, 4).map((img, i) => {
                            const isLastVisible = i === 3;
                            const remaining = count - 4;

                            return (
                                <div key={i} className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={img}
                                        alt={`feedback-${i}`}
                                        fill
                                        className="object-cover transition duration-500 ease-in-out hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {isLastVisible && remaining > 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                            <span className="text-white text-xl">+{remaining}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        );
    };

    const isDragging = React.useRef(false);
    const handleMouseDown = () => {
        isDragging.current = false;
    };

    const handleMouseMove = () => {
        isDragging.current = true;
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging.current) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            setOpen(!!canShowDetail);
        }
    };

    return (
        <div className='feedback_item_wrap w-full h-full bg-gradient-to-b from-sgt-primary-2 to-white m-0.5 p-0.5 rounded-sgt-10 overflow-hidden'>
            <div
                className="w-full h-full flex flex-col bg-white cursor-pointer rounded-sgt-10"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            >
                <div className="p-4 pb-2">
                    {topSection()}
                    <p className="text-2xs lg:text-sm leading-4 font-normal text-sgt-neutral-1 line-clamp-[3] min-h-[18px] max-w-[400px]">
                        {item.content}
                    </p>
                </div>

                <div className="flex-1 w-full">
                    {renderImages(item.images)}
                </div>
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
                width={isMobile ? '90%' : '60%'}
            >
                {renderPopupContent()}
            </Modal>
        </div>
    );
};

export default FeedbackItem;
