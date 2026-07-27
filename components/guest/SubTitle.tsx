import React from 'react'

type TitleParams = {
    title: string,
    position?: string,
    className?: string,
}
const SubTitle: React.FC<TitleParams> = ({ title, position = 'center', className = '' }) => {
    return (
        <>
            <h2 className={`flex flex-row justify-${position} items-start gap-2 ${className ? className : 'text-bela-secondary-1'} text-center font-bold max-sm:text-lg sm:text-xl md:text-h3`}>
                {title}
            </h2>
        </>
    )
}

export default SubTitle;