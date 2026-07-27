'use client'
import useScroll from '@/hooks/useScroll'
import useWindowSize from '@/hooks/useWindowSize'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ScrollToTop = () => {
    const scroll = useScroll();
    const windowSize = useWindowSize();
    const scrollYMax = windowSize.height as number / 3;
    const clientHeight = windowSize.clientHeight as number;
    const scollY = scroll.scrollY as number;
    const scrollHeight = scroll.scrollHeight as number;
    const bottomHeight = typeof document !== 'undefined'
        ? (document.getElementById("__sgt_footer")?.offsetHeight as number) || 0
        : 0;
    const scrollBottomLimit = (scollY + clientHeight) + bottomHeight;
    let colorInBottom = '';
    if (scrollHeight < scrollBottomLimit) {
        colorInBottom = 'bg-bela-secondary-default text-white';
    } else {
        colorInBottom = '';
    }
    const toTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
    return (
        <>
            {
                <div
                    onClick={toTop}
                    className={`fixed bottom-3 right-3 duration-300 transition-all ${scroll.scrollY as number > scrollYMax ? 'opacity-100' : 'opacity-0'}`}
                    style={{ zIndex: 9999 }}>
                    <div className={`mb-2 h-10 w-10 rounded-full bg-bela-primary-default ${colorInBottom} ${scrollHeight < scrollBottomLimit ? 'bg-opacity-65' : 'bg-opacity-55'} hover:bg-opacity-100 duration-300 transition-all shadow-lg flex justify-center items-center cursor-pointer`}>
                        <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
                    </div>
                </div >
            }
        </>
    )
}

export default ScrollToTop