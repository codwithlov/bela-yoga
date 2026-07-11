'use client';
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import dynamic from 'next/dynamic';

/** Import Lazy CSS */

const SlickCarouselCss = dynamic(() => import('@/components/non-critical/SlickCarouselCss'), { ssr: false });

/** End */

import React, { useEffect, useRef, useState } from 'react'
type SlickCarouselParams = {
    key: any,
    sliderRef?: (ref: any) => void,
    settings: any,
    children: React.ReactNode
}
const SlickCarousel: React.FC<SlickCarouselParams> = ({
    key,
    sliderRef,
    settings,
    children
}) => {
    let ref = useRef<Slider | null>(null);
    sliderRef ? sliderRef(ref) : null;
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            {isClient && <SlickCarouselCss />}
            <div>
                <Slider
                    key={key}
                    ref={ref}
                    {...settings}
                >
                    {children}
                </Slider>
            </div>
        </>

    )
}
export default SlickCarousel