'use client';
import React, { useState } from 'react';
import { Pagination } from 'antd';
import '@/styles/components/antd-reset.scss'

const GuestListPagination = ({
    page,
    setPage,
    pagination,
}: {
    page: number;
    setPage: any;
    pagination: any;
}) => {
    const itemRender = (page: number, type: string, originalElement: React.ReactNode) => {
        if (type === "prev") {
            return <a className='w-6 h-6 max-sm:h-4 max-sm:w-4'
                style={{
                    mask: 'url("/assets/icons/chevron-left.svg")',
                    maskSize: 'cover',
                }}
            ></a>;
        }
        if (type === "next") {
            return <a className='w-6 h-6 max-sm:h-4 max-sm:w-4 '
                style={{
                    mask: 'url("/assets/icons/chevron-right.svg")',
                    maskSize: 'cover',
                }}
            ></a>;
        }
        return originalElement;
    };

    if (!pagination?.total) return null;
    return (
        <div className='text-center pt-12 mt-0.5 max-sm:pt-10'>
            <Pagination
                className='sgt_ant_pagination_custom flex flex-row justify-center items-center'
                onChange={setPage}
                defaultPageSize={pagination?.per_page}
                responsive={true}
                showSizeChanger={false}
                total={pagination?.total}
                current={page || 1}
                hideOnSinglePage={true}
                itemRender={itemRender}
            />
        </div>
    );
};

export default GuestListPagination;
