'use client';
import React, { useId, useRef } from 'react';
import Slider from 'react-slick';
import NavButton from '../atoms/ArrowBtn';
import '@/styles/components/slider.scss';
import { useMediaQuery } from 'react-responsive';

type FeedbackProps = {
    items: any[];
    children: (item: any, index: number) => React.ReactNode;
};

const CustomSlider = ({ items, children }: FeedbackProps) => {
    const sliderRef = useRef<Slider | null>(null);
    const keyByTime = useId();
    const autoplaySpeedTime = 3000;
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

    if (items.length < 3) return null;
    const visibleItems = (items.length === 3 && !isMobile) ? [...items, ...items] : items;

    const afterChange = (index: number) => {
        const slidesToShow = 1.25;
        if (Math.round(index) === visibleItems.length - Math.round(slidesToShow)) {
            setTimeout(() => {
                sliderRef.current?.slickGoTo(0, false);
            }, autoplaySpeedTime);
        }
    };

    const settings = {
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        autoplay: false,
        centerMode: true,
        centerPadding: '0',
        className: 'center',
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    speed: 800,
                    dots: false,
                    autoplay: true,
                    infinite: false,
                    slidesToShow: 1.25,
                    slidesToScroll: 1,
                    centerMode: true,
                    afterChange,
                },
            },
        ],
    };

    const handleNext = () => sliderRef.current?.slickNext();
    const handlePrev = () => sliderRef.current?.slickPrev();

    return (
        <div id="feedback_slider" className="max-sm:pt-0 pt-10 slick_carousel relative">
            <Slider key={keyByTime} ref={sliderRef} {...settings}>
                {visibleItems.map((item, index) => (
                    <div key={index} className="aspect-square feedback_item">
                        {children(item, index)}
                    </div>
                ))}
            </Slider>

            <div className="hidden max-sm:hidden sm:block">
                <NavButton onClick={handlePrev} direction="left" className="left-0 top-1/2" />
                <NavButton onClick={handleNext} direction="right" className="right-0 top-1/2" />
            </div>
        </div>
    );
};

export default CustomSlider;
