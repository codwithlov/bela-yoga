
'use client'
import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import MenuMobile from './MenuMobile';
import { Dropdown } from 'antd';
import useWindowSize from '@/hooks/useWindowSize';
import useScroll from '@/hooks/useScroll';
import NavBarUserSection from '@/components/general/organisms/NavBarUserSection';
import { PHONE } from '@/constants/link';
import { useAppSelector } from '@/store/hooks';
import { Menu } from '@/interfaces/menu';
import { normalizeUrl } from '@/utils/helper';
import dynamic from 'next/dynamic';
import { templateSiteConfig } from '@/config/template/site';

/** Import Lazy CSS */

const DropdownMenuCss = dynamic(() => import('@/components/non-critical/DropdownMenuCss'), { ssr: false });

/** End */

type NavBarParams = {
  menuList: Menu[];
}

const NavBar: React.FC<NavBarParams> = React.memo(({ menuList }) => {
  const pathname = usePathname();
  const windowSize = useWindowSize();
  const scroll = useScroll();
  // const [nationOptions, setNationOptions] = useState<MenuProps['items']>([]);
  const showAdminNav = useAppSelector((state) => state.adminNav.showAdminNav);
  const [isClient, setIsClient] = useState(false);
  const logo = templateSiteConfig.assets.logo;
  const brandName = templateSiteConfig.name;
  const staticMobileRoutes = [
    templateSiteConfig.routes.home,
    templateSiteConfig.routes.products,
    templateSiteConfig.routes.posts,
    templateSiteConfig.routes.about,
  ];

  let navSubHeight = 'h-auto';
  let navHeight = useRef(98);
  const maxScroll = 400;
  const scrollTop = scroll.scrollTop as number;

  const getChildMenu = (children: Menu[]) => {
    return children.map((item, index) => ({
      key: index as number,
      label: (
        item ? <Link href={normalizeUrl(item.slug_permalink?.slug || item.url_to)}
          className='flex flex-row justify-start items-center gap-3 py-0.5'
        >
          {
            item.image?.url &&
            <Image
              src={item.image?.url}
              alt={item.title}
              width={25}
              height={12}
              style={{ width: "1.375rem", height: "auto" }}
            />
          }

          <div>{item.title}</div>
        </Link> :
          null
      )
    }))
  }

  if (windowSize.width as number > 1024) {
    if (scrollTop > maxScroll) {
      navSubHeight = 'h-0 ';
    } else {
      navSubHeight = 'h-auto';
    }
  }

  useLayoutEffect(() => {
    if (document.querySelector('#nav')?.scrollHeight) {
      navHeight.current = document.querySelector('#nav')?.scrollHeight as number;
    }

  }, [])

  useEffect(() => {
    if (showAdminNav && window) {
      window.scrollTo(0, 0);
    }
  }, [showAdminNav]);

  const getSortedMenu = (children: any[]) => {
    const columns = 3;
    const rows = Math.ceil(children.length / columns);
    const sortedItems: any[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const index = col * rows + row;
        sortedItems.push(children[index]);
      }
    }
    return sortedItems;
  };

  const renderNavBar = (small: boolean) => {
    return (menuList || []).map((item, index) => {
      const childLength = (item.children || []).length || 0;
      return childLength > 0 ? (
        <Dropdown
          key={index}
          menu={{
            items: getChildMenu(getSortedMenu(item.children || [])),
            style: {
              display: 'grid',
              gridTemplateColumns: 'auto auto auto',
              padding: '0.5rem',
              columnGap: '0.75rem',
            }
          }}
          overlayStyle={{ minWidth: "12rem" }}
          overlayClassName='sgt_dropdown_menu sgt_dropdown_menu_navbar'
          className='cursor-pointer'
        >
          <Link href={normalizeUrl(item.slug_permalink?.slug || item.url_to)} className="flex flex-row gap-1 justify-center items-center pt-1">
            <p>{item.title}</p>
            <div className='bg-sgt-secondary-1 dropdown_icon'
              style={{
                mask: 'url("/assets/icons/chevron-down.svg")',
                maskSize: 'cover',
                width: "1.125rem",
                height: "1.125rem",
              }}
            ></div>
            {/* <FontAwesomeIcon className="text-2xs text-sgt-neutral-1" icon={faChevronDown} /> */}
          </Link>
        </Dropdown>
      ) : (
        <Link
          key={index}
          href={normalizeUrl(item.slug_permalink?.slug || item.url_to)}
          className="flex flex-row gap-1 justify-center items-center pt-1"
        >
          <p>{item.title}</p>
        </Link>
      )
    })
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && <DropdownMenuCss />}
      {
        staticMobileRoutes.includes(pathname) ?
          <nav id="mobile_nav" className='block lg:hidden w-full h-16 sticky left-0 top-0 z-50 shadow-sgt-black-2' style={{ zIndex: 1000 }}>
            <div className='h-full flex flex-row justify-between items-center px-4 py-4 bg-white'>
              <div className='navbar_logo'>
                <Link href="/">
                  <Image
                    src={logo}
                    alt={`${brandName} logo`}
                    width={0}
                    height={0}
                    sizes='100vw'
                    loading='eager'
                    priority={true}
                    style={{ width: "140px", height: "auto" }}
                  />
                </Link>
              </div>
              <div className='flex flex-row justify-end gap-5'>
                {/* <a aria-label='Account'>
                  <FontAwesomeIcon className='text-sgt-neutral-1' size='lg' icon={faUser} />
                </a> */}
                <Suspense>
                  <NavBarUserSection isMobile />
                </Suspense>
                <div className='flex justify-center items-center'>
                  <MenuMobile menuList={menuList} btnClass='border-sgt-primary-light' />
                </div>
              </div>
            </div>
          </nav> : null
      }
      <nav
        id='nav'
        style={{ top: (!showAdminNav) ? 0 : 36 }}
      >
        <div className='width-primary m-auto h-full flex flex-row justify-between items-center gap-6'>
          <div className='navbar_logo'>
            <Link href="/" className='navbar_logo'>
              <Image
                src={logo}
                alt={`${brandName} logo`}
                height={0}
                width={0}
                sizes='100vw'
                loading='eager'
                priority={true}
                style={{ width: `${scrollTop > maxScroll ? 165 : 221}px`, height: "auto" }}
                className='transition-all duration-300'
              />
            </Link>
          </div>
          <div className={`flex-1 flex flex-col justify-end gap-3.5 transition-all duration-300 ${scrollTop > maxScroll ? '!gap-0' : 'gap-3.5'}`}>
            <div className='flex justify-end items-center gap-2.5 text-sm font-medium transition-all duration-300'>
              <div id="nav_sub_has_scroll" className={`flex gap-6 text-sgt-secondary-1 text-sub-1 ${navSubHeight === 'h-auto' ? 'hidden' : ''}`}>
                {renderNavBar(true)}
              </div>
              <a href={`tel:${PHONE.trim()}`} className='hotline-btn'>
                <p className='text-button text-sgt-neutral-1'>{templateSiteConfig.contact.hotlineLabel} · {PHONE}</p>
              </a>
              <div className={navSubHeight === 'h-auto' ? '' : 'hidden'}>
                <Suspense>
                  <NavBarUserSection />
                </Suspense>
              </div>
            </div>
            <div id='nav_sub' className={`${navSubHeight === 'h-auto' ? '' : '!hidden'}`}>
              {renderNavBar(false)}
            </div>
          </div>
        </div>
      </nav>
      <div className='hidden lg:flex' style={{ height: navHeight.current + (!showAdminNav ? 0 : 36) }}></div>
    </>
  )
});
NavBar.displayName = 'NavBar';
export default NavBar