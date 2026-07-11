'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Popover, Select } from 'antd';
import { handleApiResponse } from '@/utils/helper';
import { usePostDataMutation } from '@/services/api/common';
import { showSuccessToastr } from '@/utils/toastr';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { validateMessages } from '@/utils/validateRule';
import { PostType } from '@/interfaces/post';
import { ITagType } from '@/interfaces/tag';
import { InfoCircleOutlined } from '@ant-design/icons';
type Props = {
    open: boolean;
    setOpen: any;
    reloadDataList: any;
    postType: PostType | null;
    tagTypes: ITagType[];
};

const AdminPostTypeCreateUpdateModal: React.FC<Props> = ({
    open,
    setOpen,
    reloadDataList,
    postType,
    tagTypes,
}) => {
    const [form] = Form.useForm();
    const [postApi] = usePostDataMutation();
    const [spinning, setSpinning] = useState(false);

    const closeModal = () => setOpen(false);

    useEffect(() => {
        if (postType && open) {
            form.setFieldsValue({
                title: postType.label,
                slug: postType.slug,
                tag_type_id: postType.tag_type_id,
            });
        } else {
            form.resetFields();
        }
    }, [form, postType, open]);

    const handleOnSubmit = async () => {
        const values = await form.validateFields();
        const postData = {
            url: 'admin-post-type' + (!postType ? '' : `/${postType.value}?_method=PUT`),
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
                title={postType ? "Cập nhật chuyên mục" : "Tạo chuyên mục"}
                open={open}
                width={400}
                onCancel={closeModal}
                cancelButtonProps={{ className: "!hidden" }}
                okText={postType ? "Cập nhật" : "Tạo"}
                onOk={handleOnSubmit}
            >

                {spinning && <AdminLoading isLoading={spinning} />}

                <Form.Item name="title" label="Tên" rules={[{ required: true }]}>
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item
                    name="tag_type_id"
                    label={
                        <>
                            <label>Tag Liên kết</label>
                            <Popover
                                content={
                                    <div className="w-96">
                                        <p>Tag sẽ được lọc theo tag liên kết được chọn cho chuyên mục này khi thêm hoặc cập nhật bài viết</p>
                                    </div>
                                }
                                placement="bottom"
                                className="cursor-pointer w-full h-full flex items-center justify-center">
                                <InfoCircleOutlined className='ml-1' />
                            </Popover>
                        </>
                    }
                >
                    <Select
                        placeholder="Chọn loại tag"
                        options={tagTypes}
                    />
                </Form.Item>
            </Modal>
        </Form>
    );
};

export default AdminPostTypeCreateUpdateModal;