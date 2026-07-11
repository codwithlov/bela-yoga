'use client';
import { HORIZONTAL_VIEW, VERTICAL_VIEW } from '@/constants/ui'
import useScroll from '@/hooks/useScroll';
import useWindowSize from '@/hooks/useWindowSize';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDefaultPage, setDuringFilter, setSearchResultLoadMore, setUrlWithParam, setViewType } from '@/store/searchSlice';
import { Drawer, Dropdown, MenuProps, Radio, RadioChangeEvent, Space } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import SearchFilters from './SearchFilters';
import useInitUrlParamOfSearch from '../hooks/useInitUrlParamOfSearch';
import { toQueryString } from '@/utils/apiUtils';
import { SORT_BY_TYPE_KEY } from '../constants/searchParams';
import PopupHeaderMobile from '@/components/general/molecules/PopupHeaderMobile';

type SearchViewByParam = {
    tourNumber?: number | undefined,
    tourName?: string | undefined,
    slugType: string,
    optionListData: any,
}

type SearchViewByButtonParam = {
    btnType: string,
    btnIcon: string,
    btnText: string,
    className: string,
    onClick: (e: any) => any,
}

export const SearchViewByMobileButton: React.FC<SearchViewByButtonParam> = (({ btnIcon, btnText, className, onClick }) => {
    return <button
        className={`search_view_by_button flex-1 flex flex-row justify-center items-center gap-2.5 bg-sgt-neutral-5 py-3 rounded-md transition-all duration-300 ${className}`}
        onClick={onClick}
    >
        <div className='bg-sgt-secondary-1'
            style={{
                mask: `url("/assets/icons/${btnIcon}")`,
                maskSize: 'cover',
                width: "1.25rem",
                height: "1.25rem",
            }}
        ></div>
        <p className='text-body-1 text-sgt-secondary-1'>{btnText}</p>
    </button>
});

const SearchViewBy = (props: SearchViewByParam) => {

    /** Variables */
    const filterType = 'FILTER';
    const arrangeType = 'ARRANGE';
    const filterText = 'Bộ lọc tìm kiếm';
    const arrangeText = 'Sắp xếp';
    const sortByTypeKey = SORT_BY_TYPE_KEY;
    /** Hook */

    const dispatch = useAppDispatch();
    const initUrlParams = useInitUrlParamOfSearch();
    const windowSize = useWindowSize();
    const search = useAppSelector((state) => state.search);
    const [openFilters, setOpenFilters] = useState<boolean>(false);
    const [openArrange, setOpenArrange] = useState<boolean>(false);
    const [arrangeSelected, setArrangeSelected] = useState<{ label: string, key: string }>({
        label: 'Tất cả',
        key: '',
    });
    const [type, setType] = useState<string>(filterType);
    const searchViewBy = useRef<HTMLDivElement>(null);

    /** Use functions of components like API */
    const [apiSearchFilters, setApiSearchFilters] = useState<any>();

    const arrangeItems: MenuProps['items'] = useMemo(() => [
        {
            label: 'Tất cả',
            key: '',
        },
        {
            label: 'Thời gian ngắn nhất',
            key: 'day_number:asc,night_number:asc',
        },
        {
            label: 'Tour sớm nhất',
            key: 'flight_date:asc',
        },
        {
            label: 'Giá rẻ nhất',
            key: 'price_adl_off:asc,price_adl:asc',
        },
    ], []);


    const objToUrlParams = (obj: {}) => {
        return toQueryString(obj, false);
    };

    const handleArrangeMenuClick: MenuProps['onClick'] = (e) => {
        let urlParamObject = initUrlParams;
        let itemSelected = arrangeItems?.filter((item: any) => item.key == e.key) || [];
        if (itemSelected[0]) {
            setArrangeSelected({ ...itemSelected[0] as any });
            urlParamObject[sortByTypeKey] = itemSelected[0].key as string;
            dispatch(setUrlWithParam(objToUrlParams(urlParamObject)));
            dispatch(setDefaultPage(1));
            setOpenArrange(false);
        }
        dispatch(setSearchResultLoadMore(false));
    };

    const menuProps = {
        items: arrangeItems,
        selectable: true,
        onClick: handleArrangeMenuClick,
    };

    const changeView = (view: string) => {
        dispatch(setViewType(view));
    }

    const onChangeType = (type: string) => {
        if (type == filterType) {
            setOpenFilters(true)
        } else {
            setOpenArrange(true)
        }
        setType(type);
    }

    const onMobileArrangeBy = (e: RadioChangeEvent) => {
        let item = {
            key: e.target.value
        }
        handleArrangeMenuClick(item as any);
    }

    useEffect(() => {
        let nav = document.getElementById('nav') as HTMLElement;
        if (nav) {
            const resizeObserver = new ResizeObserver(() => {
                let navHeight = document.getElementById('nav')?.offsetHeight as number;
                let adminNavHeight = document.getElementById('admin-navbar')?.offsetHeight as number;
                let mobileNavHeight = document.getElementById('mobile_nav')?.offsetHeight as number;
                let searchViewBy = document.getElementById('search_view_by') as HTMLElement;
                if (searchViewBy) {
                    if (Number(window.innerWidth) > 640) {
                        searchViewBy.style.top = `${navHeight + (adminNavHeight || 0)}px`;
                    } else {
                        searchViewBy.style.top = `${mobileNavHeight}px`;
                    }
                }
            });
            resizeObserver.observe(nav);
            return () => resizeObserver.disconnect();
        }
    }, []);

    const SearchViewByDesktop = (
        <div className='bg-gradient-to-t from-sgt-primary-1 to-sgt-primary-2 rounded-md hidden md:flex justify-between items-center py-3.5 px-8 mx-2'>
            <div className='text-lg font-semibold text-sgt-secondary-1'>Có {props.tourNumber || 0} tour du lịch {props.tourName}</div>
            <div className='flex flex-row justify-center items-center gap-2'>
                <div className='text-button text-sgt-secondary-1'>Sắp xếp theo</div>
                <Dropdown
                    menu={menuProps}
                    className='w-48'
                    overlayClassName='search_view_by_dropdown'
                    openClassName='search_view_by_dropdown_opened'
                >
                    <div className='flex flex-row justify-between items-center rounded-md bg-sgt-neutral-6 py-1.5 px-3 cursor-pointer'>
                        <div className='text-body-2 text-sgt-secondary-1'>{arrangeSelected.label}</div>
                        <div className='bg-sgt-secondary-1 dropdown_icon'
                            style={{
                                mask: 'url("/assets/icons/chevron-down.svg")',
                                maskSize: 'cover',
                                width: "1.125rem",
                                height: "1.125rem",
                            }}
                        >
                        </div>
                    </div>
                </Dropdown>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
                <div className='text-button text-sgt-secondary-1'>Xem theo</div>
                <div className=' flex flex-row bg-sgt-neutral-7 rounded-md'>
                    <button
                        aria-label='horizontal view'
                        onClick={() => changeView(HORIZONTAL_VIEW)}
                        className={`search_result_btn_view_by ${search.viewType == HORIZONTAL_VIEW ? 'active' : ''}`}
                    >
                        <div className='view_by_icon'
                            style={{
                                mask: 'url("/assets/icons/sgt-list-ul.svg")',
                                maskSize: 'contain',
                                width: "1.25rem",
                                height: "1.25rem",
                            }}
                        >
                        </div>
                    </button>
                    <div className="h-5 my-1 bg-sgt-primary-1 " style={{ width: '1px' }}></div>
                    <button
                        aria-label='vertical view'
                        onClick={() => changeView(VERTICAL_VIEW)}
                        className={`search_result_btn_view_by ${search.viewType == VERTICAL_VIEW ? 'active' : ''}`}
                    >
                        <div className='view_by_icon'
                            style={{
                                mask: 'url("/assets/icons/sgt-grip.svg") no-repeat',
                                maskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                width: "1.25rem",
                                height: "0.875rem",
                            }}
                        >
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )

    const SearchViewByMobile = (
        <div id='search_view_by_mobile' className='hidden max-sm:block pb-4 mx-4'>
            <div className='bg-sgt-neutral-7 shadow-sgt-black-1 flex flex-row p-1 rounded-md gap-1'>
                <SearchViewByMobileButton
                    btnIcon='filters.svg'
                    btnText='Bộ lọc'
                    btnType={filterType}
                    onClick={() => onChangeType(filterType)}
                    className={`${type == filterType ? 'bg-sgt-primary-2' : ''}`}
                />
                <SearchViewByMobileButton
                    btnIcon='arrange.svg'
                    btnText='Sắp xếp'
                    btnType={arrangeType}
                    onClick={() => onChangeType(arrangeType)}
                    className={`${type == arrangeType ? 'bg-sgt-primary-2' : ''}`}
                />
            </div>
            <div className='text-lg font-bold text-sgt-secondary-1 pt-4'>
                Có <span className='text-sgt-third-2'>{props.tourNumber} </span>tour du lịch {props.tourName}
            </div>
        </div>
    )

    return (
        <section ref={searchViewBy} id='search_view_by' className="pb-10 pt-2.5 max-sm:pb-0 sticky z-50 bg-sgt-bg-primary -mx-2 max-sm:-mx-4">
            {SearchViewByDesktop}
            {SearchViewByMobile}
            <Drawer
                title=""
                open={openFilters}
                width={"100%"}
                height={"90%"}
                zIndex={9999}
                footer={null}
                closeIcon={null}
                className="sgt_drawer sgt_drawer_search_filter_mobile"
                placement='bottom'
                destroyOnHidden
                onClose={() => setOpenFilters(false)}
            >
                <PopupHeaderMobile
                    title={filterText}
                    close={() => setOpenFilters(false)}
                    reset={() => apiSearchFilters.resetFilter()}
                />
                <SearchFilters
                    isMobile={true}
                    apiComponent={(api) => setApiSearchFilters(api)}
                    closePopup={() => setOpenFilters(false)}
                    slugType={props.slugType}
                    optionListData={props.optionListData}
                />
                <div className='h-20' />
                {/* <SearchSideBar isMobile={true} setCloseOtherOptions={() => setOpenFilters(false)} /> */}
            </Drawer >
            <Drawer
                title=""
                open={openArrange}
                width={"100%"}
                height={"auto"}
                zIndex={9999}
                footer={null}
                closeIcon={null}
                className="sgt_drawer sgt_drawer_search_arrange_mobile"
                placement='bottom'
                destroyOnHidden
                onClose={() => setOpenArrange(false)}
            >
                <PopupHeaderMobile
                    title={arrangeText}
                    close={() => setOpenArrange(false)}
                />
                <div className='mx-4'>
                    <hr className='border border-sgt-neutral-5 -mt-1' />
                    <div className='search_view_by_arrange pt-6 pb-16'>
                        <Radio.Group onChange={onMobileArrangeBy} value={arrangeSelected.key}>
                            <Space direction="vertical" size={20}>
                                {
                                    arrangeItems.map((item: any, index: number) =>
                                        <Radio
                                            key={index}
                                            value={item.key}
                                            className='sgt_ant_radio !text-sub-1 !font-normal !text-sgt-secondary-1'>
                                            {item.label}
                                        </Radio>
                                    )
                                }
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
            </Drawer>
        </section>
    )
}

export default SearchViewBy 