'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { validateMessages } from '@/utils/validateRule';
import { usePostDataMutation } from '@/services/api/common';
import { responseMessages } from '@/constants/ui';
import { getUserInfo, setUserInfo } from '@/utils/authenticate';

interface Props {
    closeModal: any;
    fromAdmin?: boolean;
}

const UpdateUserInfoForm: React.FC<Props> = ({ closeModal, fromAdmin }) => {
    const [form] = Form.useForm();
    const userInfo = getUserInfo();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [storeUpdateApi] = usePostDataMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleUploadChange = (info: any) => {
        const { file } = info;

        if (file.status === 'uploading') {
            return;
        }

        if (file.originFileObj) {
            const uploadedUrl = URL.createObjectURL(file.originFileObj);
            setAvatarUrl(uploadedUrl);
            setFile(file.originFileObj);
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            messageApi.open({
                type: 'error',
                content: 'Chỉ có thể tải lên tệp hình ảnh!',
            });
            return Upload.LIST_IGNORE;
        }

        const isLt1MB = file.size < 1024 * 1024;
        if (!isLt1MB) {
            messageApi.open({
                type: 'error',
                content: 'Hình ảnh phải nhỏ hơn 1MB!',
            });
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const handleSubmit = async (values: any) => {
        const formData = new FormData();
        formData.append('full_name', values.full_name);
        if (values.email) {
            formData.append('email', String(values.email).trim());
        }
        if (values.phone) {
            formData.append('phone', String(values.phone).trim());
        }
        if (file) {
            formData.append('file', file);
        }
        const postData = {
            url: fromAdmin ? 'updateUserInfo' : 'customer/update-profile',
            data: formData,
            isFormData: true,
        }
        const payload = await storeUpdateApi(postData).unwrap();
        if (payload?.success) {
            if (userInfo) {
                setUserInfo({
                    ...userInfo,
                    full_name: payload?.data?.full_name || values.full_name,
                    name: payload?.data?.full_name || values.full_name,
                    email: payload?.data?.email ?? values.email ?? userInfo.email,
                    phone: payload?.data?.phone ?? values.phone ?? userInfo.phone,
                    avatar: payload?.data?.avatar || userInfo.avatar,
                });
            }
            messageApi.open({
                type: 'success',
                content: responseMessages.update_success,
            });
            closeModal()
        } else {
            messageApi.open({
                type: 'error',
                content: responseMessages.server_error,
            });
        }
    };

    useEffect(() => {
        if (userInfo) {
            setAvatarUrl(userInfo.avatar);
            form.setFieldValue('full_name', userInfo.full_name)
            form.setFieldValue('email', userInfo.email)
            form.setFieldValue('phone', userInfo.phone)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form
            form={form}
            layout="vertical"
            name="updateUserInfoForm"
            onFinish={handleSubmit}
            validateMessages={validateMessages}
        >
            <Form.Item label="Tải Lên Ảnh Đại Diện">
                <Upload.Dragger
                    name="avatar"
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    onChange={handleUploadChange}
                    maxCount={1}
                >
                    <div style={{ padding: 20 }}>
                        <UploadOutlined style={{ fontSize: '32px' }} />
                        <p>Kéo và thả hình ảnh hoặc nhấn để tải lên</p>
                    </div>
                </Upload.Dragger>
            </Form.Item>

            {avatarUrl && (
                <div className="flex items-center justify-center mb-5">
                    <div className="w-28 h-28 rounded-full overflow-hidden">
                        <Image
                            src={avatarUrl}
                            alt="Ảnh đại diện"
                            width={120}
                            height={120}
                            sizes="100vw"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            )}

            <Form.Item label="Họ và Tên" name="full_name" rules={[{ required: true }]}>
                <Input placeholder="Nhập họ và tên của bạn" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ type: 'email', required: false }]}> 
                <Input placeholder="Nhập email (tuỳ chọn)" />
            </Form.Item>

            <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                    {
                        validator: (_, value) => {
                            const phone = String(value || '').replace(/\D+/g, '');
                            if (!phone) return Promise.resolve();
                            if (phone.length < 9 || phone.length > 15) {
                                return Promise.reject(new Error('Số điện thoại không hợp lệ'));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input placeholder="Nhập số điện thoại (tuỳ chọn)" />
            </Form.Item>

            <Form.Item>
                <div className="flex justify-center w-full">
                    <Button className="mt-2" type="primary" htmlType="submit">
                        Cập Nhật Thông Tin
                    </Button>
                </div>
            </Form.Item>
            {contextHolder}
        </Form>
    );
};

export default UpdateUserInfoForm;
