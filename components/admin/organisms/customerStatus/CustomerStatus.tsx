'use client';

import React, { useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import useCheckPermission from '@/hooks/useCheckPermission';
import { PostType } from '@/interfaces/post';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { handleApiRequest } from '@/utils/helper';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { useDeleteMutation } from '@/services/api/common';
import CustomerStatusCreateUpdateModal from './CustomerStatusCreateUpdateModal';

type Props = {
    customerStatusOptions: any;
    reloadDataList: any;
    type: string;
};

const CustomerStatus: React.FC<Props> = ({
    customerStatusOptions,
    reloadDataList,
    type
}) => {
    const [open, setOpen] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const customerStatusRef = useRef<PostType | null>(null);
    const closeDrawer = () => { setOpen(false); };
    const checkPermission = useCheckPermission();
    const { handleConfirm, confirmModal } = useConfirm();
    const [deleteApi] = useDeleteMutation();

    if (!checkPermission(type + '_UPDATE')) {
        return null;
    }

    const handleOnDeleteOk = async (id: number) => {
        const body = {
            url: 'admin-customer-status/' + id,
            data: { type }
        }
        await handleApiRequest(deleteApi(body), reloadDataList, setSpinning);
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                Trạng thái khách
            </Button>

            <Modal
                title="Cập nhật trạng thái"
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
                            customerStatusRef.current = null;
                        }}
                    >
                        <PlusOutlined className="cursor-pointer" />
                        Tạo
                    </div>
                    {
                        (customerStatusOptions || []).map((customerStatus: any) => (
                            <div key={customerStatus.value} className='mt-2 w-full bg-blue-50 p-2 rounded-md flex gap-2'>
                                <div className='flex-grow'>{customerStatus.label}</div>
                                <EditOutlined
                                    className="!text-blue-500 cursor-pointer"
                                    onClick={() => {
                                        setOpenEditModal(true);
                                        customerStatusRef.current = customerStatus;
                                    }}
                                />
                                <DeleteOutlined
                                    className="!text-red-500 cursor-pointer"
                                    onClick={() => {
                                        handleConfirm('Xác nhận xóa trạng thái ' + customerStatus.label, () => handleOnDeleteOk(customerStatus.value));
                                    }}
                                />
                            </div>
                        ))
                    }
                </div>
                <CustomerStatusCreateUpdateModal
                    open={openEditModal}
                    setOpen={setOpenEditModal}
                    reloadDataList={reloadDataList}
                    customerStatus={customerStatusRef.current}
                    type={type}
                />
            </Modal>
            {confirmModal}
        </>
    );
};

export default CustomerStatus;