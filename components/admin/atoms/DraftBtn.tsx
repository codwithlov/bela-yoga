'use client';
import React from 'react'
import '@/styles/components/loading.scss'
import { SnippetsTwoTone, SnippetsOutlined } from '@ant-design/icons';
import useGetUserInfo from '@/hooks/useGetUserInfo';
export const DraftBtn = (props: any) => {
    const { onDraftClicked, isDraft, draftCount } = props
    const userInfo = useGetUserInfo();
    if (!(userInfo?.permissionCodes || []).includes('POST_CREATE')) {
        return <></>
    }
    return (
        <div
            className={`relative border !h-8 ${isDraft ? 'border-blue-500' : 'border-gray-300'} rounded-lg flex items-center justify-center w-8 cursor-pointer`}
            onClick={onDraftClicked}
        >
            {isDraft ? <SnippetsTwoTone /> : <SnippetsOutlined />}
            {
                (draftCount || 0) > 0 &&
                <div
                    className="absolute -bottom-1 -right-1 bg-orange-600 text-white w-4 h-4 rounded-full flex items-center justify-center"
                    onClick={onDraftClicked}
                >
                    <span className="text-[9px]">{draftCount > 9 ? '9+' : draftCount}</span>
                </div>
            }

        </div>
    )
}
