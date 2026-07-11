import { Skeleton } from "antd";

type ListingItemSkeletonHorizontalParams = {
    className?: string,
}

const ListingItemSkeletonHorizontal: React.FC<ListingItemSkeletonHorizontalParams> = ({ className }) => {
    return (
        <div className={` ${className ?? 'col-span-12'} search_result_list rounded-sgt-10 bg-white overflow-hidden`}>
            <div className='search_result_item grid grid-cols-12'>
                <Skeleton.Node rootClassName="col-span-12 !h-auto" className="!h-auto !w-full overflow-hidden" active={true}>
                    <div className="flex-1 grid grid-cols-12 gap-4">
                        <div className='aspect-[16/9] col-span-5 rounded-tl-lg rounded-bl-lg overflow-hidden max-sm:aspect-auto'>
                            <div className='relative w-full h-full overflow-hidden'>
                                <div className='w-full h-full object-cover'></div>
                            </div>
                        </div>
                        <div className='col-span-7 flex flex-col justify-between gap-6 pt-3 pb-5 px-2.5 max-sm:pl-0 max-sm:pb-2.5 max-sm:gap-7'>
                            <div className="flex flex-row justify-between items-start">
                                <div className='flex flex-col gap-0.5 overflow-hidden'>
                                    <div className='text-cap-1 pb-1'>&nbsp;</div>
                                    <span className='text-sub-1 pb-0.5'>&nbsp;</span>
                                    <span className='text-cap-1 pb-0.5'>&nbsp;</span>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between items-end'>
                                <div className=' flex flex-col gap-0.5'>
                                    <div className='flex flex-row justify-start place-items-end gap-1.5 pb-0.5 '>
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
                                    <div className='flex flex-row justify-start items-center gap-0.5  text-sm font-normal max-sm:text-xs'>
                                        &nbsp;
                                    </div>
                                    <div className='flex flex-row justify-start items-center gap-0.5 text-xl font-bold max-sm:text-sub-1'>
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
// background: linear-gradient(to right, rgb(247, 249, 250), rgb(242, 243, 243), rgb(247, 249, 250))

export default ListingItemSkeletonHorizontal;