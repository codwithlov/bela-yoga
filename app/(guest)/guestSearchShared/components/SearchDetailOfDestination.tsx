'use client';
import useScroll from '@/hooks/useScroll';
import useWindowSize from '@/hooks/useWindowSize';
import React, { useCallback, useEffect, useRef, useState } from 'react'

type SearchDetailDestinationParams = {
    content: any,
}

export const DestinationContent = React.memo(({ content }: { content: string }) => {
    return <div className='destination_content ck-content text-justify' dangerouslySetInnerHTML={{ __html: content ?? '' }}>
    </div>
})
DestinationContent.displayName = 'DestinationContent';

const SearchDetailDestination = React.memo((props: SearchDetailDestinationParams) => {

    const { content } = props;
    const [currentMenuActive, setCurrentMenuActive] = useState<string>();
    const [isOpenDetailMenu, setIsOpenDetailMenu] = useState<boolean>(false);
    const [menuHeight, setMenuHeight] = useState<number>(0);
    const detailMenuRef = useRef<HTMLDivElement>(null);
    const scroll = useScroll();
    const windowSize = useWindowSize();

    const loadMore = useCallback(() => {
        let loadMoreContent = document.getElementById(`search_detail_destination_content`);
        let loadMoreBtn = document.getElementById(`content_load_more_btn`);
        if (loadMoreContent) {
            loadMoreContent.classList.add('content_load_more');
        }
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
        reNewMenuHeight();
    }, []);

    const infoSelected = useCallback((item: any) => {
        loadMore();
        let content = document.getElementById(`sgt_heading_${item}`);
        let navHeight = document.getElementById('nav')?.offsetHeight as number;
        let mobileNavHeight = document.getElementById('mobile_nav')?.offsetHeight as number;
        let mobileMenuHeight = document.getElementById('destination_mobile_menu')?.offsetHeight as number;
        let contentPaddingTop = content?.getBoundingClientRect().top as number;
        let NeedToScrollY = window.scrollY + contentPaddingTop;
        let offsetContent = 0;
        if (window.innerWidth as number > 640) {
            offsetContent = NeedToScrollY - (navHeight + 8);
        } else {
            offsetContent = NeedToScrollY - (mobileNavHeight + mobileMenuHeight);
        }
        window.scrollTo({ top: offsetContent, left: 0, behavior: "smooth" });
        setIsOpenDetailMenu(false);
    }, [loadMore]);

    useEffect(() => {
        const setActiveMenu = (index: number) => {
            menuItems.forEach(item => {
                item.classList.remove('active');
            })
            let elementIsActive = document.getElementById(`sgt_menu_order_${index}`);
            elementIsActive?.classList.add('active');
        }
        let navHeight = document.getElementById('nav')?.offsetHeight as number + 30;
        let scrollItems = Array.from(
            document.getElementsByClassName('sgt_heading') as HTMLCollectionOf<HTMLElement>
        );
        let menuItems = Array.from(
            document.getElementsByClassName('destination_left_menu_item') as HTMLCollectionOf<HTMLElement>
        )
        let items = scrollItems.filter((item) => {
            if (item.getBoundingClientRect().top <= navHeight) return item;
        });
        if (items.length > 0) {
            let index = items.length - 1;
            let currentElement = items[index].id;
            if (currentMenuActive != currentElement) {
                setCurrentMenuActive(currentElement);
                setActiveMenu(index);
            }
        } else {
            setActiveMenu(0)
        }
    }, [scroll, currentMenuActive])

    useEffect(() => {
        let leftMenu = document.getElementsByClassName('destination_left_menu_list');
        let content = document.getElementById('search_detail_destination_content');
        let hItemsList = content?.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let $ulDiv: HTMLElement = document.createElement("ul");
        let $curLi: HTMLElement;
        let curDepth = 0;
        let level = 0;
        $ulDiv.classList.add('sgt_list_level_1');
        hItemsList?.forEach((item, index) => {
            item.id = `sgt_heading_${index}`;
            item.classList.add(`sgt_heading`);
            const $li = document.createElement('li');
            const $label = document.createElement('div');
            const textnode = document.createTextNode(item.textContent as string);
            $label.appendChild(textnode);
            $li.appendChild($label);
            $li.id = `sgt_menu_order_${index}`;
            $li.classList.add('destination_left_menu_item');
            $li.onclick = (e) => {
                e.stopPropagation();
                infoSelected(index);
            }
            let depth = Number(item.tagName.substring(1));
            if (curDepth == 0 || depth < curDepth) {
                if (curDepth == 0) {
                    $li.classList.add('active')
                }
                $ulDiv.append($li);
                $curLi = $li;
                level = 1;
            } else if (depth > curDepth) {
                level += 1;
                let $ol = document.createElement('ul');
                $ol.classList.add(`sgt_list_level_${level}`);
                $ol.appendChild($li);
                $curLi.append($ol);
                $curLi = $li;
            } else {
                $curLi.parentElement?.append($li);
                $curLi = $li;
                level = level;
            }
            curDepth = depth;
        })
        if (leftMenu[0].firstChild) {
            leftMenu[0].removeChild(leftMenu[0].firstChild);
        }
        leftMenu[0].appendChild($ulDiv);
        reNewMenuHeight();
    }, [infoSelected])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideMenu);
        return () => document.removeEventListener("mousedown", handleClickOutsideMenu);
    });

    const openDetailMenu = () => {
        setIsOpenDetailMenu(!isOpenDetailMenu);
    }

    const handleClickOutsideMenu = (event: any) => {
        if (detailMenuRef.current && !detailMenuRef.current.contains(event.target)) {
            setIsOpenDetailMenu(false);
        }
    }

    const reNewMenuHeight = () => {
        let contentHeight = document.getElementById(`search_detail_destination_content`);
        let menuHeight = document.getElementById(`search_detail_destination_left_menu`) as HTMLElement;
        menuHeight.style.minHeight = `calc(${contentHeight?.offsetHeight}px)`;
        setMenuHeight(contentHeight?.offsetHeight as number);
    }

    return (
        <section id="search_detail_destination" className='pb-16 mb-1 max-sm:pb-10 max-sm:px-4'>
            <div className='grid grid-cols-12 gap-x-5'>
                <div id="search_detail_destination_left_menu" className='col-span-12 md:col-span-3 relative z-50'>
                    <div className='rounded-sgt-10 sticky top-28 max-sm:top-16'>
                        <div className='destination_left_menu_title flex max-sm:hidden'>Thông tin chi tiết</div>
                        <div id='destination_mobile_menu' className='py-3 bg-sgt-bg-primary block md:hidden'>
                            <div ref={detailMenuRef} className='flex flex-row justify-between items-center bg-sgt-neutral-7 px-3 rounded-md border border-sgt-primary-1'
                                onClick={openDetailMenu}
                            >
                                <div className='destination_left_menu_title'>Thông tin chi tiết</div>
                                <div className='bg-sgt-secondary-1 dropdown_icon'
                                    style={{
                                        mask: 'url("/assets/icons/chevron-down.svg")',
                                        maskSize: 'cover',
                                        width: "1.125rem",
                                        height: "1.125rem",
                                    }}
                                >
                                </div>
                            </div>
                        </div>
                        <div
                            className={`destination_left_menu_list ${isOpenDetailMenu || windowSize.width as number > 640 ? 'block' : 'hidden'} custom-scrollbar`}
                            style={{
                                maxHeight: "calc(60vh)",
                                overflowY: 'auto'
                            }}>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 md:col-span-9 relative'
                    style={{
                        marginTop: windowSize.width as number < 640 ? -(menuHeight - 69) : 10
                    }}
                >
                    <div
                        id='search_detail_destination_content'
                        className='overflow-hidden mb-5'
                        style={{ maxHeight: 550 }}>
                        <DestinationContent content={content}></DestinationContent>
                        {/* 
                        <div className='destination_content' dangerouslySetInnerHTML={{ __html: content ?? '' }}>
                        </div> */}

                        {/* <h3>
                                Du lịch Nhật Bản - Xứ Sở Mặt Trời Mọc 1
                            </h3>
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p>
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p> <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p>
                            <h4>
                                111 Du lịch Nhật Bản 1
                            </h4>
                            dsaaaaaaaaaaaaaaaaaaaaaaa
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p>
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p>
                            <h3>
                                Du lịch Nhật Bản - Xứ Sở Mặt Trời Mọc 1
                            </h3>
                            <h4>
                                111 Du lịch Nhật Bản 1
                            </h4>
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p>
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p>
                            <h3>
                                Du lịch Nhật Bản - Xứ Sở Mặt Trời Mọc 1
                            </h3>
                            <h4>
                                111 Du lịch Nhật Bản 1
                            </h4>
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p>
                            <p>
                                Đất nước mặt trời mọc luôn để lại ấn tượng sâu sắc về sự tử tế và chu đáo đối với du khách. Không chỉ hấp dẫn về món ăn ngon, phong cảnh đẹp, Nhật Bản còn được biết đến với là đất nước tiên phong cho những phong cách lối sống tối giản, được nhiều người ưa chuộng và học tập.
                            </p> */}
                    </div>
                    <div className='w-full text-center'>
                        <button
                            id='content_load_more_btn'
                            className='content_load_more_btn'
                            onClick={loadMore}
                        >
                            Xem thêm
                        </button>
                    </div>
                </div>
            </div>
        </section >
    )
})
SearchDetailDestination.displayName = 'SearchDetailDestination';
export default SearchDetailDestination

