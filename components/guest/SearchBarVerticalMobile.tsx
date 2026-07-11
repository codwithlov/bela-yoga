'use client'
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/plugin/localeData';
import type { Dayjs } from 'dayjs';
import { VI_DATE_FORMAT, VI_LOCALE } from '@/constants/ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Drawer, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AntdCalendar from './AntdCalendar';
import { setDynamicSlug, setFlightDateParam, setKeywordParam } from '@/store/searchSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Image from "next/image";
import { GUEST_SEARCH, GUEST_TAGS } from '@/constants/route';
import { INationSummary } from '@/interfaces/nation';
import { highlightText, searchInString } from '@/utils/formatString';
import { DEFAULT_MARKET_TYPE_SLUG } from '@/constants/SlugPermalink';
import { IMarketSummary } from '@/interfaces/market';
import { IDestinationBase } from '@/interfaces/destination';
import { isEmpty } from '@/utils/helper';
import { useGetDataQuery } from '@/services/api/common';
import { ITagBase } from '@/interfaces/tag';

import dynamic from 'next/dynamic';

/** Import Lazy CSS */

const DatePickerCalendarCustomCss = dynamic(() => import('@/components/non-critical/DatePickerCalendarCustomCss'), { ssr: false });
const SearchBarCss = dynamic(() => import('@/components/non-critical/SearchBarCss'), { ssr: false });

/** End */

type SearchBarVerticalMobileParam = {
    itemGap?: string,
    borderColorInput?: string,
    bgInput?: string,
    location?: string,
    date?: string,
    nationList: INationSummary[],
    destinationList: IDestinationBase[],
    marketList: IMarketSummary[],
    tagList: ITagBase[],
    oldSlug?: string | null,
    apiComponent?: (e: any) => void,
}

dayjs.locale(VI_LOCALE);
let typingTimer: any;

const SearchBarVerticalMobile = (props: SearchBarVerticalMobileParam) => {
    let {
        apiComponent,
        date,
        location,
        borderColorInput = 'border-sgt-neutral-7',
        bgInput = 'bg-sgt-neutral-6',
        itemGap = 'gap-2',
        nationList,
        destinationList,
        marketList,
        tagList,
        oldSlug,
    } = props;

    /** Variables global */
    //#region Constant 
    const dateFormat = VI_DATE_FORMAT;
    const SEARCHTIMEOUT = 500;
    const NATION_FILTER = 'nation_filter';
    const DESTENATION_FILTER = 'destenation_filter';
    const MARKET_FILTER = 'market_filter';
    const TAG_FILTER = 'tag_filter';
    //#endregion

    /** use hook */
    const dispatch = useAppDispatch();
    const [locationName, setLocationName] = useState(location);
    const [dateSelected, setDateSelected] = useState(date ?? dayjs().format(dateFormat).toString());

    const search = useAppSelector((state) => state.search);

    let searchPath = useMemo(() => {
        const flightDate = search.flightDateParam || dayjs().format(dateFormat);
        const slug = search.slug || oldSlug;
        const keyword = search.keyword;
        const defaultParam = `flight_date=${flightDate}`;
        let pathConvert = slug ? slug : keyword ? `${GUEST_SEARCH}?keyword=${keyword}` : `${search.marketTypeSlug}`;
        pathConvert.search('keyword') == -1 && pathConvert.search(GUEST_TAGS.replace(/\//, '')) == -1 ?
            `${pathConvert}?${defaultParam}` :
            `${pathConvert}`;
        pathConvert = !pathConvert.startsWith('/', 0) ? `/${pathConvert}` : pathConvert;
        return pathConvert;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, oldSlug]);

    /** Variables */
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [openCalendarModal, setOpenCalendarModal] = useState(false);
    const [optNationList, setOptNationList] = useState(nationList || []);
    const [optDestinationList, setOptDestinationList] = useState(destinationList || []);
    const [optMarketList, setOptMarketList] = useState(marketList || []);
    const [optTagList, setOptTagList] = useState(tagList || []);
    const inputPlaceholderRef = useRef<HTMLInputElement>(null);
    const [isClient, setIsClient] = useState(false);

    /** Functions */
    const { data: dataResearch, isFetching } = useGetDataQuery(
        `others/option-list?keyword=${search.keyword}`,
        {
            skip: isEmpty(search.keyword),
            refetchOnMountOrArgChange: true,
        }
    )

    const selectedTourDate = (date: Dayjs, info: { source: 'year' | 'month' | 'date' | 'customize' }) => {
        const dateSelect = date.format(dateFormat);
        if (info.source == 'date') {
            setDateSelected(dateSelect as string);
            dispatch(setFlightDateParam(dateSelect as string));
            setOpenCalendarModal(false);
        }
    };

    const setPathSearchPage = useCallback((
        filterSearchParam: any = null
    ) => {
        dispatch(setDynamicSlug(filterSearchParam));
    }, [dispatch])

    const handleOnClickItem = useCallback((
        e: any,
        value: string,
        title: string
    ) => {
        const param = `${value}`;
        setPathSearchPage(param);
        setLocationName(title);
        setOpenLocationModal(false);
    }, [setPathSearchPage])

    const handleOnSearch = (value: string) => {
        if (isEmpty(value)) {
            setOptNationList((nationList || []).filter(i => searchInString(value, i.nation_name)));
            setOptDestinationList((destinationList || []).filter((i: any) => searchInString(value, i.destination_name)));
            setOptMarketList((marketList || []).filter((i: any) => searchInString(value, i.tour_name)));
            setOptTagList(tagList || []);
        }
        dispatch(setDynamicSlug(null));
        setLocationName(value);
        dispatch(setKeywordParam(value));
    }

    const HandleOnKeyUP = (event: any) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            handleOnSearch(event.target.value)
        }, SEARCHTIMEOUT);
    }

    const renderTitle = (title: string, className?: string) => {
        return (
            <div className='pl-2.5 py-1.5'>
                <span className='tex-sm text-black font-medium'>
                    {title}
                </span>
            </div>
        );
    }

    const renderNationItem = useCallback((
        slug: string,
        count: number,
        icon: string | null,
        title: string,
        highlightLabel: string,
    ) => ({
        value: title,
        label: (
            <div
                onClick={(e) => handleOnClickItem(e, slug, title)}
                data-slug={(title)}
                className="flex flex-row justify-between items-center py-1.5 px-3 pl-6"
            >
                <div className="flex">
                    <Image
                        src={icon ?? ''}
                        alt={`${title}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-5 h-5 mr-2"
                    />
                    <div dangerouslySetInnerHTML={{ __html: highlightLabel ?? '' }}></div>
                </div>
                <span>
                    {count} sân
                </span>
            </div>
        ),
    }), [handleOnClickItem]);

    const renderDestinationItem = useCallback((
        value: any,
        label: string,
        highlightLabel: string
    ) => ({
        value: label,
        label: (
            <div onClick={(e) => handleOnClickItem(e, value, label)}
                id={DESTENATION_FILTER}
                data-slug={value}
                className="flex flex-row justify-between items-center py-1.5 px-3 pl-6"
            >
                <div data-slug={value} dangerouslySetInnerHTML={{ __html: highlightLabel ?? '' }}></div>
            </div>
        ),
    }), [handleOnClickItem]);

    const renderMarketItem = useCallback((
        value: any,
        label: string,
        highlightLabel: string
    ) => ({
        value: label,
        label: (
            <div onClick={(e) => handleOnClickItem(e, value, label)}
                id={MARKET_FILTER}
                data-slug={value}
                className="flex flex-row justify-between items-center py-1.5 px-3 pl-6"
            >
                <div data-slug={value} dangerouslySetInnerHTML={{ __html: highlightLabel ?? '' }}></div>
            </div>
        ),
    }), [handleOnClickItem]);

    const renderTagItem = useCallback((
        value: any,
        label: string,
        highlightLabel: string
    ) => ({
        value: label,
        label: (
            <div onClick={(e) => handleOnClickItem(e, value, label)}
                id={TAG_FILTER}
                data-slug={value}
                className="flex flex-wrap justify-between items-center px-6 py-1.5"
            >
                <div
                    className="px-3 py-1 rounded-2xl border cursor-pointer border-sgt-secondary-1 hover:bg-sgt-neutral-6"
                    data-slug={value}
                    dangerouslySetInnerHTML={{ __html: highlightLabel ?? '' }}>
                </div>
            </div>

        ),
    }), [handleOnClickItem]);

    let options: any = [
        {
            label: renderTitle('Khu vực nổi bật'),
            options: [],
        },
        {
            label: renderTitle('Cụm sân phổ biến'),
            options: [],
        },
        {
            label: renderTitle('Sân đang được quan tâm'),
            options: [],
        },
        {
            label: renderTitle('Chủ đề'),
            options: [],
        }
    ];

    options[0].options = useMemo(() => {
        return optNationList.map(nation => {
            return renderNationItem(
                nation.slug,
                nation.total_tour,
                nation.url_media,
                nation.nation_name,
                highlightText(nation.nation_name, search?.keyword),
            )
        }) || [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderNationItem, optNationList, search?.keyword]);

    options[1].options = useMemo(() => {
        return optDestinationList.map((item: any) => {
            return renderDestinationItem(
                item.slug,
                item.destination_name,
                highlightText(item.destination_name, search?.keyword),
            )
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderDestinationItem, optDestinationList, search?.keyword]);

    options[2].options = useMemo(() => {
        return optMarketList.map((item: IMarketSummary) => {
            return renderMarketItem(
                item.slug,
                item.tour_name,
                highlightText(item.tour_name, search?.keyword),
            )
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderMarketItem, optMarketList, search?.keyword]);

    options[3].options = useMemo(() => {
        return optTagList.map((item: ITagBase) => {
            return renderTagItem(
                item.slug,
                item.name,
                highlightText(item.name, search?.keyword),
            )
        })
    }, [renderTagItem, optTagList, search?.keyword]);

    if (optNationList.length == 0 && optDestinationList.length == 0 && optMarketList.length == 0 && optTagList.length == 0) {
        // options = [];
        options = [
            {
                label: renderTitle('Không có kết quả tìm kiếm', 'text-sm text-bold text-black'),
                options: [],
            },
        ]
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resetParams = () => {
        const flightDate = dayjs().format(dateFormat);
        dispatch(setDynamicSlug(DEFAULT_MARKET_TYPE_SLUG));
        dispatch(setFlightDateParam(flightDate));
        setLocationName('');
        selectedTourDate(dayjs(), { source: 'date' });
    }

    const apiSearchFilters = useMemo(() => {
        return {
            resetParams: () => { resetParams() },
        }
    }, [resetParams])

    useEffect(() => {
        apiComponent ? apiComponent(apiSearchFilters) : null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const typeWriter = (text: string, n: number) => {
        if (n < text.length) {
            let newText = text.slice(0, n + 1);
            inputPlaceholderRef.current?.setAttribute('placeholder', newText);
            n++;
            setTimeout(function () {
                typeWriter(text, n);
            }, 80);
        }
    }

    useLayoutEffect(() => {
        if (!inputPlaceholderRef.current || optNationList.length === 0) {
            inputPlaceholderRef.current?.setAttribute("placeholder", "Bạn muốn chơi ở đâu?");
            return;
        }

        let index = 0;
        let intervalId: NodeJS.Timeout;

        const startTyping = () => {
            let placeholder = optNationList[index]?.nation_name ?? '';
            inputPlaceholderRef.current?.setAttribute('placeholder', '');
            typeWriter(placeholder, 0);
            index = (index + 1) % optNationList.length;
        };

        startTyping();
        intervalId = setInterval(startTyping, 5000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optNationList]);

    useEffect(() => {
        if (!dataResearch?.data) return;
        const data = dataResearch?.data;
        setOptNationList((data.nationList || []));
        setOptDestinationList((data.destinationList || []));
        setOptMarketList((data.marketList || []));
        setOptTagList((data.tagList || []));
    }, [dataResearch?.data]);

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
            <section className='px-5 pt-2 pb-5 flex justify-center items-center'>
                <div className='width-primary m-auto text-lg font-normal max-sm:w-full'>
                    <div className={`w-full grid grid-cols-12 ${itemGap}`}>
                        <div className='relative col-span-12' >
                            <div className={`${bgInput} ${borderColorInput} border flex justify-start items-center rounded-md`}
                                onClick={() => setOpenLocationModal(true)}>
                                <div className='bg-sgt-primary-1 ml-3'
                                    style={{
                                        mask: 'url("/assets/icons/location.svg")',
                                        maskSize: 'cover',
                                        width: "1.5rem",
                                        height: "1.5rem",
                                    }}
                                ></div>
                                <input

                                    style={{
                                        backgroundColor: 'inherit'
                                    }}
                                    className='w-full placeholder:text-opacity-85 focus-visible:outline-none rounded-md py-2.5 px-2.5 text-button text-sgt-neutral-4 disabled:bg-sgt-neutral-6'
                                    placeholder='Bạn muốn chơi ở đâu?'
                                    readOnly={true}
                                    value={locationName || ''}
                                    ref={inputPlaceholderRef}
                                />
                            </div>
                        </div>
                        <div className='relative col-span-12'>
                            <div className={`${bgInput} ${borderColorInput} border flex justify-start items-center rounded-md`}
                                onClick={() => setOpenCalendarModal(true)}>
                                <div className='bg-sgt-primary-1 ml-3'
                                    style={{
                                        mask: 'url("/assets/icons/calendar-origin.svg")',
                                        maskSize: 'cover',
                                        width: "1.5rem",
                                        height: "1.5rem",
                                    }}
                                >
                                </div>
                                <input
                                    style={{
                                        backgroundColor: 'inherit'
                                    }}
                                    className='w-full placeholder:text-opacity-85 focus-visible:outline-none rounded-md py-2.5 px-2.5 text-button text-sgt-neutral-4 disabled:bg-sgt-neutral-6'
                                    type="text"
                                    placeholder='Chọn ngày khởi hành'
                                    readOnly={true}
                                    value={dateSelected}
                                />
                            </div>
                        </div>
                        <a href={`${searchPath}`}
                            className='col-span-12 bg-gradient-to-t from-sgt-primary-1 to-sgt-primary-2 text-sgt-neutral-1 rounded-md text-button flex flex-row gap-1 justify-center items-center'>
                            <Image src="/assets/icons/search.svg" alt="search-icon" width={24} height={24} />
                            <div className='py-2.5' id="search">Tìm sân</div>
                        </a>
                    </div>
                </div>
                <Drawer
                    title=""
                    style={{}}
                    open={openLocationModal}
                    width={"100%"}
                    height={"100%"}
                    footer={null}
                    closeIcon={null}
                    className="sgt_drawer"
                    placement='bottom'
                >
                    <div className='bg-sgt-neutral-7 px-3 py-2.5 flex flex-row justify-between items-center sticky left-0 top-0'>
                        <div className='bg-white flex flex-1 justify-start items-center rounded-md border border-sgt-primary-1 relative'
                            onClick={() => setOpenLocationModal(true)}>
                            <div className='bg-sgt-primary-1 ml-1.5'
                                style={{
                                    mask: 'url("/assets/icons/location.svg")',
                                    maskSize: 'cover',
                                    width: "1.5rem",
                                    height: "1.5rem",
                                }}
                            >
                            </div>
                            <input
                                onInput={(event) => HandleOnKeyUP(event)}
                                className='w-full placeholder:text-opacity-85 focus-visible:outline-none rounded-md py-1.5 px-2 text-button disabled:bg-white'
                                placeholder='Bạn muốn chơi ở đâu?'
                                defaultValue={locationName}
                            />
                            <div className="flex justify-center items-center absolute right-2">
                                {
                                    isFetching ?
                                        <Spin
                                            size="large"
                                            className="pr-4"
                                            indicator={
                                                <LoadingOutlined

                                                    className="!text-sgt-primary-1"
                                                    style={{
                                                        fontSize: 20
                                                    }}
                                                    spin
                                                />
                                            }
                                        />
                                        : null
                                }
                            </div>
                        </div>
                        <button className='text-right ml-1.5' onClick={() => setOpenLocationModal(false)}>
                            <div className='bg-sgt-neutral-1'
                                style={{
                                    mask: 'url("/assets/icons/close.svg")',
                                    maskSize: 'cover',
                                    width: "1.5rem",
                                    height: "1.5rem",
                                }}
                            >
                            </div>
                        </button>
                    </div>
                    <div className='pt-1 pb-4'>
                        {
                            options.map((item: any, gIndex: number) => {
                                return <div key={gIndex}>
                                    <div className='bg-gray-50'>{item.label}</div>
                                    <div className='pb-4'>
                                        {
                                            item.options?.map((opt: any, index: number) => {
                                                return <div key={index}>
                                                    {opt['label']}
                                                </div>;
                                            })
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </Drawer>
                <Drawer
                    title=""
                    style={{}}
                    open={openCalendarModal}
                    width={"100%"}
                    height={"100%"}
                    footer={null}
                    closeIcon={null}
                    className="sgt_drawer"
                    placement='bottom'
                >
                    <div className='bg-sgt-primary-default px-3 py-2.5 flex flex-row justify-between items-center sticky left-0 top-0'>
                        <div className='text-base font-medium'>Ngày khởi hành</div>
                        <FontAwesomeIcon className='w-10 text-sgt-secondary-dark text-2xl text-right' icon={faClose} onClick={() => setOpenCalendarModal(false)}></FontAwesomeIcon>
                    </div>
                    <div className='pt-1 pb-4'>
                        <AntdCalendar
                            className='sgt_calendar'
                            disabledDate={(date: Dayjs) => {
                                if (date.endOf('d').valueOf() < dayjs().endOf('d').valueOf()) {
                                    return true;
                                }
                                return false;
                            }}
                            onSelect={selectedTourDate}
                        />
                    </div>
                </Drawer>
            </section>
        </>

    )
}

export default SearchBarVerticalMobile
