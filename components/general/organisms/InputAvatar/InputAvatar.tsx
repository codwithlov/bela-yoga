import React, { useEffect, useState } from 'react';
import { Upload, Image, message, UploadFile, UploadProps, GetProp } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

export type imgType = {
  uid: string;
  name: string;
  status: string;
  url: string;
};

type InputAvatarProps = {
  src?: string;
  isMultiple?: boolean;
  maxFiles?: number;
  onChange?: (fileList: UploadFile[]) => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const InputAvatar: React.FC<InputAvatarProps> = ({
  src,
  isMultiple = false,
  maxFiles = 5,
  onChange,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    let initVal: UploadFile = {
      uid: '-1',
      name: 'Uploaded Image',
      status: 'done', 
      url: '', 
    };
    
    if (src) {
      initVal = {
        ...initVal,
        url: src,
      };
      setFileList([initVal]); 
    }

  }, [src]);;

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      messageApi.error('Chỉ có thể tải lên tệp hình ảnh!');
      return Upload.LIST_IGNORE;
    }

    const isLt2MB = file.size < 2 * 1024 * 1024; // Ensure the image is less than 2MB
    if (!isLt2MB) {
      messageApi.error('Hình ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (onChange) {
      onChange(newFileList); // Update parent component with new file list
    }
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
      <ImgCrop rotationSlider cropShape="round">
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
      </ImgCrop>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
          alt={`author-${previewImage}`}
        />
      )}
    </>
  );
};

export default InputAvatar;