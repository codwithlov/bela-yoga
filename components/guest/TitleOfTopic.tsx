import { HOT_ICON_TITLE, PLANE_ICON_TITLE, } from '@/constants/ui'
import Image from 'next/image'
import React from 'react'
import FlashSaleTimer from './FlashSaleTimer'

type TitleOfTopicParams = {
    title: string,
    loadMore?: string
    link?: string,
    other?: any  // You can only use either the link or the other.
    iconTitle?: string,
    iconSize?: number,
    className?: string
    isShowTimer?: boolean,
    startDate?: string,
    endDate?: string,
}
const TitleOfTopic: React.FC<TitleOfTopicParams> = ({
    title, link,
    loadMore = 'Tất cả',
    other,
    iconTitle,
    iconSize = 24,
    className,
    isShowTimer = false,
    startDate,
    endDate
}) => {
    let icon = '';
    switch (iconTitle) {
        case HOT_ICON_TITLE:
            icon = 'emoji-fire.svg'
            break;
        case PLANE_ICON_TITLE:
            icon = 'emoji-airplane.svg'
            break;
        default:
            icon = '';
            break;
    }
    return (
        <>
            <div className={`flex flex-row justify-between items-center pl-4 pr-2 xl:px-0 relative ${className}`}>
                <div>
                    <h2 className="flex flex-row justify-start items-start gap-2 text-sgt-secondary-1 font-bold max-sm:text-lg sm:text-xl md:text-h3">
                        {title}
                        {
                            iconTitle &&
                            <Image
                                src={`/assets/icons/${icon}`}
                                alt="long-arrow-left"
                                width={0}
                                height={0}
                                sizes='100vw'
                                style={{ width: `${iconSize / 16}rem`, height: "auto" }}
                            />
                        }
                        {
                            isShowTimer &&
                            <FlashSaleTimer
                                startDate={startDate || ''}
                                endDate={endDate || ''}
                            />
                        }
                    </h2>
                </div>
                {
                    link ? <>
                        <a href={`/search`} className="flex flex-row justify-center items-center gap-1 rt_load_more max-sm:!hidden hover:shadow-sgt-primary">
                            <span>{loadMore}</span>
                            <Image
                                src="/assets/icons/long-arrow-right.svg"
                                alt="long-arrow-left"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a href={`/search`} className="hidden max-sm:flex flex-row justify-center items-center gap-1 text-sgt-secondary-dark font-bold">
                            <span>{loadMore}</span>
                            <Image
                                src="/assets/icons/long-arrow-right.svg"
                                alt="long-arrow-left"
                                width={24}
                                height={24}
                            />
                        </a>
                    </> : null
                }
                {
                    other ? <>{other}</> : null
                }
            </div>

        </>
    )
}

export default TitleOfTopic