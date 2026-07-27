
'use client'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Drawer, Skeleton } from 'antd';
import SearchBarVerticalMobile from '@/components/guest/SearchBarVerticalMobile';
import { setViewType } from '@/store/searchSlice';
import { useSearchParams } from 'next/navigation';
import { INationSummary } from '@/interfaces/nation';
import PopupHeaderMobile from '@/components/general/molecules/PopupHeaderMobile';
import { IMarketSummary } from '@/interfaces/market';
import { IDestinationBase } from '@/interfaces/destination';
import { Tag } from '@/interfaces/tag';
type SearchHeaderMobileParam = {
    title?: string;
    nationList: INationSummary[];
    destinationList: IDestinationBase[];
    marketList: IMarketSummary[];
    tagList: Tag[];
    slug?: string;
};

const SearchHeaderMobile = (props: SearchHeaderMobileParam) => {

    /** Params */
    const { title, nationList, destinationList, marketList, tagList, slug } = props;

    /** Use Hook */
    const search = useAppSelector((state) => state.search);
    const [openSearchBar, setOpenSearchBar] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [searchBarVerticalMobileAPI, setSearchBarVerticalMobileAPI] = useState<any>();

    const findNewTourText = 'Tìm tour mới';

    /** Functional */
    const changeView = (view: string) => {
        dispatch(setViewType(view));
    }

    return (
        <section id='search_header_mobile'>
            <div className='w-full bg-bela-primary-2 px-4'>
                <div className='h-16 flex flex-row gap-4 justify-between items-center py-1'>
                    <div className='w-8' />
                    {/* <button onClick={router.back}>
                        <div className='bg-bela-neutral-1 rotate-180'
                            style={{
                                mask: 'url("/assets/icons/long-arrow-right.svg")',
                                maskSize: 'cover',
                                width: "1.5rem",
                                height: "1.5rem",
                            }}
                        >
                        </div>
                    </button> */}
                    <div className='flex flex-col justify-between items-center'>
                        {
                            search.searchTitle || search.flightDateParam
                                ? <>
                                    <div className='text-sub-1 font-bold text-bela-secondary-1 line-clamp-1'>{title ? title : search.searchTitle ?? "Tour du lịch"}</div>
                                    <div className='text-body-2 text-bela-secondary-1'>{search.flightDateParam}</div>
                                </>
                                : <div className='text-center'>
                                    <Skeleton
                                        className='search_narbar_mobile_title'
                                        title={false}
                                        paragraph={{
                                            rows: 2,
                                            width: [200, 100]
                                        }}
                                        active
                                    />
                                </div>
                        }
                    </div>
                    <button className='text-base font-bold' onClick={() => setOpenSearchBar(!openSearchBar)}>
                        <div className='bg-bela-neutral-1'
                            style={{
                                mask: 'url("/assets/icons/search.svg")',
                                maskSize: 'cover',
                                width: "1.5rem",
                                height: "1.5rem",
                            }}
                        >
                        </div>
                    </button>
                </div>
            </div>
            <Drawer
                title=""
                zIndex={1000}
                rootStyle={{
                    top: "0rem",
                }}
                open={openSearchBar}
                width={"100%"}
                height={"240px"}
                footer={null}
                closeIcon={null}
                className="sgt_drawer sgt_drawer_search_header_mobile"
                placement='top'
                destroyOnHidden
                onClose={() => setOpenSearchBar(false)}
            >
                <div className='w-full fex flex-row bg-opacity-0 relative'>
                    <div className='w-full grid grid-cols-12 absolute px-0'>
                        <div className='col-span-12 bg-white'>
                            <div className='pt-1.5'>
                                <PopupHeaderMobile
                                    title={findNewTourText}
                                    close={() => setOpenSearchBar(false)}
                                    reset={() => searchBarVerticalMobileAPI.resetParams()}
                                />
                            </div>
                            <SearchBarVerticalMobile
                                apiComponent={(api) => setSearchBarVerticalMobileAPI(api)}
                                itemGap='gap-3'
                                borderColorInput='border-bela-primary-1'
                                bgInput='bg-bela-neutral-7'
                                location={title || ''}
                                date={search.flightDateParam || ''}
                                nationList={nationList}
                                destinationList={destinationList}
                                marketList={marketList}
                                tagList={tagList}
                            />
                        </div>
                    </div>
                </div>
            </Drawer>
        </ section>
    )
}
export default SearchHeaderMobile