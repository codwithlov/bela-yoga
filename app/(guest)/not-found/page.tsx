import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import "@/styles/components/button.scss";
import { createMetadata, metaOptions } from '@/constants/metaDataPage'

export async function generateMetadata() {
    return createMetadata(metaOptions.notFound);
};

const NotFoundPage = () => {
    return (
        <div className='bg-bela-primary-4 max-md:-mb-12 max-md:pb-12'>
            <div className="relative flex flex-col items-center w-full h-screen bg-cover bg-center bg-[url('/assets/images/404/background-404.png')] pt-20 lg:pt-9">
                <Image
                    src="/assets/images/404/404.png"
                    alt="404 Not Found"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className='object-contain w-72 md:w-[400px] 2xl:w-[540px] h-auto'
                />
                <div className='2xl:-mt-8 text-bela-secondary-1 items-center flex flex-col text-center px-4'>
                    <h1 className="text-4xl 2xl:text-5xl font-bold">OOPS!!!</h1>
                    <p className="text-base md:text-lg 2xl:text-[1.4rem] font-medium">We can’t find the page that you’re looking for</p>
                    <Link
                        href='/'
                        className='gradient-btn flex items-center py-3 2xl:py-4 px-8 mt-10 gap-2.5'
                    >
                        <Image
                            src="/assets/icons/arrow-left.svg"
                            alt="arrow-left"
                            width={24}
                            height={24}
                        />
                        <p className='text-md 2xl:text-lg font-semibold leading-none'>Về trang chủ</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
