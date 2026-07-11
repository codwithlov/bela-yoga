'use client';
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { formatPrice } from '@/utils/formatPrice';
import { VI_DATE_FORMAT } from '@/constants/ui';
import { fakeTourAbroadList } from '@/utils/fakeData';
import { capitalizeFirstLetter } from '@/utils/formatString';
import dynamic from 'next/dynamic';

/** Import Lazy CSS */
const ListingItemCss = dynamic(() => import('@/components/non-critical/ListingItemCss'), { ssr: false });
/** End */
type ViewedParam = {
    index?: number,
    item: any,
    isShowBtn?: boolean,
    className?: string,
}
const ListingItemVerticalOption2 = (props: ViewedParam) => {
    const [isClient, setIsClient] = useState(false);
    const dateFormat = VI_DATE_FORMAT;
    let item = props.item;
    let ishowBtn = props.isShowBtn ?? true;
    let detailLink = `/tour/${item.market_slug}`;
    // let thumbnail = item.images?.thumbnail_360 ?? `/assets/images/canh-dong-quat-gio-360x225.jpg`;
    let randomIndex = Math.floor(Math.random() * 7);
    // let thumbnail = item.images?.thumbnail_360 ?? `/assets/images/country/${fakeTourList[props.index ?? randomIndex]}`;
    let thumbnail = `/assets/images/abroad/${fakeTourAbroadList[props.index ?? randomIndex]}`;
    let tourPrice = item.min_price_adl != item.min_price_adl_off ? item.min_price_adl_off : item.min_price_adl;

    if (item.display_price > 0) {
        tourPrice = item.display_price;
    }
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            {isClient && <ListingItemCss />}
            <a href={detailLink} className={`${props.className ? props.className : `col-span-4`} tour_item_vertical transition-all ease-linear duration-200 cursor-pointer`}>
                <div className='grid grid-cols-12 rounded-[0.625rem] shadow-sgt-black-1 bg-white relative'>
                    <div className='aspect-16/9 md:aspect-3/2 col-span-12 rounded-[0.625rem] overflow-hidden'>
                        <div className='relative w-full h-full'>
                            <Image
                                src={`${thumbnail}`}
                                alt={item.tour_name}
                                width={0}
                                height={0}
                                priority={true}
                                sizes='100vw'
                                className='w-full h-full object-cover tour_item_vertical_image'
                            />
                            {/* object-cover  */}
                        </div>
                    </div>
                    <div className='search_result_item_detail col-span-12 flex flex-col justify-between gap-5 pt-3 pb-4 px-2.5'>
                        <div className='search_result_item_detail flex flex-col gap-0.5'>
                            <div className='text-cap-1 text-sgt-neutral-3 pb-1'>Tour {capitalizeFirstLetter(item.market_name)}</div>
                            <h3 className='search_result_item_detail_title text-sub-1 text-sgt-neutral-1 line-clamp-2'>{capitalizeFirstLetter(item.tour_name)}</h3>
                            <div className='search_result_item_detail_time flex flex-row justify-start items-center gap-1.5 pt-1'>
                                <div className='px-3 py-1.5 border border-sgt-neutral-4 rounded-sgt-10 text-cap-1 text-sgt-neutral-3'>{item.day_number} Ngày {item.night_number} Đêm</div>
                                <div className='px-3 py-1.5 border border-sgt-neutral-4 rounded-sgt-10 text-cap-1 text-sgt-neutral-3'>Vietjet Air</div>
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-end'>
                            <div className='flex flex-col justify-end items-start'>
                                {/* <div className='search_result_item_detail_price flex flex-row justify-start items-center gap-0.5 text-sgt-neutral-4 text-sm font-normal'>
                                <div className='line-through'>{formatPrice((tourPrice ?? 0).toString())}đ</div>
                            </div> */}
                                <div className='search_result_item_detail_price flex flex-row justify-start items-center gap-0.5 text-xl font-bold text-sgt-third-2'>
                                    <div>{formatPrice((tourPrice ?? 0).toString())}đ</div>
                                </div>
                            </div>
                            {
                                ishowBtn ?
                                    <div className='pb-2 pr-0.5'>
                                        <a href={detailLink} className='px-5 py-1.5 rounded-lg bg-sgt-primary-default text-sgt-secondary-default font-bold hover:bg-sgt-secondary-dark hover:text-white hover:transition-all'>
                                            Chọn
                                        </a>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    {/* <div className='search_result_item_detail_discount absolute top-2 mt-0.5 right-2'>
                    <div className='flex flex-row justify-between items-center text-sgt-neutral-7 bg-sgt-third-2 rounded-md px-1 gap-0.5 shadow-sgt-black-3'>
                        <span style={{ fontSize: "0.4375rem" }} className='font-semibold '>Giảm</span>
                        <span style={{ fontSize: "1.0625rem" }} className='font-bold'>30%</span>
                    </div>
                </div> */}
                </div>
            </a>
        </>

    )
}

export default ListingItemVerticalOption2