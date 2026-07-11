'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { handleApiResponse } from '@/utils/helper';
import { usePostDataMutation } from '@/services/api/common';
import { showSuccessToastr } from '@/utils/toastr';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { validateMessages } from '@/utils/validateRule';

type Props = {
    open: boolean;
    setOpen: any;
    reloadDataList: any;
    customerStatus: any;
    type: string;
};

const AdminPostTypeCreateUpdateModal: React.FC<Props> = ({
    open,
    setOpen,
    reloadDataList,
    customerStatus,
    type,
}) => {
    const [form] = Form.useForm();
    const [postApi] = usePostDataMutation();
    const [spinning, setSpinning] = useState(false);

    const closeModal = () => setOpen(false);

    useEffect(() => {
        if (customerStatus && open) {
            form.setFieldsValue({
                status: customerStatus.label,
            });
        } else {
            form.resetFields();
        }
    }, [form, customerStatus, open]);

    const handleOnSubmit = async () => {
        const values = await form.validateFields();
        const postData = {
            url: 'admin-customer-status' + (!customerStatus ? '' : `/${customerStatus.value}?_method=PUT`),
            data: {
                ...values,
                type
            },
        };
        await handleApiResponse(
            postApi(postData),
            (payload: any) => {
                closeModal();
                showSuccessToastr(payload?.message);
                reloadDataList();
            },
            setSpinning,
        );
    }

    return (
        <Form
            form={form}
            layout="vertical"
            validateMessages={validateMessages}
        >
            <Modal
                title={customerStatus ? "Cập nhật trạng thái" : "Tạo trạng thái"}
                open={open}
                width={400}
                onCancel={closeModal}
                cancelButtonProps={{ className: "!hidden" }}
                okText={customerStatus ? "Cập nhật" : "Tạo"}
                onOk={handleOnSubmit}
            >

                {spinning && <AdminLoading isLoading={spinning} />}

                <Form.Item name="status" label="Tên" rules={[{ required: true }]}>
                    <Input maxLength={100} />
                </Form.Item>
            </Modal>
        </Form>
    );
};

export default AdminPostTypeCreateUpdateModal;