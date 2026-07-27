import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Nation {
    nation_name: string;
    slug: string;
}

interface Item {
    type?: string;
    nations?: Nation[];
    value?: string;
    label?: string;
}

interface BreadcrumbProps {
    items: Item[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <div className='hidden lg:flex justify-start items-center text-button'>
            <Link href='/' className='flex flex-row gap-2 justify-center items-center hover:text-bela-primary-1'>
                <Image
                    src='/assets/icons/home-page.svg'
                    alt='home-page'
                    width={0}
                    height={0}
                    sizes='100vw'
                    style={{ width: "1.25rem", height: "auto" }}
                />
                <p>Trang chủ</p>
            </Link>

            {/* Render the other items */}
            {items?.map((item, index) => (
                <React.Fragment key={item.type === 'nation' ? `nation-${index}` : `link-${index}`}>
                    <div className={`${item?.value ? 'border-l mx-2' : ''} border-bela-secondary-1 h-4`} />
                    {item.type === 'nation' ? (
                        <div className='flex items-center'>
                            {item.nations?.map((nation, i) => (
                                <React.Fragment key={nation.nation_name}>
                                    <Link href={`/${nation?.slug}`} className='hover:text-bela-primary-1'>
                                        <p>{nation.nation_name}</p>
                                    </Link>
                                    {i < (item.nations?.length || 0) - 1 && <p>-</p>}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <Link href={`/${item?.value}`} className={`hover:text-bela-primary-1 ${index === items.length - 1 ? 'text-bela-primary-1' : ''}`}>
                            <p>{item.label}</p>
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;
