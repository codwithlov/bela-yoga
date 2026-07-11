'use client';
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Image from "next/image";
import { formatPrice } from '@/utils/formatPrice';
import dayjs from 'dayjs';
import { EMPTY_IMAGE, FROM_LIST, NOT_UPDATED_INFORMATION, VI_DATE_FORMAT } from '@/constants/ui';
import { capitalizeFirstLetter } from '@/utils/formatString';
import FlashSaleTimer from './FlashSaleTimer';
import { isEmpty } from '@/utils/helper';
import dynamic from 'next/dynamic';
import { marketHighlightOptions } from '@/constants/options';

/** Import Lazy CSS */

const ListingItemCss = dynamic(() => import('@/components/non-critical/ListingItemCss'), { ssr: false });

/** End */

type ViewedParam = {
    index?: number,
    item: any,
    className?: string,
    discountPosition?: string,
    isAnimation?: boolean,
    isShowDiscount?: boolean,
    cardBorder?: string,
    isTour?: boolean,
    isShowTimer?: boolean,
}
const ListingItemVertical = React.memo((props: ViewedParam) => {
    const {
        index,
        isAnimation = false,
        isShowDiscount = false,
        discountPosition = 'top-left',
        cardBorder,
        isShowTimer,
    } = props;
    const [isClient, setIsClient] = useState(false);
    const dateFormat = VI_DATE_FORMAT;
    let item = props.item;
    let detailLink = `/${item.slug}`;
    let thumbnail = item.images?.thumbnail_360 ?? EMPTY_IMAGE;
    let tourPrice = 0;
    let tourPriceOff = 0;
    const remaining_seats = item.remaining_seats ?? 0;
    let isTour = false;
    let startDate = '';
    let endDate = '';
    let carriers: string[] = [];
    if (item.tour_id > 0) {
        isTour = true;
        tourPrice = item.price_adl;
        tourPriceOff = item.is_push_sale == 1 ? item.push_sale_price_adl_off : item.price_adl_off;
        detailLink += `?series_code=${item.series_code}`
        carriers = [item.carrier];
    } else {
        tourPrice = item.min_price_adl;
        tourPriceOff = item.push_sale_price_adl_off && Number(item.push_sale_price_adl_off) < Number(item.min_price_adl_off) ?
            item.push_sale_price_adl_off : item.min_price_adl_off;
        carriers = item?.carrier?.slice(0, 2);
        if (item.display_price > 0 && Number(tourPrice) == 0 && Number(tourPriceOff) == 0) {
            tourPriceOff = item.display_price;
        }
    }
    if (isShowTimer) {
        startDate = item.push_sale_start_date;
        endDate = item.push_sale_end_date;
    }

    let discount = Math.floor(((tourPrice - tourPriceOff) * 100) / tourPrice);
    discount = discount > 0 ? discount : 0;

    let disPosition = '';
    if (discountPosition == 'top-right') {
        disPosition = 'top-2 right-2';
    } else if (discountPosition == 'top-left') {
        disPosition = 'top-2 left-2';
    }

    let fromList = useMemo(() => FROM_LIST, []);
    let from: any = !isEmpty(item.from) && !Array.isArray(item.from) ? [item.from] : item.from;
    let fromLocation = from.length > 0 ? from.map((i: any) => {
        return fromList.filter(f => f.value == i.trim())[0]?.label;
    }) : null;
    fromLocation = !isEmpty(fromLocation) ? fromLocation.join(', ') : FROM_LIST[0].label;
    let imagePriority = index as number == 0 || index as number <= 6 ? true : false;

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && <ListingItemCss />}
            <a href={detailLink} className={`${props.className ? props.className : `col-span-4`} tour_item_vertical cursor-pointer`}>
                <div className='h-full flex flex-col justify-between gap-0 rounded-[0.625rem] shadow-sgt-black-1 bg-white relative' style={{ marginBottom: "inherit" }}>
                    <div className='aspect-16/9 md:aspect-3/2 w-full rounded-[0.625rem] overflow-hidden'>
                        <div className='relative w-full h-full'>
                            <Image
                                src={`${thumbnail}`}
                                alt={item.tour_name}
                                fill
                                width={0}
                                height={0}
                                loading={imagePriority ? 'eager' : 'lazy'}
                                priority={imagePriority ? true : undefined}
                                // sizes='100vw'
                                className='w-full h-full object-cover tour_item_vertical_image'
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className='search_result_item_detail w-full flex-1 flex flex-col justify-between gap-4 pt-3 pb-5 px-2.5'>
                        <div className='search_result_item_detail flex flex-col gap-0.5'>
                            <div className='text-cap-1 text-sgt-neutral-3 pb-1'>Tour {capitalizeFirstLetter(item.market_name)}</div>
                            <h3 className='search_result_item_detail_title text-sub-1 text-sgt-neutral-1 line-clamp-2'>{capitalizeFirstLetter(item.tour_name)}</h3>
                            {
                                isTour ?
                                    <span className='w-full text-cap-1 font-medium text-sgt-secondary-3 line-clamp-1 text-ellipsis'>{item.series_code}</span> :
                                    null
                            }
                        </div>
                        <div className='flex flex-row justify-between items-end'>
                            <div className='search_result_item_detail flex flex-col gap-0.5'>
                                <div className='search_result_item_detail_star flex flex-row justify-start items-center gap-1.5'>
                                    <div className='bg-sgt-primary-1'
                                        style={{
                                            mask: 'url("/assets/icons/location.svg")',
                                            maskSize: 'cover',
                                            width: "1.25rem",
                                            height: "1.25rem",
                                            marginLeft: "-1px",
                                        }}
                                    >
                                    </div>
                                    <p className='text-cap-1 text-sgt-neutral-3'>{fromLocation}</p>
                                </div>
                                {
                                    isTour ?
                                        <Fragment>

                                            <div className='search_result_item_detail_star flex flex-row justify-start place-items-end gap-1.5 pb-0.5'>
                                                <div className='bg-sgt-primary-1'
                                                    style={{
                                                        mask: 'url("/assets/icons/calendar-origin.svg")',
                                                        maskSize: 'cover',
                                                        width: "1.125rem",
                                                        height: "1.125rem",
                                                    }}
                                                >
                                                </div>
                                                <p className='text-cap-1 text-sgt-neutral-3'>{dayjs(item.flight_date).format(dateFormat)}</p>
                                            </div>

                                            {/* <div className={`absolute left-3 ${iconClass}`}
                                            style={{
                                                mask: 'url("/assets/icons/location.svg")',
                                                maskSize: 'cover',
                                                width: "1.5rem",
                                                height: "1.5rem",
                                            }}
                                        ></div> */}
                                        </Fragment>
                                        :
                                        null
                                }

                                <div className='search_result_item_detail_time flex flex-row justify-start items-center gap-1.5'>
                                    <Image src="/assets/icons/clock.svg" alt="plane-icon" width={17} height={17} />
                                    <p className='text-cap-1 text-sgt-neutral-3'>{item.day_number} Ngày {item.night_number} Đêm</p>
                                </div>
                                {
                                    carriers?.length > 0 ?
                                        <div className='flex flex-col justify-start items-start gap-1 overflow-hidden pt-1.5'>
                                            {/* <Image src="/assets/icons/plane.svg" alt="plane-icon" width={20} height={20} /> */}
                                            {carriers.map((item) =>
                                                <Image
                                                    key={item}
                                                    src={`${item ?? '/assets/icons/plane.svg'}`}
                                                    alt={item}
                                                    width={0}
                                                    height={0}
                                                    loading='lazy'
                                                    // priority={true}
                                                    sizes='100vw'
                                                    className='w-auto max-w-16 h-[20px] object-contain'
                                                />)}
                                        </div>
                                        :
                                        <div className='flex flex-row justify-start items-center gap-1.5 overflow-hidden'>
                                            <Image src="/assets/icons/plane.svg" alt="plane-icon" width={20} height={20} />
                                            <p className='text-cap-1 text-sgt-neutral-3'>{NOT_UPDATED_INFORMATION}</p>
                                        </div>
                                }
                            </div>
                            <div className='flex flex-col justify-end items-end'>
                                {
                                    isShowTimer ?
                                        <FlashSaleTimer
                                            className='sgt_timer_in_card mb-0.5'
                                            key={index}
                                            startDate={startDate}
                                            endDate={endDate}
                                        /> : null

                                }
                                {
                                    discount > 0 &&
                                    <div className='search_result_item_detail_price flex flex-row justify-start items-center gap-0.5 text-sgt-neutral-3 text-xs font-normal'>
                                        {(tourPrice == tourPriceOff || tourPrice == 0) ? null : <div className='line-through'>{formatPrice((tourPrice ?? 0).toString())}đ</div>}
                                    </div>
                                }
                                <div className='search_result_item_detail_price flex flex-row justify-start items-center gap-0.5 text-sub-1 text-sgt-third-2'>
                                    <div>{formatPrice((tourPrice == tourPriceOff ? tourPrice : tourPriceOff).toString())}đ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`tour_item_vertical_discount absolute mt-0.5 flex flex-col ${disPosition} ${isAnimation ? '' : 'items-end'}`}>
                        {
                            isShowDiscount && discount > 0 ?
                                isAnimation ?
                                    <>
                                        <div className='tour_item_vertical_discount_item tour_item_vertical_discount_0'>
                                            <span style={{ fontSize: "0.4375rem" }} className='font-semibold'>Giảm</span>
                                            <span style={{ fontSize: "1.0625rem" }} className='font-bold max-sm:!text-sm'>{`${discount}%`}</span>
                                        </div>
                                        <div className={`tour_item_vertical_discount_item tour_item_vertical_discount_1`}>
                                            <span style={{ fontSize: "0.4375rem" }} className='font-semibold '>còn</span>
                                            <span style={{ fontSize: "1.0625rem" }} className='font-bold max-sm:!text-sm'>{remaining_seats}</span>
                                            <span style={{ fontSize: "0.4375rem" }} className='font-semibold '>chỗ</span>
                                        </div>
                                    </>
                                    :
                                    <div className='tour_item_vertical_discount_item justify-end'>
                                        <span style={{ fontSize: "0.4375rem" }} className='font-semibold '>Giảm</span>
                                        <span style={{ fontSize: "1.0625rem" }} className='font-bold'>{`${discount}%`}</span>
                                    </div>
                                : null
                        }
                    </div>
                    {
                        item.sale_status && item.sale_status !== 'NORMAL' &&
                        <div className='mb-1 tour_item_vertical_highlight_item'>
                            <span className="text-sm font-semibold">{marketHighlightOptions.find(i => i.value === item.sale_status)?.label}</span>
                        </div>
                    }
                </div>
            </a>
        </>
    )
});
ListingItemVertical.displayName = 'ListingItemVertical';
export default ListingItemVertical