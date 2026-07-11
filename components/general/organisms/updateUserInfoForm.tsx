'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { validateMessages } from '@/utils/validateRule';
import { usePostDataMutation } from '@/services/api/common';
import { responseMessages } from '@/constants/ui';
import { getUserInfo } from '@/utils/authenticate';

interface Props {
    closeModal: any;
}

const UpdateUserInfoForm: React.FC<Props> = ({ closeModal }) => {
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
        formData.append('fullName', values.fullName);
        if (file) {
            formData.append('file', file);
        }
        const postData = {
            url: 'updateUserInfo',
            data: formData,
            isFormData: true,
        }
        const payload = await storeUpdateApi(postData).unwrap();
        if (payload?.success) {
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
            <Form.Item label="Tải Lên Ảnh Đại Diện" name="avatar">
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
