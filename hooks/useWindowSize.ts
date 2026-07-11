import React, { useEffect, useState } from 'react'

type windowSize = {
    width: number | undefined,
    height: number | undefined,
    clientHeight: number | undefined,
}
const useWindowSize = (): windowSize => {

    const [windowSize, setWindowSize] = useState<windowSize>({
        width: undefined,
        height: undefined,
        clientHeight: undefined,
    })
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
                clientHeight: document.documentElement.clientHeight,
            })
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}
export default useWindowSize