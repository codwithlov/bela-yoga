'use client';
import Image from "next/image";
import { formatPrice } from "@/utils/formatPrice";
import dayjs from 'dayjs';
import { FROM_LIST, NOT_UPDATED_INFORMATION, VI_DATE_FORMAT } from '@/constants/ui';
import { capitalizeFirstLetter } from "@/utils/formatString";
import { useEffect, useMemo, useState } from "react";
import { isEmpty } from "@/utils/helper";
import dynamic from "next/dynamic";
import { marketHighlightOptions } from "@/constants/options";

/** Import Lazy CSS */

const ListingItemCss = dynamic(() => import('@/components/non-critical/ListingItemCss'), { ssr: false });

/** End */

type ViewedParam = {
    index?: number,
    item: any,
    discountPosition?: string,
    isAnimation?: boolean,
    isShowDiscount?: boolean,
    cardBorder?: string,
}
const ListingItemHorizontal = (props: ViewedParam) => {
    const {
        index,
        isAnimation = false,
        isShowDiscount = false,
        discountPosition = 'top-right',
        cardBorder,
    } = props;

    const dateFormat = VI_DATE_FORMAT;
    let item = props.item;
    let detailLink = `/${item.slug}`;
    // let randomIndex = Math.floor(Math.random() * 8);
    // let thumbnail = `/assets/images/country/${fakeTourAbroadList[props.index ?? 0]}`;
    let thumbnail = item.images?.original_image ?? '';
    let tourPrice = 0;
    let tourPriceOff = 0;
    const remaining_seats = item.remaining_seats ?? 0;
    let isTour = false;
    let carriers: string[] = [];
    if (item.tour_id > 0) {
        isTour = true;
        tourPrice = item.price_adl;
        tourPriceOff = item.is_push_sale == 1 ? item.push_sale_price_adl_off : item.price_adl_off;
        carriers = [item.carrier];
    } else {
        tourPrice = item.min_price_adl;
        tourPriceOff = item.push_sale_price_adl_off && item.push_sale_price_adl_off < item.min_price_adl_off ?
            item.push_sale_price_adl_off : item.min_price_adl_off;
        carriers = item.carrier.slice(0, 2);
        if (item.display_price > 0 && Number(tourPrice) == 0 && Number(tourPriceOff) == 0) {
            tourPriceOff = item.display_price;
        }
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
    let imagePriority = index as number == 0 || index as number <= 10 ? true : false;
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && <ListingItemCss />}
            <a href={detailLink} className={`tour_item_horizontal h-full col-span-12 rounded-sgt-10 bg-white shadow-sgt-black-1 cursor-pointer ${cardBorder}`}>
                <div className='grid grid-cols-12 gap-4 h-full max-sm:gap-2.5 relative'>
                    <div className='col-span-5 rounded-tl-lg rounded-bl-lg overflow-hidden aspect-auto'>
                        <div className='relative w-full h-full overflow-hidden'>
                            <Image
                                src={`${thumbnail}`}
                                alt={item.tour_name}
                                width={0}
                                height={0}
                                loading={imagePriority ? 'eager' : 'lazy'}
                                priority={imagePriority ? true : undefined}
                                // sizes="100%"
                                fill
                                className='w-full h-full object-cover tour_item_horizontal_image transition-transform duration-500 hover:scale-110'
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className='col-span-7 flex flex-col justify-between pt-3 pb-3 px-2.5 max-sm:pl-0 max-sm:pb-2.5 '>
                        <div className="flex flex-row justify-between items-start relative mb-4">
                            <div className='flex flex-col gap-0.5 overflow-hidden'>
                                <div className='tour_item_horizontal_subtitle text-cap-1 text-sgt-neutral-3 pb-1'>Tour {capitalizeFirstLetter(item.market_name)}</div>
                                <span className='tour_item_horizontal_title text-sub-1 text-sgt-neutral-1 line-clamp-2 pb-0.5'>{capitalizeFirstLetter(item.tour_name)}</span>
                                {
                                    isTour ?
                                        <span className='block text-cap-1 font-medium text-sgt-secondary-3 line-clamp-1 text-ellipsis'>{item.series_code}</span> :
                                        null
                                }
                            </div>
                        </div>
                        <div className=' flex flex-col gap-0.5'>
                            <div className='search_result_item_detail_star flex flex-row justify-start items-center gap-1.5'>
                                <div className='bg-sgt-primary-1'
                                    style={{
                                        mask: 'url("/assets/icons/location.svg")',
                                        maskSize: 'cover',
                                        width: "1.25rem",
                                        height: "1.25rem",
                                        marginLeft: "-2px",
                                    }}
                                >
                                </div>
                                <p className='text-cap-1 text-sgt-neutral-3'>{fromLocation || FROM_LIST[0].label}</p>
                            </div>
                            {
                                isTour ?
                                    <div className='tour_item_horizontal_star flex flex-row justify-start place-items-end gap-1.5 pb-0.5 '>

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
                                    </div> :
                                    null
                            }
                            <div className='tour_item_horizontal_day flex flex-row justify-start items-center gap-1.5'>
                                <div className='bg-sgt-primary-1'
                                    style={{
                                        mask: 'url("/assets/icons/clock.svg")',
                                        maskSize: 'cover',
                                        width: "1.0625rem",
                                        height: "1.0625rem",
                                    }}
                                >
                                </div>
                                <p className='text-cap-1 text-sgt-neutral-3'>{item.day_number} Ngày {item.night_number} Đêm</p>
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center gap-2 mt-1'>
                            <div className=' flex flex-col gap-0.5'>
                                {
                                    carriers?.length > 0 ?
                                        <div className='flex flex-row justify-start items-start gap-1 overflow-hidden'>
                                            <Image
                                                key={carriers[0]}
                                                src={`${carriers[0] ?? '/assets/icons/plane.svg'}`}
                                                alt={carriers[0]}
                                                width={0}
                                                height={0}
                                                loading="lazy"
                                                // priority={false}
                                                sizes='100vw'
                                                className='w-auto h-[20px] max-w-16 object-contain'
                                            />
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
                                    discount > 0 &&
                                    <div className='tour_item_horizontal_price flex flex-row justify-start items-center gap-0.5 text-sgt-neutral-4 font-normal text-xs'>
                                        {(tourPrice == tourPriceOff || tourPrice == 0) ? null : <div className='line-through'>{formatPrice((tourPrice ?? 0).toString())}đ</div>}
                                    </div>
                                }
                                <div className='tour_item_horizontal_price flex flex-row justify-start items-center gap-0.5 font-bold text-sub-1 text-sgt-third-2'>
                                    <div>{formatPrice((tourPrice == tourPriceOff ? tourPrice : tourPriceOff).toString())}đ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`tour_item_horizontal_discount absolute mt-0.5 flex flex-col ${disPosition} ${isAnimation ? '' : 'items-end'}`}>
                        {
                            isShowDiscount ?
                                isAnimation ?
                                    <>
                                        <div className='tour_item_horizontal_discount_item tour_item_horizontal_discount_0'>
                                            <span style={{ fontSize: "0.4375rem" }} className='font-semibold'>Giảm</span>
                                            <span style={{ fontSize: "1.0625rem" }} className='font-bold max-sm:!text-sm'>{`${discount}%`}</span>
                                        </div>
                                        <div className={`tour_item_horizontal_discount_item tour_item_horizontal_discount_1`}>
                                            <span style={{ fontSize: "0.4375rem" }} className='font-semibold '>còn</span>
                                            <span style={{ fontSize: "1.0625rem" }} className='font-bold max-sm:!text-sm'>{remaining_seats}</span>
                                            <span style={{ fontSize: "0.4375rem" }} className='font-semibold '>chỗ</span>
                                        </div>
                                    </>
                                    :
                                    <div className='tour_item_horizontal_discount_item justify-end'>
                                        <span style={{ fontSize: "0.4375rem" }} className='font-semibold '>Giảm</span>
                                        <span style={{ fontSize: "1.0625rem" }} className='font-bold'>{`${discount}%`}</span>
                                    </div>
                                : null
                        }
                    </div>
                    {
                        item.sale_status && item.sale_status !== 'NORMAL' &&
                        <div className='mb-1 tour_item_horizontal_highlight_item'>
                            <span className="max-sm:text-xs text-sm font-semibold">{marketHighlightOptions.find(i => i.value === item.sale_status)?.label}</span>
                        </div>
                    }
                </div>
            </a >
        </>
    )
}

export default ListingItemHorizontal