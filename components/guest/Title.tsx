import { title } from 'process'
import React from 'react'

type TitleParams = {
    title: string,
    position?: string,
    className?: string,
}
const Title: React.FC<TitleParams> = ({ title, position = 'center', className = '' }) => {
    return (
        <>
            <h1 className={`flex flex-row justify-${position} items-start gap-2 ${className ? className : 'text-sgt-secondary-1'} text-center font-bold max-sm:text-lg sm:text-xl md:text-h3`}>
                {title}
            </h1>
        </>
    )
}

export default Title