'use client';
import React, { useEffect, useState } from 'react';
import { message, Upload, Image as AntdImage } from 'antd';
import { getBase64 } from '@/utils/helper';
import { PlusOutlined } from '@ant-design/icons';
import { UploadListType } from 'antd/es/upload/interface';

type Params = {
    uploadedImages: any,
    setUploadedImages: any,
    setDeleteImages?: any,
    single?: boolean,
    title?: string,
    listType?: UploadListType,
    className?: string,
};

const CommonUploadImageForm: React.FC<Params> = ({
    uploadedImages,
    setUploadedImages,
    setDeleteImages,
    single = false,
    listType = 'picture-card',
    title = 'Hình ảnh',
    className = '',
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleUpload = async ({ fileList }: { fileList: any }) => {
        fileList.map(async (item: any) => {
            if (!item.url && !item.preview) {
                item.preview = await getBase64(item.originFileObj);
            }
            return item;
        })

        const validFiles = fileList.filter(Boolean);

        setUploadedImages(single ? validFiles.slice(-1) : validFiles);
    };

    const handleRemove = (file: any) => {
        setUploadedImages((fileUploadList: any) => fileUploadList.filter((f: any) => f.uid !== file.uid));

        if (setDeleteImages) {
            setDeleteImages((prevFileList: any) => {
                if (file.uid && file.url) {
                    return [...prevFileList, file.uid];
                }
                return prevFileList;
            });
        }
        return true;
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    return (
        <div className={className}>
            <div className='mb-1'>
                <label title={title} style={{ lineHeight: '22px', fontSize: '14px' }}>
                    {title}
                </label>
            </div>
            <Upload
                onChange={handleUpload}
                onPreview={handlePreview}
                onRemove={handleRemove}
                className='cursor-pointer mt-2'
                multiple={!single}
                fileList={uploadedImages}
                listType={listType}
                beforeUpload={(file) => {
                    const fileType = file.type;
                    const typeAllowUload = ['image/png', 'image/jpeg', 'image/webp'];
                    if (!typeAllowUload.includes(fileType)) {
                        messageApi.open({
                            type: 'error',
                            content: `${file.name} không đúng định dạng hình ảnh`,
                        });
                        return Upload.LIST_IGNORE;
                    }

                    if (file.size > 1 * 1024 * 1024) {
                        messageApi.open({
                            type: 'error',
                            content: `${file.name} vượt quá kích thước tối đa 1MB`,
                        });
                        return Upload.LIST_IGNORE;
                    }
                    return true;
                }}
            >
                <button style={{ border: 0, background: 'none' }} type="button">
                    <PlusOutlined />
                    <div className='mt-2'>Upload</div>
                </button>
            </Upload>
            {
                previewImage && (
                    <AntdImage
                        alt='previewImage'
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible: any) => setPreviewOpen(visible),
                            afterOpenChange: (visible: any) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )
            }
            {contextHolder}
        </div>
    )
}

export default CommonUploadImageForm

