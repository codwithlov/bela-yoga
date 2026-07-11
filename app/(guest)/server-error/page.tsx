import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import "@/styles/components/button.scss";
import { createMetadata, metaOptions } from '@/constants/metaDataPage'

export async function generateMetadata() {
    return createMetadata(metaOptions.serverError);
};

const ServerErrorPage = () => {
    return (
        <div className='max-md:-mb-12 max-md:pb-12'>
            <div className="relative justify-center flex flex-col items-center w-full h-screen bg-cover bg-center pt-10 lg:pt-9">
                <Image
                    src="/assets/images/500/500.png"
                    alt="500 Server Error"
                    width={1000}
                    height={0}
                    sizes="100vw"
                    className='object-contain px-4'
                />
                <div className='text-sgt-secondary-1 items-center flex flex-col text-center pt-4 px-4'>
                    <h1 className="text-3xl 2xl:text-4xl font-bold">OOPS!!!</h1>
                    <p className="text-base md:text-lg 2xl:text-[1.4rem] font-medium">Request Timeout</p>
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

export default ServerErrorPage;
