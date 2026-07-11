'use client';

import { DESTINATION_SLUG, MARKET_SLUG, NATION_SLUG, POST_SLUG, TOPIC_SLUG } from '@/constants/SlugPermalink';
import { ADMIN_ROLE_NAME } from '@/constants/user';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { SlugPermalink } from '@/interfaces/slugPermalink';
import { setRedirectLink, setSlugPermalink, setShowAdminNav } from '@/store/adminNavSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React, { useEffect } from 'react'
type Params = {
    slugPermalink: SlugPermalink;
}
const AdminNavBarReduxUpdater: React.FC<Params> = ({ slugPermalink }) => {
    const dispatch = useAppDispatch();
    const userInfo = useGetUserInfo(true)
    const showAdminNav = useAppSelector((state) => state.adminNav.showAdminNav);
    const type = slugPermalink?.entity_type?.slice(0, -1)
    useEffect(() => {
        if ([POST_SLUG, NATION_SLUG, DESTINATION_SLUG, TOPIC_SLUG, MARKET_SLUG].includes(slugPermalink?.entity_type)) {
            if (userInfo?.role !== ADMIN_ROLE_NAME || !(userInfo?.permissionCodes || []).includes(`${type}_VIEW`)) {
                if (showAdminNav) {
                    dispatch(setShowAdminNav(false));
                }
            } else {
                if (!showAdminNav) {
                    dispatch(setShowAdminNav(true));
                    if ((userInfo?.permissionCodes || []).includes(`${type}_UPDATE`)) {
                        dispatch(setRedirectLink(`/admin/${type.toLowerCase()}?id=${slugPermalink?.entity_id}`));
                    }
                    dispatch(setSlugPermalink(slugPermalink));
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, userInfo]);

    return (
        <></>
    )
}
export default AdminNavBarReduxUpdater