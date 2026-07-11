import React from 'react'

type TitleParams = {
    title: string,
    position?: string,
    className?: string,
}
const TitleSpan: React.FC<TitleParams> = ({ title, position = 'center', className = '' }) => {
    return (
        <div className='max-sm:pt-6 px-4 xl:px-0'>
            <span className={`${className ? className : 'text-sgt-secondary-1'} text-start font-bold max-sm:text-lg sm:text-xl md:text-h3`}>
                {title}
            </span>
        </div>
    )
}

export default TitleSpan;