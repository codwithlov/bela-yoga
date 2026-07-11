import React, { useEffect, useState } from 'react'

type windowScroll = {
    scrollY: number | undefined;
    scrollHeight: number | undefined;
    scrollTop: number | undefined;
}
const useScroll = (): windowScroll => {

    const [scrollY, setScrollY] = useState<windowScroll>({
        scrollY: undefined,
        scrollHeight: undefined,
        scrollTop: undefined,
    })
    useEffect(() => {
        const handleScroll = () => {
            setScrollY({
                scrollY: window.scrollY,
                scrollTop: document.documentElement.scrollTop,
                scrollHeight: document.documentElement.scrollHeight
            })
        }
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollY;
}
export default useScroll