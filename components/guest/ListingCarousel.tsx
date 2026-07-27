'use client'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@/styles/components/slick-carousel.scss';
// import '@/styles/components/skeleton-mobile.scss';
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IListingSummary } from "@/interfaces/listing";
import ListingItemVertical from "@/components/guest/ListingItemVertical";
import SlickCarouselArrows from "./SlickCarouselArrows";
import ListingItemSkeletonVertical from "@/components/guest/ListingItemSkeletonVertical";
import { ITopicSummary } from "@/interfaces/topic";
import Image from "next/image";
import ListingItemVerticalOption2 from "./ListingItemVerticalOption2";
import TitleOfTopic from "./TitleOfTopic";
import useWindowSize from "@/hooks/useWindowSize";
import { GUEST_STORE } from "@/constants/route";

import dynamic from 'next/dynamic';

/** Import Lazy CSS */

// const SlickCarouselCss = dynamic(() => import('@/components/non-critical/SlickCarouselCss'), { ssr: true });
const SkeletonCss = dynamic(() => import('@/components/non-critical/SkeletonCss'), { ssr: false });

/** End */

interface FecthDataProp {
    isShowTitle?: boolean,
    tourList: any,
    topic: ITopicSummary
    showAllBtn?: boolean,
    uiOption?: number
    slidesToShow?: number,
    isShowTimerInCard?: boolean,
}

const ListingCarousel: React.FC<FecthDataProp> = React.memo(({
    topic,
    tourList,
    showAllBtn = true,
    uiOption = 1,
    slidesToShow = 4,
    isShowTitle = true,
    isShowTimerInCard = false,
}) => {
    const tours: IListingSummary[] = useMemo(() => tourList, [tourList]);
    let sliderRef = useRef<Slider | null>(null);
    const [slidesToShowDefault, setSlidesToShowDefault] = useState<number>(slidesToShow);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [isClient, setIsClient] = useState(false);
    const keyByTime = useId();
    const windowSize = useWindowSize();
    let totalTour = tours?.length as number;
    const skeletonTourData: number[] = useMemo(() => Array.from(Array(slidesToShow).keys()), [slidesToShow]);
    const skeletonCol = 12 / slidesToShow;
    const slidesToScroll = 1;
    const defaultTopicSlug = GUEST_STORE.replace('/', '');
    const topicSlug = topic.slug ?? defaultTopicSlug;
    let topicIdAttr = topicSlug;
    if (topicIdAttr == defaultTopicSlug) {
        topicIdAttr = defaultTopicSlug + '_' + topic.topic_id;
    }
    topicIdAttr = topicIdAttr.replaceAll('/', '_')
    useEffect(() => {
        if (windowSize?.width as number < 640) {
            setSlidesToShowDefault(1.25);
        } else if (windowSize?.width as number < 768) {
            setSlidesToShowDefault(2.50);
        } else if (windowSize?.width as number < 1024) {
            setSlidesToShowDefault(3.25);
        } else {
            setSlidesToShowDefault(slidesToShow);
        }
    }, [windowSize.width, slidesToShowDefault])

    const next = () => {
        let current = (currentSlide + slidesToScroll) % totalTour;
        sliderRef.current?.slickGoTo(current)
    };

    const previous = () => {
        let current = (currentSlide - slidesToScroll + totalTour) % totalTour;
        sliderRef.current?.slickGoTo(current)
    };

    const onReInit = useCallback(() => {
        let elementExists = document.getElementById(`${topicIdAttr}`);
        if (elementExists) {
            let slickSlideList = elementExists.querySelectorAll(`.slick-track .slick-slide`);
            for (let i = 0; i < slickSlideList.length; i++) {
                slickSlideList[i].removeAttribute('aria-hidden');
            };
        }
    }, [topicIdAttr])

    const onInit = useCallback(() => {

        let elementExists = document.getElementById(`${topicIdAttr}`);
        if (elementExists) {
            let slickSlideList = elementExists.querySelectorAll(`.slick-track .slick-slide`);
            let isInteger = slidesToShowDefault % 1 === 0;
            if (!isInteger) {
                for (let i = 0; i < slickSlideList.length; i++) {
                    slickSlideList[i].removeAttribute('aria-hidden');
                };
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicIdAttr,])

    const beforeChange = useCallback(() => {
        let elementExists = document.getElementById(`${topicIdAttr}`);
        if (elementExists) {
            let slickSlideList = elementExists.querySelectorAll(`.slick-track .slick-slide`);
            let isInteger = slidesToShowDefault % 1 === 0;
            if (!isInteger) {
                for (let i = 0; i < slickSlideList.length; i++) {
                    slickSlideList[i].removeAttribute('aria-hidden');
                };
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicIdAttr])

    const afterChange = useCallback((index: number) => {
        setCurrentSlide(index);
        let hiddenClass = ['!opacity-0', 'pointer-events-none'];
        if (typeof window !== undefined) {
            const slickBtnPrevious = document.querySelector(`#${topicIdAttr}_previous`);
            const slickBtnNext = document.querySelector(`#${topicIdAttr}_next`);
            if (index <= 0) {
                slickBtnPrevious?.classList.add(...hiddenClass);
            } else {
                if (slickBtnPrevious?.classList.contains('!opacity-0')) {
                    slickBtnPrevious?.classList.remove(...hiddenClass);
                };
            }
            if (index == (totalTour - Math.round(slidesToShowDefault))) {
                slickBtnNext?.classList.add(...hiddenClass);
            } else {
                if (slickBtnNext?.classList.contains('!opacity-0')) {
                    slickBtnNext?.classList.remove(...hiddenClass);
                };
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicIdAttr])

    let settings = useMemo(() => {
        return {
            infinite: false,
            dots: false,
            arrows: false,
            speed: 300,
            slidesToShow: slidesToShowDefault,
            slidesToScroll: slidesToScroll,
            swipe: false,
            onInit: onInit,
            onReInit: onReInit,
            afterChange: afterChange,
            beforeChange: beforeChange,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        speed: 300,
                        slidesToShow: slidesToShowDefault,
                        slidesToScroll: slidesToScroll,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        swipe: true,
                        speed: 300,
                        slidesToShow: slidesToShowDefault,
                        slidesToScroll: slidesToScroll,
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        swipe: true,
                        speed: 300,
                        slidesToShow: slidesToShowDefault,
                        slidesToScroll: slidesToScroll,
                    }
                }
            ],
        };

    }, [
        slidesToShowDefault,
        slidesToScroll,
        onInit,
        onReInit,
        afterChange,
        beforeChange
    ])

    const BtnLink = () => {
        return showAllBtn && topicSlug ?
            <>
                <a href={`/${topicSlug}`} className="rt_load_more max-sm:!hidden hover:shadow-bela-primary">Tất cả&nbsp;
                    <Image
                        src="/assets/icons/long-arrow-right.svg"
                        alt="long-arrow-left"
                        width={24}
                        height={24}
                    />
                </a>
            </>
            : null
    }
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            {isClient && <SkeletonCss />}
            <div id={`${topicIdAttr}`} className={`slick-tour-carousel`}>
                {
                    isShowTitle && totalTour > 0 ?
                        <TitleOfTopic
                            title={topic.name}
                            iconTitle={topic.iconTitle}
                            iconSize={topic.iconSize}
                            isShowTimer={topic.isShowTimer}
                            startDate={topic.start_date}
                            endDate={topic.end_date}
                            other={<BtnLink />}
                        /> :
                        null
                }
                <div className="pt-5">
                    {
                        !tours ?
                            <>
                                <div className='skeleton_mobile'>
                                    {
                                        skeletonTourData.map((sk, index) =>
                                            <ListingItemSkeletonVertical
                                                key={index}
                                                isShowBtn={false}
                                                className="skeleton_mobile_item">
                                            </ListingItemSkeletonVertical>
                                        )
                                    }
                                </div>
                                <div className='hidden lg:grid grid-cols-12 gap-4 pb-4'>
                                    {
                                        skeletonTourData.map((sk, index) =>
                                            <ListingItemSkeletonVertical
                                                key={index}
                                                isShowBtn={false}
                                                className={`col-span-${skeletonCol}`}>
                                            </ListingItemSkeletonVertical>
                                        )
                                    }
                                </div>
                            </> :
                            tours?.length > 0 ?
                                <div className="slick_carousel relative lg:max-xl:mx-4">
                                    <Slider
                                        key={keyByTime}
                                        initialSlide={currentSlide}
                                        {...settings}
                                        ref={sliderRef}
                                        className="rt-carousel-block w-full"
                                    >
                                        {
                                            tours?.map((tour, index) =>
                                                tour.tour_id > 0 ?
                                                    <ListingItemVertical
                                                        key={index}
                                                        index={index}
                                                        item={tour}
                                                        isTour={true}
                                                        isAnimation={true}
                                                        isShowDiscount={true}
                                                        isShowTimer={isShowTimerInCard}
                                                    />
                                                    :
                                                    uiOption == 1 ?
                                                        <ListingItemVertical
                                                            index={index}
                                                            key={index}
                                                            item={tour}
                                                            isShowDiscount={true}
                                                            isShowTimer={isShowTimerInCard}
                                                        /> :
                                                        <ListingItemVerticalOption2
                                                            index={index}
                                                            key={index}
                                                            item={tour}
                                                            isShowBtn={false}
                                                        />

                                            )
                                        }
                                    </Slider>
                                    {
                                        tours && tours?.length > slidesToShowDefault + 1 ?
                                            <SlickCarouselArrows
                                                btnId={topicIdAttr}
                                                className="flex max-lg:hidden"
                                                slickNext={next}
                                                slickPrevious={previous}
                                                slickPrevBtnHidden={true}
                                                slickPreviousClass='!-left-3.5 !shadow-lg !bg-opacity-65 hover:!bg-opacity-100'
                                                slickNextClass='!-right-3.5 !shadow-lg !bg-opacity-65 hover:!bg-opacity-100'
                                            />
                                            : null
                                    }
                                </div> : null
                    }
                </div>
                <a
                    href={`/${topicSlug}`}
                    aria-label="Show all"
                    className="rt_load_more max-w-max my-0 !px-14 mx-auto !hidden max-sm:!flex flex-row justify-center gap-1.5 hover:shadow-bela-primary">
                    <span>Tất cả</span>
                    <Image
                        src="/assets/icons/long-arrow-right.svg"
                        alt="long-arrow-left"
                        width={24}
                        height={24}
                    />
                </a>
            </div>
        </>

    );
});
ListingCarousel.displayName = 'ListingCarousel';
export default ListingCarousel;


