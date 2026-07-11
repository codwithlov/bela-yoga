'use client';

import React, { useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import useCheckPermission from '@/hooks/useCheckPermission';
import { PostType } from '@/interfaces/post';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminPostTypeCreateUpdateModal from './AdminPostTypeCreateUpdateModal';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { handleApiRequest } from '@/utils/helper';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { useDeleteMutation } from '@/services/api/common';
import { ITagType } from '@/interfaces/tag';

type Props = {
    tagTypes: ITagType[];
    postTypes: PostType[];
    reloadDataList: any;
};

const AdminPostType: React.FC<Props> = ({
    tagTypes,
    postTypes,
    reloadDataList
}) => {
    const [open, setOpen] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const postTypeRef = useRef<PostType | null>(null);
    const closeDrawer = () => { setOpen(false); };
    const checkPermission = useCheckPermission();
    const { handleConfirm, confirmModal } = useConfirm();
    const [deleteApi] = useDeleteMutation();

    if (!checkPermission('POST_TYPE_UPDATE')) {
        return null;
    }

    const handleOnDeleteOk = async (id: number) => {
        const body = {
            url: 'admin-post-type' + '/' + id,
        }
        await handleApiRequest(deleteApi(body), reloadDataList, setSpinning);
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                Chuyên mục
            </Button>

            <Modal
                title="Cập nhật chuyên mục"
                open={open}
                width={400}
                onCancel={closeDrawer}
                cancelButtonProps={{ className: "!hidden" }}
                okButtonProps={{ className: "!hidden" }}
            >
                <div className='pt-2'>
                    {spinning && <AdminLoading isLoading={spinning} />}
                    <div
                        className='flex gap-1 font-semibold cursor-pointer'
                        onClick={() => {
                            setOpenEditModal(true);
                            postTypeRef.current = null;
                        }}
                    >
                        <PlusOutlined className="cursor-pointer" />
                        Tạo
                    </div>
                    {
                        (postTypes || []).map(postType => (
                            <div key={postType.value} className='mt-2 w-full bg-blue-50 p-2 rounded-md flex gap-2'>
                                <div className='flex-grow'>{postType.label}</div>
                                <EditOutlined
                                    className="!text-blue-500 cursor-pointer"
                                    onClick={() => {
                                        setOpenEditModal(true);
                                        postTypeRef.current = postType;
                                    }}
                                />
                                <DeleteOutlined
                                    className="!text-red-500 cursor-pointer"
                                    onClick={() => {
                                        handleConfirm('Xác nhận xóa loại bài đăng ' + postType.label, () => handleOnDeleteOk(postType.value));
                                    }}
                                />
                            </div>
                        ))
                    }
                </div>
                <AdminPostTypeCreateUpdateModal
                    open={openEditModal}
                    setOpen={setOpenEditModal}
                    reloadDataList={reloadDataList}
                    postType={postTypeRef.current}
                    tagTypes={tagTypes}
                />
            </Modal>
            {confirmModal}
        </>
    );
};

export default AdminPostType;