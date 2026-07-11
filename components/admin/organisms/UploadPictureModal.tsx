'use client';

import { Button, Modal, Upload, Spin, Divider } from 'antd';
import { PlusOutlined, UndoOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import type { UploadFile, UploadProps } from 'antd';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import { useDeleteImageMutation, useGetImagesQuery } from '@/services/api/images';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { GALLERY_IMAGE } from '@/constants/route';
import { useConfirm } from '../atoms/useConfirm';
import { usePostDataMutation } from '@/services/api/common';
import PreviewImage from './PreviewImage';
import { getBase64 } from '@/utils/helper';
import Image from 'next/image';

interface Props {
  openImageModal?: boolean,
  setOpenImageModal: (open: boolean) => void,
  type: string,
  id: string,
  refetchList?: () => void,
}

const UploadPictureModal = (props: Props) => {
  const { openImageModal, setOpenImageModal, type, id, refetchList } = props;
  const { handleConfirm, confirmModal } = useConfirm();

  // State to manage gallery images
  const [galleryList, setGalleryList] = useState<UploadFile[] | any>();
  const [openPreview, setOpenPreview] = useState(false);
  const [currentImage, setCurrentImage] = useState(-1);
  const currentId = useRef<any>(null);

  // State to manage uploaded files and loading status
  const [fileList, setFileList] = useState<UploadFile[] | any>();
  const [fileUploadList, setFileUploadList] = useState<UploadFile[] | any>([]);
  const [deletedImages, setDeletedImages] = useState<UploadFile[]>([]);
  const [loadingImage, setLoadingImage] = useState<Boolean>(false);

  const [postApi] = usePostDataMutation();

  // Fetch gallery images based on type and id
  const { data: galleryImages, isFetching, refetch } = useGetImagesQuery(
    { type: type, id: id },
    { refetchOnMountOrArgChange: true, skip: !id || !openImageModal }
  );

  // Mutation hook for deleting images
  const [deleteImage] = useDeleteImageMutation();

  useEffect(() => {
    if (galleryImages && !isFetching && openImageModal) {
      if (galleryImages?.error) {
        showErrorToastr(galleryImages?.message);
        refetchList && refetchList();
        setOpenImageModal(false);
      } else {
        setFileList(galleryImages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryImages, openImageModal, isFetching]);

  useEffect(() => {
    if (!openImageModal) {
      setFileList([]);
      setFileUploadList([]);
      setDeletedImages([]);
      currentId.current = id;
    } else {
      if (id === currentId.current) {
        refetch();
      }
    }
  }, [id, openImageModal, refetch]);

  // Preview an image from the gallery
  const handlePreviewGallery = async (file: any, list: any) => {
    let index = list?.map((fItem: any) => fItem.uid).indexOf(file.uid);
    setGalleryList(list);
    setCurrentImage(index);
    setOpenPreview(true);
  };

  // Upload properties and validation
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const fileType = file.type;
      const typeAllowUload = ['image/png', 'image/jpeg', 'image/webp'];
      if (!typeAllowUload.includes(fileType)) {
        showErrorToastr(`${file.name} không đúng định dạng hình ảnh`);
        return Upload.LIST_IGNORE;
      }
      if (file.size > 1 * 1024 * 1024) { // 1 MB in bytes
        showErrorToastr(`${file.name} kích thước quá lớn, vui lòng chọn file nhỏ hơn 1MB`);
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onChange: ({ fileList: newFileList }) => {
      newFileList.map(async (item: any) => {
        if (!item.url && !item.preview) {
          item.preview = await getBase64(item.originFileObj);
        }
        return item;
      })
      setFileUploadList(newFileList);
    }
  };

  // Button for triggering file upload
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // Handle the image upload process
  const handleSave = async () => {
    setLoadingImage(true);
    try {
      if (deletedImages.length > 0) {
        await handleSaveDeletions();
      }
      if (fileUploadList.length === 0) return;
      const formData = new FormData();
      fileUploadList?.forEach((file: any) => {
        formData.append('file[]', file.originFileObj);
      });

      const uploadUrl = `${GALLERY_IMAGE}/upload-images/${type}/${id}`;
      const postData = {
        url: uploadUrl,
        data: formData,
        isFormData: true,
      }
      const result = await postApi(postData).unwrap();
      if (result?.success) {
        setFileUploadList([]);
        showSuccessToastr('store_success');
      } else {
        showErrorToastr(result?.message || 'server_error');
      }
    }
    catch (error: any) {
      showErrorToastr(error?.data?.message || 'update_failed');
    } finally {
      setLoadingImage(false);
      refetch();
    }
  }

  // Remove a file from the upload list
  const handleRemove = (file: any) => {
    setFileUploadList((fileUploadList: any) => fileUploadList.filter((f: any) => f.uid !== file.uid));
    return true;
  };

  const handleDelete = (file: UploadFile) => {
    setDeletedImages((prev) => [...prev, file]);
    setFileList((prev: any) => prev.filter((img: any) => img.uid !== file.uid));
  };

  const handleRestoreImage = (file: UploadFile) => {
    setFileList((prev: any) => [...prev, file]);
    setDeletedImages((prev) => prev.filter((img) => img.uid !== file.uid));
  };

  const onSaveClicked = () => {
    if (deletedImages.length > 0) {
      handleConfirm('Xác nhận xóa hình ảnh đã chọn', () => handleSave(), 'OK');
    } else {
      handleSave();
    }
  }

  const handleSaveDeletions = async () => {
    setLoadingImage(true);
    const ids = deletedImages.map((file) => file.uid).join(',');
    await deleteImage({ ids, type })
      .unwrap()
      .then((payload: any) => {
        if (payload?.success) {
          showSuccessToastr('delete_success');
          setDeletedImages([]);
        }
      })
      .catch((error: any) => {
        if (error?.status) {
          showErrorToastr(error?.data.message);
        }
      })
    setLoadingImage(false);
    refetch();
  }

  return (
    <section>
      <AdminLoading isLoading={loadingImage} />

      <Modal
        key={`modal${type}${id}`}
        title={'Hình ảnh'}
        centered
        open={openImageModal}
        onOk={() => setOpenImageModal(false)}
        onCancel={() => setOpenImageModal(false)}
        width={650}
        cancelButtonProps={{ className: "!hidden" }}
        okButtonProps={{ className: "!hidden" }}
      >
        {isFetching ? <Spin /> :
          <Upload
            key={`savedImage${type}${id}`}
            className='sgt_ant_upload !pt-5'
            listType="picture-card"
            fileList={fileList}
            onPreview={(file) => handlePreviewGallery(file, fileList)}
            onRemove={handleDelete}
          />}
        {deletedImages.length > 0 && (
          <div className="transition-all duration-300">
            <Divider className='!mb-3' />
            <h4 className='font-semibold mb-2'>Ảnh chọn xóa</h4>
            <div className="flex flex-wrap gap-2">
              {deletedImages.map((file: any) => (
                <div key={file.uid} className="relative group overflow-hidden rounded-lg w-[102px] h-[102px] border">
                  <Image
                    src={file.url || file.thumbUrl}
                    alt="Deleted Image"
                    width={102}
                    height={102}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-80 transition-opacity">
                    <Button
                      type="text"
                      icon={<UndoOutlined style={{ color: 'white' }} />}
                      onClick={() => handleRestoreImage(file)}
                    />

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <Divider />
        <div className='mt-4'>
          <Upload
            key={`uploadImage${type}${id}`}
            className='sgt_ant_upload'
            {...uploadProps}
            fileList={fileUploadList}
            listType="picture-card"
            onPreview={(file) => handlePreviewGallery(file, fileUploadList)}
            onRemove={handleRemove}
            multiple
          >
            {uploadButton}
          </Upload>
        </div>

        <div className='flex justify-end pt-5'>
          <Button
            disabled={fileUploadList?.length === 0 && deletedImages.length === 0}
            type={'primary'}
            icon={<PlusOutlined />}
            onClick={onSaveClicked}>
            Lưu
          </Button>
        </div>

        {confirmModal}
        <PreviewImage
          openPreview={openPreview}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          setOpenPreview={setOpenPreview}
          galleryList={galleryList}
        />
      </Modal>
    </section>
  );
}

export default UploadPictureModal;
