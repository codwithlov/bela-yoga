'use client';

import { useAppSelector } from '@/store/hooks';
import { getSeoScoreColor } from '@/utils/post';
import React from 'react'
type Params = {
}
const AdminNavBar: React.FC<Params> = ({
}) => {
    const showAdminNav = useAppSelector((state) => state.adminNav.showAdminNav);
    const redirectlink = useAppSelector((state) => state.adminNav.redirectlink);
    const slugPermalink = useAppSelector((state) => state.adminNav.slugPermalink);
    const colorClass = getSeoScoreColor(slugPermalink.seo_score, slugPermalink.index, slugPermalink.keywords);

    if (!showAdminNav) {
        return <></>
    }
    return (
        <div id='admin-navbar' className='bg-slate-700 h-9 hidden w-full lg:flex flex-row fixed left-0 top-0 z-[1000] text-white px-3'>
            <div className='width-primary m-auto h-full flex flex-row items-center gap-3'>
                <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${colorClass}`} />
                {
                    redirectlink &&
                    <a
                        className="bg-indigo-500 px-2 rounded-md !text-sm cursor-pointer"
                        href={redirectlink}
                        target='_blank'
                    >
                        Chỉnh sửa
                    </a>
                }
            </div>
        </div>
    )
}
export default AdminNavBar