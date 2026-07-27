'use client'
import React, { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AutoComplete, Spin } from "antd";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSearchParams } from "next/navigation";
import { setDynamicSlug, setKeywordParam, setMarketTypeSlug } from "@/store/searchSlice";
import { highlightText, searchInString } from "@/utils/formatString";
import Image from "next/image";
import { GUEST_STORE } from "@/constants/route";
import { INationSummary } from "@/interfaces/nation";
import { IDestinationBase } from "@/interfaces/destination";
import { IMarketSummary } from "@/interfaces/market";
import { isEmpty } from "@/utils/helper";
import { LoadingOutlined } from '@ant-design/icons';
import { useGetDataQuery } from "@/services/api/common";
import { ITagBase } from "@/interfaces/tag";

type SearchBarInputLocationParams = {
    inputClass?: string,
    iconClass?: string,
    title?: string,
    nationList: INationSummary[],
    destinationList: IDestinationBase[],
    marketList: IMarketSummary[],
    tagList: ITagBase[];
}

type DropdownOption = {
    label: any,
    options: any,
    type: any,
}

let typingTimer: any;
const NATION_FILTER = 'nation_filter';
const DESTENATION_FILTER = 'destenation_filter';
const MARKET_FILTER = 'market_filter';
const TAG_FILTER = 'tag_filter';
const SEARCHTIMEOUT = 500;

const SearchBarInputLocation: React.FC<SearchBarInputLocationParams> = ({
    inputClass,
    iconClass,
    title,
    nationList,
    destinationList,
    marketList,
    tagList,
}) => {
    const search = useAppSelector((state) => state.search);
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const keyword = searchParams?.get('keyword');
    const inputPlaceholderRef = useRef<HTMLInputElement>(null);

    const [valueSelect, setValueSelect] = useState<string | null>(title ? title : keyword ?? null);
    const [optNationList, setOptNationList] = useState(nationList || []);
    const [optDestinationList, setOptDestinationList] = useState(destinationList || []);
    const [optMarketList, setOptMarketList] = useState(marketList || []);
    const [optTagList, setOptTagList] = useState(tagList || []);
    const [open, setOpen] = useState<boolean>(false);

    const { data: dataResearch, isFetching } = useGetDataQuery(
        `others/option-list?keyword=${search.keyword}`,
        {
            skip: isEmpty(search.keyword),
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        if (nationList) {
            dispatch(setMarketTypeSlug(nationList[0]?.market_type_slug ?? GUEST_STORE.replace('/', '')));
        }
    }, [dispatch, nationList])

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

    const setPathSearchPage = useCallback((
        filterSearchParam: any = null
    ) => {
        dispatch(setDynamicSlug(filterSearchParam));
    }, [dispatch])

    const handleOnChange = (value: string) => {
        setValueSelect(value);
    }

    const handleOnSearch = (value: string) => {
        if (isEmpty(value)) {
            setOptNationList((nationList || []).filter(i => searchInString(value, i.nation_name)));
            setOptDestinationList((destinationList || []).filter((i: any) => searchInString(value, i.destination_name)));
            setOptMarketList((marketList || []).filter((i: any) => searchInString(value, i.tour_name)));
            setOptTagList(tagList || []);
        }
        setPathSearchPage(null);
        dispatch(setKeywordParam(value));
    }

    const handleOnClickItem = useCallback((e: any, value: string, label: string) => {
        e.stopPropagation();
        const param = `${value}`;
        setValueSelect(label);
        setPathSearchPage(param);
        setOpen(false);

    }, [setPathSearchPage])

    const HandleOnKeyUP = (value: any) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            handleOnSearch(value)
        }, SEARCHTIMEOUT);
    }

    const renderTitle = (title: string, className?: string) => (
        <span className={`text-base font-medium text-bela-secondary-1 ${className}`}>
            {title}
        </span>
    );
    const renderItemClassName = "flex flex-row justify-between items-center py-1.5 px-3 pl-6 cursor-pointer rounded-md ";
    const renderItemClassNameHover = "hover:bg-bela-neutral-6";
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
                id={NATION_FILTER}
                onClick={(e) => handleOnClickItem(e, slug, title)}
                data-slug={(title)}
                className={`${renderItemClassName} ${renderItemClassNameHover}`}
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
                className={`${renderItemClassName} ${renderItemClassNameHover}`}
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
                className={`${renderItemClassName} ${renderItemClassNameHover}`}
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
                className="flex flex-wrap justify-between items-center"
            >
                <div
                    className="px-3 py-1 rounded-2xl border cursor-pointer border-bela-secondary-1 hover:bg-bela-neutral-6"
                    data-slug={value}
                    dangerouslySetInnerHTML={{ __html: highlightLabel ?? '' }}>
                </div>
            </div>

        ),
    }), [handleOnClickItem]);


    /** Using */

    let options: DropdownOption[] = [
        {
            label: renderTitle('Khu vực nổi bật'),
            options: [],
            type: NATION_FILTER,
        },
        {
            label: renderTitle('Cụm sân phổ biến'),
            options: [],
            type: DESTENATION_FILTER,
        },
        {
            label: renderTitle('Sân đang được quan tâm'),
            options: [],
            type: MARKET_FILTER,
        },
        {
            label: renderTitle('Chủ đề'),
            options: [],
            type: TAG_FILTER
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

    // if (isFetching) {
    //     options = [
    //         {
    //             label:
    //                 <div className="flex justify-center items-center py-3">
    //                     <Spin indicator={
    //                         <LoadingOutlined
    //                             className="!text-bela-primary-1"
    //                             style={{ fontSize: 32 }} spin
    //                         />
    //                     }
    //                     />
    //                 </div>,
    //             options: [],
    //         },
    //     ]
    // }

    useEffect(() => {
        if (optNationList.length === 0 && optDestinationList.length === 0 && optMarketList.length === 0) {
            setPathSearchPage(null);
        }
    }, [optNationList, optDestinationList, optMarketList, setPathSearchPage]);


    useEffect(() => {
        if (!dataResearch?.data) return;
        const data = dataResearch?.data;
        setOptNationList((data.nationList || []));
        setOptDestinationList((data.destinationList || []));
        setOptMarketList((data.marketList || []));
        setOptTagList((data.tagList || []));
    }, [dataResearch?.data]);

    useEffect(() => {
        window.addEventListener('click', (e: any) => {
            e.stopImmediatePropagation();
            let autoCompleteInput = document.getElementById('search_bar_auto_complete') as HTMLElement;
            let autoCompleteDropdown = document.getElementById('search_bar_auto_complete_dropdown') as HTMLElement;
            if (
                !autoCompleteInput?.contains(e.target)
                && !autoCompleteDropdown?.contains(e.target)
            ) {
                setOpen(false);
            }
        });
    })
    return (
        <>
            <div className={`absolute left-3 ${iconClass}`}
                style={{
                    mask: 'url("/assets/icons/location.svg")',
                    maskSize: 'cover',
                    width: "1.5rem",
                    height: "1.5rem",
                }}
            ></div>
            <AutoComplete
                id="search_bar_auto_complete"
                className='search_bar_auto_complete'
                popupClassName="search_bar_auto_complete_dropdown"
                popupMatchSelectWidth={true}
                options={options.filter((i: any) => i.options.length > 0)}
                value={valueSelect}
                onChange={(value) => handleOnChange(value)}
                onSearch={(value) => HandleOnKeyUP(value)}
                listHeight={380}
                open={open}
                onClick={() => setOpen(true)}
                dropdownRender={(menu) => (
                    <div className="h-[380px] overflow-y-scroll py-3">
                        {
                            options.map((item: DropdownOption, index: number) => {
                                return <Fragment key={index}>
                                    <div className="pl-2">{item.label}</div>
                                    {
                                        item.type === TAG_FILTER ?
                                            <div className="flex flex-wrap gap-2 pl-6 pt-2">
                                                {
                                                    item.options?.map((opt: any, optIndex: number) => {
                                                        return <Fragment key={optIndex}>{opt.label}</Fragment>
                                                    })
                                                }
                                            </div>
                                            :
                                            item.options?.map((opt: any, optIndex: number) => {
                                                return <Fragment key={optIndex}>{opt.label}</Fragment>
                                            })
                                    }
                                </Fragment>
                            })
                        }
                    </div>
                )}
            // allowClear={{
            //     clearIcon: <FontAwesomeIcon className="text-white" size="xl" icon={faClose}></FontAwesomeIcon>
            // }}
            >
                <input ref={inputPlaceholderRef} id="search" type="text" placeholder="Bạn muốn đi đâu?"
                    className={`search_bar_input_auto_complete ${inputClass}`}
                />
            </AutoComplete>
            <div className="flex justify-center items-center absolute right-2">

                {
                    isFetching ? <Spin
                        size="large"
                        className="pr-4"
                        indicator={
                            <LoadingOutlined

                                className="!text-bela-primary-2"
                                style={{
                                    fontSize: 26
                                }}
                                spin
                            />
                        }
                    /> : null
                }
            </div>
        </>
    );
}

export default SearchBarInputLocation;