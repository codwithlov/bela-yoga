import Link from 'next/link';
import React from 'react';

const SearchNoResult = ({ keyword }: { keyword: string }) => {
    return (
        <>
            <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-16 px-4">
                <div className="w-full text-center md:text-left">
                    <p className="text-2xl leading-tight">
                        Không tìm thấy kết quả với từ khóa: <strong className='text-bela-primary-1 font-bold'>{keyword}</strong>
                    </p>
                    <p className="text-bela-secondary-1 md:text-lg mt-4 md:mt-6">
                        Thay đổi nội dung để tìm kiếm các sân khác trên <Link href='/'><strong className='text-bela-primary-1 font-bold'>SPORTVERSE</strong></Link> nhé!
                    </p>
                </div>
            </div>
        </>
    );
};

export default SearchNoResult;
