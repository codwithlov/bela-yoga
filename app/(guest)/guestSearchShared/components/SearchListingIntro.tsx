
import { capitalizeFirstLetter } from '@/utils/formatString';
import React from 'react'
type SearchListingIntroParams = {
    title?: string,
    content?: string,
}
const SearchListingIntro = (props: SearchListingIntroParams) => {
    const { title = '', content = '' } = props;
    const titleConvert = title ? capitalizeFirstLetter(title) : 'Nội dung chi tiết';
    return (
        <section id='search_introduce_tour' className='pb-4 mb-1 max-sm:pb-4 max-sm:px-4'>
            <h1 className='text-h3 max-sm:text-lg text-sgt-secondary-1 text-center pb-4'>{titleConvert}</h1>
            <div className='!text-sgt-neutral-1 !text-body-2 max-sm:!text-cap-1 ck-content text-justify' dangerouslySetInnerHTML={{ __html: content }}></div>
        </section>
    )
}

export default SearchListingIntro