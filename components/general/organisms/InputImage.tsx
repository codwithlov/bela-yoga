import React, { useState } from 'react';
import { Form, Upload, Image, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

type InputImageProps = {
  name: string;
  label: string;
  required?: boolean;
  initialValue?: string | string[];
  isMultiple?: boolean;
  maxFiles?: number;
};

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const InputImage: React.FC<InputImageProps> = ({
  name,
  label,
  required = false,
  initialValue,
  isMultiple = false,
  maxFiles = 5,
}) => {
  const initialFiles: UploadFile[] = Array.isArray(initialValue)
    ? initialValue.map((url, index) => ({
        uid: `-${index}`,
        name: `Image ${index + 1}`,
        status: 'done',
        url,
      }))
    : initialValue
    ? [
        {
          uid: '-1',
          name: 'Uploaded Image',
          status: 'done',
          url: initialValue,
        },
      ]
    : [];

  const [fileList, setFileList] = useState<UploadFile[]>(initialFiles || []);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      messageApi.open({
        type: 'error',
        content: 'Chỉ có thể tải lên tệp hình ảnh!',
      });
      return Upload.LIST_IGNORE;
    }

    const isLt1MB = file.size < 2048 * 1024;
    if (!isLt1MB) {
      messageApi.open({
        type: 'error',
        content: 'Hình ảnh phải nhỏ hơn 2MB!',
      });
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = (info: { fileList?: UploadFile[] }) => {
    const newFileList = Array.isArray(info.fileList) ? info.fileList : [];
    const limitedFileList = isMultiple
      ? newFileList.slice(0, maxFiles)
      : newFileList.slice(-1);
    setFileList(limitedFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      {contextHolder}
      <Form.Item
        name={name}
        label={label}
        rules={[{ required, message: `${label} is required` }]}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          onChange={handleChange}
          multiple={isMultiple}
          maxCount={maxFiles || 1}
        >
          {fileList.length >= (isMultiple ? maxFiles : 1) ? null : uploadButton}
        </Upload>
      </Form.Item>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
          alt={`author-${previewImage}`}
        />
      )}
    </>
  );
};

export default InputImage;