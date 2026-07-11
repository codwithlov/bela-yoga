'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { handleApiResponse } from '@/utils/helper';
import { usePostDataMutation } from '@/services/api/common';
import { showSuccessToastr } from '@/utils/toastr';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { validateMessages } from '@/utils/validateRule';
import { ITagType } from '@/interfaces/tag';

type Props = {
    open: boolean;
    setOpen: any;
    reloadDataList: any;
    tagType: ITagType | null;
};

const AdminPostTypeCreateUpdateModal: React.FC<Props> = ({
    open,
    setOpen,
    reloadDataList,
    tagType,
}) => {
    const [form] = Form.useForm();
    const [postApi] = usePostDataMutation();
    const [spinning, setSpinning] = useState(false);

    const closeModal = () => setOpen(false);

    useEffect(() => {
        if (tagType && open) {
            form.setFieldsValue({
                title: tagType.label,
            });
        } else {
            form.resetFields();
        }
    }, [form, tagType, open]);

    const handleOnSubmit = async () => {
        const values = await form.validateFields();
        const postData = {
            url: 'admin-tag-type' + (!tagType ? '' : `/${tagType.value}?_method=PUT`),
            data: values,
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
                title={tagType ? "Cập nhật tag" : "Tạo tag"}
                open={open}
                width={400}
                onCancel={closeModal}
                cancelButtonProps={{ className: "!hidden" }}
                okText={tagType ? "Cập nhật" : "Tạo"}
                onOk={handleOnSubmit}
            >

                {spinning && <AdminLoading isLoading={spinning} />}

                <Form.Item name="title" label="Tên" rules={[{ required: true }]}>
                    <Input maxLength={100} />
                </Form.Item>
            </Modal>
        </Form>
    );
};

export default AdminPostTypeCreateUpdateModal;