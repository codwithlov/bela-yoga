import { Skeleton } from "antd";
type ViewedParam = {
    isShowBtn?: boolean,
    className?: string
}
const ListingItemSkeletonVertical = (props: ViewedParam) => {
    let ishowBtn = props.isShowBtn ?? true;
    return (
        <div className={`${props.className ? props.className : 'col-span-3'} rounded-sgt-10 bg-white overflow-hidden`}>
            <div className='grid grid-cols-12'>
                <Skeleton.Node rootClassName="col-span-12 !h-auto" className="!h-auto !w-full overflow-hidden" active={true}>
                    <div className='flex-1 flex flex-col justify-between gap-0 rounded-[0.625rem] relative'>
                        <div className='aspect-16/9 md:aspect-3/2 w-full rounded-[0.625rem] overflow-hidden'>
                            <div className='relative w-full h-full'>
                                <div className='w-full h-full object-cover'></div>
                            </div>
                        </div>
                        <div className='search_result_item_detail w-full flex-1 flex flex-col justify-between gap-4 pt-3 pb-5 px-2.5'>
                            <div className='flex flex-col gap-0.5'>
                                <div className='text-cap-1 pb-1'>&nbsp;</div>
                                <span className='text-sub-1 line-clamp-2'>&nbsp;</span>
                                <span className='text-cap-1 font-medium'>&nbsp;</span>

                            </div>
                            <div className='flex flex-row justify-between items-end'>
                                <div className='flex flex-col gap-0.5'>
                                    <div className='flex flex-row justify-start place-items-end gap-1.5 pb-0.5'>
                                        <p className='text-cap-1'>&nbsp;</p>
                                    </div>
                                    <div className='flex flex-row justify-start items-center gap-1.5'>
                                        <p className='text-cap-1'>&nbsp;</p>
                                    </div>
                                    <div className='flex flex-row justify-start items-center gap-1.5'>
                                        <p className='text-cap-1'>&nbsp;</p>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-end items-end'>
                                    <div className='flex flex-row justify-start items-center gap-0.5 text-xs font-normal'>
                                        &nbsp;
                                    </div>
                                    <div className='flex flex-row justify-start items-center gap-0.5 text-sub-1'>
                                        &nbsp;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Skeleton.Node>
            </div>
        </div>
    );
}

export default ListingItemSkeletonVertical;
