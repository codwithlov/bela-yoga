'use client';

import { Checkbox, Divider, Drawer, Space } from 'antd';
import React, { useState } from 'react';
import { getUpdateDrawerProps, handleApiRequest } from '@/utils/helper';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDeleteMutation, usePostDataMutation } from '@/services/api/common';
import { useConfirm } from '../atoms/useConfirm';
import { AdminLoading } from '../atoms/Loading';
import { COMMENT } from '@/constants/route';
import UserReview from '@/components/general/organisms/UserReview';
import ShowCreateDrawer from './ShowCreateDrawer';
import CommentForm from './CommentForm';

interface CommentDrawerProps {
    marketId: any;
    type: string;
    title: string;
    openComment: boolean;
    setOpenComment: (open: boolean) => void;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({ marketId, title, openComment, setOpenComment, type }) => {
    const [loadingState, setLoadingState] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [comment, setComment] = useState<any>(null);
    const [deleteApi] = useDeleteMutation();
    const [postApi] = usePostDataMutation();
    const { handleConfirm, confirmModal } = useConfirm();

    const confirmDelete = (id: any, refetch: any) => {
        handleConfirm(
            'Xác nhận xóa bình luận',
            () => deleteComment(id, refetch)
        );
    }

    const confirmEdit = (comment: any) => {
        setOpenEditForm(true);
        setComment(comment)
    }

    const confirmChangeStatus = (id: any, refetch: any, active: any) => {
        handleConfirm(
            `Xác nhận chuyển đổi trạng thái thành ${active === 1 ? '"không ' : '"'}hiển thị"`,
            () => setStatusComment(id, refetch, active === 1 ? 0 : 1),
            'Đồng ý'
        );
    }

    const deleteComment = async (id: any, refetch: any) => {
        setLoadingState(true);
        const body = {
            url: COMMENT + '/' + id,
            data: { entity_type: type }
        }
        await handleApiRequest(deleteApi(body), refetch);

        setLoadingState(false);
    };

    const setStatusComment = async (id: any, refetch: any, active: any) => {
        setLoadingState(true);
        const body = {
            url: `${COMMENT}/setActive/${id}/${active}`,
            data: { entity_type: type }
        }
        await handleApiRequest(postApi(body), refetch);
        setLoadingState(false);
    };

    const CommentActions = ({ item, refetch }: { item: any, refetch: any }) => {
        const handleChangeStatus = () => confirmChangeStatus(item.id, refetch, item.is_active);
        const handleDelete = () => confirmDelete(item.id, refetch);
        const handleEdit = () => confirmEdit(item);

        return (
            <div>
                <Divider className='!mt-2 !mb-2' />
                <div className="cursor-pointer flex justify-end gap-2">
                    <Space onClick={handleChangeStatus} key="active">
                        <Checkbox checked={item.is_active === 1}>Cho phép hiển thị</Checkbox>
                    </Space>
                    <Space onClick={handleEdit} key="edit">
                        <EditOutlined />
                        Chỉnh sửa
                    </Space>
                    <Space onClick={handleDelete} className="!text-red-600" key="delete">
                        <DeleteOutlined />
                        Xóa bình luận
                    </Space>
                </div>
            </div>
        );
    };
    return (
        <Drawer
            title={title}
            open={openComment}
            {...getUpdateDrawerProps(830)}
            onClose={() => setOpenComment(false)}
            className='drawer-bg-sgt-bg-primary sgt_drawer_tour_detail'
            extra={
                <Space>
                    <ShowCreateDrawer title='Thêm bình luận' code='MARKET_REVIEW_CREATE' width='500px'>
                        {(closeModal) => (
                            <CommentForm isEdit={false} marketId={marketId} closeModal={closeModal} comment={null} />
                        )}
                    </ShowCreateDrawer>
                </Space>
            }
        >
            <AdminLoading isLoading={loadingState} />
            <UserReview marketId={marketId} fromAdmin CommentActions={CommentActions} />
            <Drawer
                title="Cập nhật Bình luận"
                open={openEditForm}
                {...getUpdateDrawerProps(500)}
                onClose={() => setOpenEditForm(false)}
                className='sgt_drawer_tour_detail'
            >
                <CommentForm isEdit={true} marketId={marketId} closeModal={()=>setOpenEditForm(false)} comment={comment} />
            </Drawer>
            {confirmModal}
        </Drawer>
    );
};

export default CommentDrawer;