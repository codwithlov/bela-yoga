'use client'
import { RadioChangeEvent, Slider } from 'antd'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import '@/styles/components/input.scss'
import { formatPrice } from '@/utils/formatPrice'
import { useAppDispatch } from '@/store/hooks'
import { setDefaultPage, setDuringFilter, setUrlWithParam } from '@/store/searchSlice'
import useInitUrlParamOfSearch from '../hooks/useInitUrlParamOfSearch'
import { toQueryString } from '@/utils/apiUtils'
import { capitalizeFirstLetter } from '@/utils/formatString'
import usePathUrlToSlugOfSearch from '../hooks/usePathUrlToSlugOfSearch'
import { BEST_TOUR_TYPE_KEY, DAY_TYPE_KEY, DESTINATION_TYPE_KEY, FROM_TYPE_KEY, MARKET_TYPE_KEY, PRICE_RANGE_TYPE_KEY } from '../constants/searchParams'
import { HCM_CODE, HN_CODE } from '@/constants/listing'
import { DESTINATION_SLUG, MARKET_TYPE_SLUG } from '@/constants/SlugPermalink'

type SearchFilterParams = {
    isMobile?: boolean,
    closePopup?: () => void,
    apiComponent?: (e: any) => void,
    slugType: string,
    optionListData: any,
}

export const OptionFilters = React.memo(({
    isAnimation,
    options,
    filterConditions,
    onClickFilter,

}: {
    isAnimation: boolean,
    options: any,
    filterConditions: any,
    onClickFilter: any
}) => {
    const dayTypeKey = DAY_TYPE_KEY;
    const marketTypeKey = MARKET_TYPE_KEY;
    const destinationTypeKey = DESTINATION_TYPE_KEY;
    const fromTypeKey = FROM_TYPE_KEY;
    if ((options?.items || []).length === 0 && options.type == destinationTypeKey) return <></>
    return (
        <div className='search_filter_item'>
            <div className='flex flex-row justify-between items-center'>
                <div className='search_filter_item_title'>{options.title}</div>
                {/* <button className='font-medium transition-all duration-300 text-bela-neutral-3 hover:text-bela-secondary-1' onClick={resetDaynumberFilter}>Đặt lại</button> */}
            </div>
            {/*  */}
            <div className={`flex flex-row flex-wrap gap-2 pt-4 overflow-hidden max-h-0 max-sm:!max-h-max ${isAnimation ? 'search_filter_item_container' : '!max-h-max'}`}>
                {
                    options.items?.map((i: any, iIndex: number) => {
                        let active = '';
                        let valueConvert: any;
                        if (options.type == dayTypeKey) {
                            valueConvert = filterConditions[dayTypeKey] ? filterConditions[dayTypeKey]?.split('|') : null;
                        } else if (options.type == marketTypeKey) {
                            valueConvert = filterConditions[marketTypeKey] ? filterConditions[marketTypeKey]?.split('|') : null;
                        } else if (options.type == destinationTypeKey) {
                            valueConvert = filterConditions[destinationTypeKey] ? filterConditions[destinationTypeKey]?.split('|') : null;
                        } else if (options.type == fromTypeKey) {
                            valueConvert = filterConditions[fromTypeKey] ? filterConditions[fromTypeKey]?.split('|') : null;
                        }
                        if (valueConvert && i.value == valueConvert[0]) {
                            active = 'search_filter_item_btn_active';
                        }
                        return <Fragment key={iIndex}>
                            {
                                options.type == destinationTypeKey ?
                                    <a
                                        key={iIndex + 1}
                                        href={`${i.value}`}
                                        className={`search_filter_item_btn ${active ?? ''}`}
                                    >
                                        <span className='max-sm:px-3.5 px-2 py-1.5' >{i.label}</span>
                                    </a> :
                                    <button
                                        key={iIndex + 1}
                                        onClick={() => onClickFilter(i.value, options.type)}
                                        className={`search_filter_item_btn ${active ?? ''}`}
                                    >
                                        <span className='max-sm:px-3.5 px-2 py-1.5' >{i.label}</span>
                                    </button>
                            }
                        </Fragment>
                    })
                }
            </div>
        </div>
    )
});

OptionFilters.displayName = 'OptionFilters';

const SearchFilters: React.FC<SearchFilterParams> = ({
    apiComponent,
    closePopup,
    isMobile = false,
    slugType,
    optionListData,
}) => {
    const dayTypeKey = DAY_TYPE_KEY;
    const marketTypeKey = MARKET_TYPE_KEY;
    const destinationTypeKey = DESTINATION_TYPE_KEY;
    const priceRangeTypeKey = PRICE_RANGE_TYPE_KEY;
    const bestTourTypeKey = BEST_TOUR_TYPE_KEY;
    const fromTypeKey = FROM_TYPE_KEY;
    type filterObj = {
        [key: string]: string | any;
        [dayTypeKey]: string,
        [marketTypeKey]: string,
        [destinationTypeKey]: string,
        [priceRangeTypeKey]: any,
        [bestTourTypeKey]: string,
        [fromTypeKey]: string,
    }
    const minPrice = 0;
    const maxPrice = 100000000;
    const sliderStep = 10000;

    const dispatch = useAppDispatch();
    const initUrlParamOfSearch = useInitUrlParamOfSearch();
    const [defaultPriceValue, setDefaultPriceValue] = useState<any[]>([minPrice, maxPrice]);
    const [priceFrom, setPriceFrom] = useState<number>(minPrice);
    const [priceTo, setPriceTo] = useState<number>(maxPrice);
    const convertPathUrlToParams = usePathUrlToSlugOfSearch();

    let pathUrl = `?slug_permalink=${convertPathUrlToParams}`;

    const [filterConditions, setFilterConditions] = useState<filterObj>(
        {
            [dayTypeKey]: '',
            [marketTypeKey]: '',
            [destinationTypeKey]: '',
            [priceRangeTypeKey]: '',
            [bestTourTypeKey]: '',
            [fromTypeKey]: '',
        }
    );

    let dayOptions = useMemo(() => {
        return {
            title: 'Thời lượng',
            type: dayTypeKey,
            items: [
                {
                    label: '4 ngày 3 đêm',
                    value: '4-3'
                },
                {
                    label: '5 ngày 4 đêm',
                    value: '5-4'
                },
                {
                    label: '5 ngày 5 đêm',
                    value: '5-5'
                },
                {
                    label: '6 ngày 5 đêm',
                    value: '6-5'
                },
                {
                    label: '7 ngày 6 đêm',
                    value: '7-6'
                },
                {
                    label: '8 ngày 7 đêm',
                    value: '8-7'
                },
                {
                    label: '9 ngày 8 đêm',
                    value: '9-8'
                },
            ]
        };
    }, [dayTypeKey])

    let marketOptions = useMemo(() => {
        return {
            title: 'Tuyến',
            type: marketTypeKey,
            items: []
        };
    }, [marketTypeKey])

    let destinationOptions = useMemo(() => {
        return {
            title: 'Điểm đến',
            type: destinationTypeKey,
            items: []
        };

    }, [destinationTypeKey])

    let bestTourOptions = useMemo(() => {
        return {
            title: '',
            type: bestTourTypeKey,
            items: [
                {
                    label: 'Tour có lượt bán nhiều nhất',
                    value: 'BEST_SELLER'
                },
                {
                    label: 'Tour có lượt đánh giá tốt nhất',
                    value: 'MOST_COMMENTED'
                }
            ]
        }
    }, [bestTourTypeKey])

    let fromOptions = useMemo(() => {
        return {
            title: 'Khởi hành',
            type: fromTypeKey,
            items: [
                { label: 'Tp.Hồ Chí Minh', value: HCM_CODE },
                { label: 'Hà Nội', value: HN_CODE }
            ]
        }
    }, [fromTypeKey]);

    const initUrlParams = () => {
        return initUrlParamOfSearch;
    };

    const objToUrlParams = (obj: {}) => {
        return toQueryString(obj, false)
    };

    const onPriceChange = (value: number | number[]) => {
        const fromPrice = Array.isArray(value) ? value[0] : value;
        const toPrice = Array.isArray(value) ? value[1] : value;
        setPriceFrom(fromPrice)
        setPriceTo(toPrice)
        setDefaultPriceValue([fromPrice, toPrice]);
    };

    const onPriceChangeComplete = (value: number | number[]) => {
        let urlParamObject = initUrlParams();
        urlParamObject[priceRangeTypeKey] = Array.isArray(value) ? value.join('-') : '';
        filterConditions[priceRangeTypeKey] = Array.isArray(value) ? value.join('-') : '';
        setFilterConditions({ ...filterConditions });
        if (!isMobile) {
            dispatch(setDuringFilter(true));
            dispatch(setUrlWithParam(objToUrlParams(urlParamObject)));
            dispatch(setDefaultPage(1));
        }
    };

    const onbestTourTypeKeyChange = (e: RadioChangeEvent) => {
        let urlParamObject = initUrlParams();
        urlParamObject[bestTourTypeKey] = e.target.value;
        filterConditions[bestTourTypeKey] = e.target.value;
        setFilterConditions({ ...filterConditions });
        if (!isMobile) {
            dispatch(setDuringFilter(true));
            dispatch(setUrlWithParam(objToUrlParams(urlParamObject)));
            dispatch(setDefaultPage(1));
        }
    }

    const onClickFilter = (value: any, type: any) => {
        let urlParamObject = initUrlParams();
        urlParamObject[type] = String(value);
        filterConditions[type] = String(value);
        setFilterConditions({ ...filterConditions });
        if (!isMobile) {
            dispatch(setDuringFilter(true));
            dispatch(setUrlWithParam(objToUrlParams(urlParamObject)));
            dispatch(setDefaultPage(1));
        }
    }

    const resetPriceRangeFilter = () => {
        setPriceFrom(minPrice);
        setPriceTo(maxPrice);
        setDefaultPriceValue([minPrice, maxPrice]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resetFilter = () => {
        let urlParamObject = initUrlParams();
        [
            dayTypeKey,
            marketTypeKey,
            destinationTypeKey,
            priceRangeTypeKey,
            bestTourTypeKey,
            fromTypeKey,
        ].forEach(key => delete urlParamObject[key]);
        resetPriceRangeFilter();
        let filters = { ...filterConditions };
        Object.keys(filters).forEach((key, index) => {
            filters[key] = '';
        });
        setFilterConditions(filters);
        if (!isMobile) {
            dispatch(setDuringFilter(true));
            dispatch(setUrlWithParam(objToUrlParams(urlParamObject)));
            dispatch(setDefaultPage(1));
        }
        // let btnFilters = Array.from(
        //     document.getElementsByClassName('search_filter_item_btn') as HTMLCollectionOf<HTMLElement>
        // )
        // btnFilters.forEach(btn => {
        //     btn.classList.remove('search_filter_item_btn_active');
        // })
    }

    const onMobileApplyFilter = () => {
        let urlParamObject = initUrlParams();
        Object.keys(filterConditions).forEach((key, index) => {
            urlParamObject[key] = filterConditions[key];
        });
        closePopup ? closePopup() : null;
        dispatch(setDuringFilter(true));
        dispatch(setUrlWithParam(objToUrlParams(urlParamObject)));
        dispatch(setDefaultPage(1));
    }

    const apiSearchFilters = useMemo(() => {
        return {
            resetFilter: () => { resetFilter() },
            /**
             * Add new items if you need, For Example
             * showAlert: () => { alert('Show Alert') }
            */
        }
    }, [resetFilter])

    useEffect(() => {
        apiComponent ? apiComponent(apiSearchFilters) : null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        let urlParamObject = initUrlParams() as filterObj;
        let priceRange = urlParamObject[priceRangeTypeKey];
        priceRange = priceRange ? priceRange.split('-') : [minPrice, maxPrice];
        onPriceChange([Number(priceRange[0]), Number(priceRange[1])]);
        urlParamObject[priceRangeTypeKey] = priceRange.join('-');
        setFilterConditions(urlParamObject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceRangeTypeKey]);


    destinationOptions.items = useMemo(() => {
        return optionListData?.destinations?.map((item: any) => {
            return {
                label: item.name,
                value: `/${item.slug}`
            }
        })
    }, [optionListData]);

    marketOptions.items = useMemo(() => {
        return optionListData?.markets?.map((item: any) => {
            return {
                label: capitalizeFirstLetter(item.tour_name),
                value: item.market_id
            }
        })
    }, [optionListData])

    return (
        <section id='search_filters' className='relative'>
            <div className='flex flex-row justify-between items-center py-2 pb-4 max-sm:hidden'>
                <span className='text-sub-1 font-medium px-2 text-bela-secondary-1'>Bộ lọc tìm kiếm </span>
                <button className='text-body-2 transition-all duration-300 text-bela-neutral-3 hover:text-bela-secondary-1'
                    onClick={resetFilter}>
                    Đặt lại
                </button>
            </div>
            {
                slugType === MARKET_TYPE_SLUG &&
                <OptionFilters
                    isAnimation={false}
                    options={marketOptions}
                    filterConditions={filterConditions}
                    onClickFilter={onClickFilter}
                />
            }
            <hr className='border-bela-neutral-5 mt-1 mx-4 md:hidden' />
            <OptionFilters
                isAnimation={false}
                options={fromOptions}
                filterConditions={filterConditions}
                onClickFilter={onClickFilter}
            />
            <hr className='border-bela-neutral-5 mt-1 mx-4 md:hidden' />
            <div className='search_filter_item'>
                <div className='flex flex-row justify-between items-center pb-4'>
                    <div className='search_filter_item_title'>Phạm vi giá</div>
                    <div className='text-cap-1 text-bela-neutral-3'>1 người</div>
                    {/* <button
                            className='font-medium transition-all duration-300 text-bela-neutral-3 hover:text-bela-secondary-1'
                            onClick={resetPriceRangeFilter}>
                            Đặt lại
                        </button> */}
                </div>
                {/* max-sm:!max-h-max search_filter_item_container */}
                <div className='overflow-hidden max-h-max'>
                    <div className='w-full pb-1'>
                        <Slider
                            className='sgt_input_slider search_filter_item_slider'
                            range
                            step={sliderStep}
                            tooltip={{ open: false }}
                            min={minPrice}
                            max={maxPrice}
                            value={defaultPriceValue}
                            onChange={onPriceChange}
                            onChangeComplete={onPriceChangeComplete}
                        // ariaLabelForHandle={'filter by price range'}
                        />
                    </div>
                    <div className='flex flex-row justify-between items-center text-bela-neutral-3 text-cap-1 pb-2'>
                        <p>{formatPrice(priceFrom.toString())}đ</p>
                        <p>{formatPrice(priceTo.toString())}đ</p>
                    </div>
                </div>

            </div>
            <hr className='border-bela-neutral-5 mt-1 mx-4 md:hidden' />
            {/* <div className='search_filter_item'>
                <div className={`max-h-0 overflow-hidden max-sm:!max-h-max ${!isLoading ? 'search_filter_item_container' : ''}`}>
                    <Radio.Group onChange={onbestTourTypeKeyChange} value={filterConditions[bestTourTypeKey]}>
                        <Space direction="vertical" size={10}>
                            {
                                bestTourOptions.items.map((item: any, index: number) =>
                                    <Radio
                                        key={index}
                                        value={item.value}
                                        className='sgt_ant_radio !text-body-2 !text-bela-secondary-1'>
                                        {item.label}
                                    </Radio>
                                )
                            }
                        </Space>
                    </Radio.Group>
                </div>
            </div>
            <hr className='border-bela-neutral-5 mt-1 mx-4 md:hidden' /> */}
            <OptionFilters
                isAnimation={false}
                options={dayOptions}
                filterConditions={filterConditions}
                onClickFilter={onClickFilter}
            />
            <hr className='border-bela-neutral-5 mt-1 mx-4 md:hidden' />
            {
                slugType !== DESTINATION_SLUG &&
                <OptionFilters
                    isAnimation={false}
                    options={destinationOptions}
                    filterConditions={filterConditions}
                    onClickFilter={onClickFilter}
                />
            }

            {
                isMobile ?
                    <div className='w-full px-4 pb-4 fixed bottom-0 z-10 md:hidden'>
                        <button className='w-full py-3 text-button bg-gradient-to-t from-bela-primary-1 to-bela-primary-2 text-bela-secondary-1 rounded-md'
                            onClick={onMobileApplyFilter}
                        >
                            Áp dụng
                        </button>
                    </div> :
                    null
            }
        </section>
    )
}

export default React.memo(SearchFilters)