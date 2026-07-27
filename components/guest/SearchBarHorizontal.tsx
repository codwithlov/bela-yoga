import React from 'react'
import '@/styles/components/date-picker-calendar-custom.scss';
import "@/styles/components/search-bar.scss";
import SearchBarInputLocation from './SearchBarInputLocation';
import SearchBarDate from './SearchBarDate';
import SearchBarButton from './SearchBarButton';
import { INationSummary } from '@/interfaces/nation';
import { IDestinationBase } from '@/interfaces/destination';
import { IMarketSummary } from '@/interfaces/market';
import { Tag } from '@/interfaces/tag';

type SearchBarHorizontalParams = {
    title?: string,
    nationList: INationSummary[],
    destinationList: IDestinationBase[],
    marketList: IMarketSummary[],
    tagList: Tag[],
    slug?: string | null,
}
const SearchBarHorizontal = async (props: SearchBarHorizontalParams) => {
    const { title, destinationList, nationList, marketList, tagList, slug } = props;
    return (
        <section className='px-4 xl:px-0 bg-gradient-to-t from-bela-primary-1 to-bela-primary-2 h-20 flex justify-center items-center'>
            <div className='width-primary m-auto text-sm font-bold'>
                <div className='w-full grid grid-cols-12 gap-3'>
                    <div className='relative col-span-6 h-12  bg-white rounded-md  flex items-center'>
                        <SearchBarInputLocation
                            title={title}
                            inputClass='!font-medium !text-base !p-3 !pl-12 !text-bela-neutral-4 placeholder:!text-bela-neutral-4'
                            iconClass='bg-bela-primary-1'
                            nationList={nationList}
                            destinationList={destinationList}
                            marketList={marketList}
                            tagList={tagList}
                        />
                    </div>
                    <div className='relative col-span-4 h-12 bg-white rounded-md flex justify-center items-center'>
                        <SearchBarDate
                            inputClass='!font-medium !text-base !p-3 !pl-12 !text-bela-neutral-4'
                            iconClass='bg-bela-primary-1'
                        />
                    </div>
                    <div className='col-span-2'>
                        <SearchBarButton
                            btnClass='bg-white p-3 rounded-md text-button text-bela-neutral-1 flex flex-row justify-center items-center cursor-pointer'
                            iconClass='font-thin text-xs'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
export default SearchBarHorizontal