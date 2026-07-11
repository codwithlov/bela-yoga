'use client';

import React, { useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import useCheckPermission from '@/hooks/useCheckPermission';
import { ITagType } from '@/interfaces/tag';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminTagTypeCreateUpdateModal from './AdminTagTypeCreateUpdateModal';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { handleApiRequest } from '@/utils/helper';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { useDeleteMutation } from '@/services/api/common';

type Props = {
    tagTypes: ITagType[];
    reloadDataList: any;
};

const AdminPostType: React.FC<Props> = ({
    tagTypes,
    reloadDataList
}) => {
    const [open, setOpen] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const tagTypeRef = useRef<ITagType | null>(null);
    const closeDrawer = () => { setOpen(false); };
    const checkPermission = useCheckPermission();
    const { handleConfirm, confirmModal } = useConfirm();
    const [deleteApi] = useDeleteMutation();

    if (!checkPermission('TAG_TYPE_UPDATE')) {
        return null;
    }

    const handleOnDeleteOk = async (id: number) => {
        const body = {
            url: 'admin-tag-type' + '/' + id,
        }
        await handleApiRequest(deleteApi(body), reloadDataList, setSpinning);
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                Loại tag
            </Button>

            <Modal
                title="Cập nhật tag"
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
                            tagTypeRef.current = null;
                        }}
                    >
                        <PlusOutlined className="cursor-pointer" />
                        Tạo
                    </div>
                    {
                        (tagTypes || []).map(ITagType => (
                            <div key={ITagType.value} className='mt-2 w-full bg-blue-50 p-2 rounded-md flex gap-2'>
                                <div className='flex-grow'>{ITagType.label}</div>
                                <EditOutlined
                                    className="!text-blue-500 cursor-pointer"
                                    onClick={() => {
                                        setOpenEditModal(true);
                                        tagTypeRef.current = ITagType;
                                    }}
                                />
                                <DeleteOutlined
                                    className="!text-red-500 cursor-pointer"
                                    onClick={() => {
                                        handleConfirm('Xác nhận xóa loại tag ' + ITagType.label, () => handleOnDeleteOk(ITagType.value));
                                    }}
                                />
                            </div>
                        ))
                    }
                </div>
                <AdminTagTypeCreateUpdateModal
                    open={openEditModal}
                    setOpen={setOpenEditModal}
                    reloadDataList={reloadDataList}
                    tagType={tagTypeRef.current}
                />
            </Modal>
            {confirmModal}
        </>
    );
};

export default AdminPostType;