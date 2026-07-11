'use client';
import React, { useEffect } from 'react'
import { MARKET } from '@/constants/route';
import { Drawer } from 'antd';
import { useGetDataQuery } from '@/services/api/common';
import AdminMarketArticleForm from './createUpdate/AdminMarketArticleForm';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { showErrorToastr } from '@/utils/toastr';
import { useConfirm } from '@/components/admin/atoms/useConfirm';

const AdminMarketUpdateDrawer = (props: any) => {
    const { openDrawer, closeDrawer, marketId, refetchList } = props;
    const { handleConfirm, confirmModal } = useConfirm();

    const { data: marketData, isFetching, refetch } = useGetDataQuery(
        `${MARKET}/detail/${marketId}`,
        { refetchOnMountOrArgChange: true, skip: !marketId || !openDrawer });

    useEffect(() => {
        if (!marketData?.data?.market?.market_id && openDrawer && !isFetching) {
            showErrorToastr('Có lỗi xảy ra');
            closeDrawer();
        }
    }, [closeDrawer, isFetching, marketData?.data, openDrawer])

    return (
        <Drawer
            title={"Thông tin tuyến tour: " + (marketData?.data?.tour_name || '')}
            open={openDrawer}
            width="90%"
            height="max-content"
            footer={null}
            closeIcon={null}
            placement='right'
            className="sgt_drawer sgt_drawer_tour_detail custom-scrollbar"
            destroyOnHidden
            onClose={() => { handleConfirm('Xác nhận đóng', closeDrawer, 'Đóng') }}
        >
            <AdminLoading isLoading={isFetching} />
            <AdminMarketArticleForm
                marketId={marketId}
                marketData={marketData?.data}
                refetchList={refetchList}
                refetch={refetch}
            />
            {confirmModal}

        </Drawer>
    )
}

export default AdminMarketUpdateDrawer