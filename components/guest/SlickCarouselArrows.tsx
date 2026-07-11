'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


import dynamic from 'next/dynamic';

/** Import Lazy CSS */

const SlickArrowsCss = dynamic(() => import('@/components/non-critical/SlickCarouselArrowsCss'), { ssr: false });

/** End */

const SlickCarouselArrows = (props: any) => {
    const {
        btnId,
        slickPrevious,
        slickNext,
        slickPrevBtnHidden,
        slickNextBtnHidden,
        slickNextClass,
        slickPreviousClass,
        className
    } = props;
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            {isClient && <SlickArrowsCss />}
            <div style={{ textAlign: "center" }} className={`mx-4 ${className}`}>
                <button id={`${btnId}_previous`} aria-label={`${btnId}_previous`} className={`slick-arrow slick-arrow-previous ${slickPreviousClass} ${slickPrevBtnHidden ? '!opacity-0 pointer-events-none' : ''} `}
                    onClick={slickPrevious}>
                    {/* <Image
                    src="/assets/icons/banner-slider-arrow.svg"
                    alt="banner-slider-arrow"
                    sizes='100vw'
                    width={0}
                    height={0}
                    className='w-full h-full'
                /> */}
                    <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                </button>
                <button id={`${btnId}_next`} aria-label={`${btnId}_next`} className={`slick-arrow slick-arrow-next ${slickNextClass}`}
                    onClick={slickNext}>
                    {/* <Image
                    src="/assets/icons/banner-slider-arrow.svg"
                    alt="banner-slider-arrow"
                    sizes='100vw'
                    width={0}
                    height={0}
                    className='w-full h-full rotate-180'
                /> */}
                    <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                </button>
            </div >
        </>

    )
}

export default SlickCarouselArrows