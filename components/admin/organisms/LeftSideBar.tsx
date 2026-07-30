'use client';

import { ADMIN_MARKET, ADMIN_MENU, ADMIN_OVERVIEW, ADMIN_PAGE, ADMIN_POST, ADMIN_POST_CATEGORY, ADMIN_ROLE, ADMIN_SECTION, ADMIN_SUPPORT_REQUEST, ADMIN_USER } from "@/constants/route";
import { faAddressBook, faBars, faDashboard, faFileLines, faLayerGroup, faListCheck, faNewspaper, faStore, faTags, faUser } from "@fortawesome/free-solid-svg-icons";
import { getUserInfo as getStoredUserInfo } from "@/utils/authenticate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { normalizePermissionCode } from '../../../utils/adminNavigation';

interface MenuType {
    code: string;
    icon: JSX.Element;
    label: string;
    path: string;
}

const LeftSideBar = () => {
    const pathname = usePathname();

    const [selectedKey, setSelectedKey] = useState<any>(pathname);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);
    const [userInfo, setUserInfo] = useState<any>(getStoredUserInfo());

    const checkPermission = (name: string, permissionCodesSource?: string[]) => {
        const permissionCodes = (permissionCodesSource || userInfo?.permissionCodes || []).map(normalizePermissionCode);
        return permissionCodes.includes(normalizePermissionCode(name));
    }

    const createMenuItems = (menuItems: MenuType[], permissionCodesSource?: string[]): MenuProps['items'] => {
        return menuItems
            .filter(({ code }) => checkPermission(code, permissionCodesSource))
            .map(({ icon, label, path }) => ({
                key: path,
                icon,
                label: <Link href={{ pathname: path }}>{label}</Link>,
            }));
    };

    const menuPermissions: MenuType[] = [
        { code: 'OVERVIEW_VIEW', icon: <FontAwesomeIcon icon={faDashboard} />, label: 'Tổng quan', path: ADMIN_OVERVIEW },
        { code: 'MENU_VIEW', icon: <FontAwesomeIcon icon={faFileLines} />, label: 'Page', path: ADMIN_PAGE },
        { code: 'MARKET_VIEW', icon: <FontAwesomeIcon icon={faStore} />, label: 'Sản phẩm', path: ADMIN_MARKET },
        { code: 'POST_VIEW', icon: <FontAwesomeIcon icon={faNewspaper} />, label: 'Bài viết', path: ADMIN_POST },
        { code: 'POST_VIEW', icon: <FontAwesomeIcon icon={faTags} />, label: 'Danh mục bài viết', path: ADMIN_POST_CATEGORY },
        { code: 'USER_VIEW', icon: <FontAwesomeIcon icon={faAddressBook} />, label: 'Khách hàng', path: ADMIN_SUPPORT_REQUEST },
        { code: 'USER_VIEW', icon: <FontAwesomeIcon icon={faUser} />, label: 'Quản lý người dùng', path: ADMIN_USER },
        { code: 'ROLE_VIEW', icon: <FontAwesomeIcon icon={faListCheck} />, label: 'Quản lý vai trò', path: ADMIN_ROLE },
        { code: 'MENU_VIEW', icon: <FontAwesomeIcon icon={faBars} />, label: 'Menu', path: ADMIN_MENU },
        { code: 'SECTION_VIEW', icon: <FontAwesomeIcon icon={faLayerGroup} />, label: 'Section', path: ADMIN_SECTION },
    ];

    useEffect(() => {
        const storedUserInfo = getStoredUserInfo();
        setUserInfo(storedUserInfo);
        const items: MenuProps['items'] = createMenuItems(menuPermissions, storedUserInfo?.permissionCodes || []);
        setMenuItems(items);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    useEffect(() => {
        setSelectedKey(pathname);
    }, [pathname]);

    return (
        <div className="pr-0.5">
            <div className="h-[calc(100vh-90px)] overflow-auto transparent-scrollbar">
                <Menu
                    className='!text-xs !pl-0 left-side-bar'
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    inlineIndent={12}
                    items={menuItems}
                />
            </div>
        </div>
    );
}

export default LeftSideBar;
