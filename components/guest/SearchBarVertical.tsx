
'use client';
import React, { Suspense, useEffect, useState } from 'react'
import 'dayjs/locale/vi';
import SearchBarInputLocation from './SearchBarInputLocation';
import SearchBarButton from './SearchBarButton';
import SearchBarDate from './SearchBarDate';
import { INationSummary } from '@/interfaces/nation';
import { IDestinationBase } from '@/interfaces/destination';
import { IMarketSummary } from '@/interfaces/market';
import useWindowSize from '@/hooks/useWindowSize';
import { Tag } from '@/interfaces/tag';
import dynamic from 'next/dynamic';

/** Import Lazy CSS */

const DatePickerCalendarCustomCss = dynamic(() => import('@/components/non-critical/DatePickerCalendarCustomCss'), { ssr: false });
const SearchBarCss = dynamic(() => import('@/components/non-critical/SearchBarCss'), { ssr: false });

/** End */

// import '@/styles/components/date-picker-calendar-custom.scss';
// import "@/styles/components/search-bar.scss";

const SearchBarVertical = ({
    slogan,
    nationList,
    destinationList,
    marketList,
    tagList,
}: {
    nationList: INationSummary[],
    destinationList: IDestinationBase[],
    marketList: IMarketSummary[],
    slogan: string,
    tagList: Tag[],
}) => {
    const windowSize = useWindowSize();
    const left = ((windowSize.width || 1500) - 1222) / 2 - 7;
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            {
                isClient &&
                <>
                    <DatePickerCalendarCustomCss />
                    <SearchBarCss />
                </>
            }
            {windowSize?.width && <div id="search_bar_vertical_component"
                className='bg-sgt-neutral-1 bg-opacity-70 rounded-2xl absolute top-32 w-[630px]'
                style={{ left: (left > 10 ? left : 10) }}
            >
                <div className='p-4'>
                    <span className='text-sgt-primary-2 text-2xl font-bold'>{slogan}</span>
                </div>
                <section className='px-5 pt-2 pb-6 flex justify-center items-center'>
                    <Suspense>
                        <div className='width-primary m-auto text-lg font-normal max-sm:w-full'>
                            <div className='w-full grid grid-cols-12 gap-4'>
                                <div className='relative col-span-12 h-10 bg-white  bg-opacity-50 text-sgt-neutral-5 flex flex-1 justify-start items-center rounded-md border-sgt-neutral-7'>
                                    <SearchBarInputLocation
                                        inputClass='!text-sub-1 !text-sgt-neutral-5'
                                        iconClass='bg-sgt-neutral-7'
                                        nationList={nationList}
                                        destinationList={destinationList}
                                        marketList={marketList}
                                        tagList={tagList}
                                    />
                                </div>
                                <div className='relative col-span-9 h-10 bg-white bg-opacity-50 text-sgt-neutral-5 flex justify-center items-center rounded-md border-sgt-neutral-7'>
                                    <SearchBarDate
                                        inputClass='!text-sub-1 !text-sgt-neutral-5'
                                        iconClass='bg-sgt-neutral-7'
                                    />
                                </div>
                                <SearchBarButton
                                    btnClass='col-span-3 bg-sgt-primary-default text-sgt-secondary-dark rounded-md text-button text-sgt-neutral-1  bg-gradient-to-t from-sgt-primary-1 to-sgt-primary-2 transition-all duration-300 hover:shadow-sgt-primary flex flex-row justify-center items-center'
                                    iconClass='text-base'
                                />
                            </div>
                        </div>
                    </Suspense>
                </section>
            </div>
            }
        </>
    )
}

export default SearchBarVertical


