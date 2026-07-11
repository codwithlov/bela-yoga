'use client';
import React from 'react'
import '@/styles/components/loading.scss'
import { DeleteTwoTone, DeleteOutlined } from '@ant-design/icons';
import useGetUserInfo from '@/hooks/useGetUserInfo';
export const TrashCan = (props: any) => {
    const { onTrashCanClicked, deleted } = props
    const userInfo = useGetUserInfo();
    if (!(userInfo?.permissionCodes || []).includes('POST_VIEW_TRASH')) {
        return <></>
    }
    return (
        <div
            className={`border !h-8 ${deleted ? 'border-blue-500' : 'border-gray-300'} rounded-lg flex items-center justify-center w-8 cursor-pointer`}
            onClick={onTrashCanClicked}
        >
            {deleted ? <DeleteTwoTone /> : <DeleteOutlined />}
        </div>
    )
}
