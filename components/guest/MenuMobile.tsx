'use client';
import { PHONE } from '@/constants/link';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Drawer, Menu, MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'

import { Menu as IMenu } from '@/interfaces/menu';
import { normalizeUrl } from '@/utils/helper';
import Image from 'next/image';
import dynamic from 'next/dynamic';

/** Import Lazy CSS */
const MenuCss = dynamic(() => import('@/components/non-critical/MenuCss'), { ssr: false });

/** End */
type MenuMobileParams = {
    btnClass?: string;
    iconClass?: string;
    iconSize?: SizeProp;
    menuList: IMenu[];
}

const MenuMobile = (props: MenuMobileParams) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    const menuItems: MenuProps['items'] = [
        {
            key: `phone`,
            label: <a
                href={`tel:${PHONE.trim()}`}
                className='w-full text-base flex flex-row justify-start items-center gap-2 !text-sub-1 !text-sgt-neutral-1'>
                <p className='text-base font-medium'>Hotline {PHONE.trim()}</p>
            </a>
        },
        ...(props.menuList || []).map((item) => ({
            key: item.key,
            label: (
                (item.children && item.children.length > 0) ? (
                    <p className="text-base font-medium !text-sgt-neutral-1">{item.title}</p>
                ) : (
                    <a
                        href={normalizeUrl(item.slug || item.url_to)}
                        className="text-base font-medium !text-sgt-neutral-1"
                    >
                        {item.title}
                    </a>
                )
            ),
            ...(((item.children || []).length > 0) && {
                children: (item.children || []).map((child: IMenu) => ({
                    key: child.key,
                    label: (
                        <a
                            href={normalizeUrl(child.slug_permalink?.slug || child.url_to)}
                            className='flex items-center gap-2'
                        >
                            {
                                child.image?.url &&
                                <Image
                                    src={child.image?.url}
                                    alt={child.title}
                                    width={25}
                                    height={12}
                                    style={{ width: "1.375rem", height: "auto", maxHeight: "1rem" }}
                                />
                            }
                            <p className="text-sm font-normal !text-sgt-neutral-1">{child.title}</p>
                        </a>
                    ),
                })),
            }),
        })),

    ]
    return (
        <>
            {isClient && <MenuCss />}
            <div>
                <button id='sgt_menu_mobile' aria-label='Mobile Menu' className={`${props.btnClass}`} onClick={() => setOpenMenu(true)}>
                    <FontAwesomeIcon
                        className={`${props.iconClass ?? 'text-sgt-neutral-1'}`}
                        size={`${props.iconSize ?? "lg"}`}
                        icon={faBars}
                    />
                </button>
                <Drawer
                    title=""
                    style={{}}
                    open={openMenu}
                    width={"80%"}
                    height={"100%"}
                    footer={null}
                    closeIcon={null}
                    className="sgt_drawer"
                    placement='right'
                    destroyOnHidden
                    onClose={() => setOpenMenu(false)}
                >
                    <div className='py-4'>
                        <Menu
                            className='!text-xs !pl-0 w-full !border-none'
                            theme="light"
                            mode="inline"
                            inlineIndent={36}
                            items={menuItems}
                        />
                    </div>
                </Drawer >
            </div>
        </>
    )
}
export default MenuMobile