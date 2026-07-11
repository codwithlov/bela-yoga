'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { FEEDBACK } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { DatePicker, Form, Input } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import CommonUploadImageForm from '@/components/admin/organisms/CommonUploadImageForm';
import { TagSelect } from '@/components/admin/atoms/TagSelect';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { RatingSelect } from '@/components/admin/atoms/RatingSelect';
import dayjs from 'dayjs';

type Params = {
    feedbackId?: number,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminFeedbackCreateUpdate: React.FC<Params> = ({
    feedbackId,
    closeModal,
    reloadDataList
}) => {
    const isEdit = !!feedbackId;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();
    const [uploadedAvatar, setUploadedAvatar] = useState<any>([]);
    const [uploadedImages, setUploadedImages] = useState<any>([]);
    const [deleteImages, setDeleteImages] = useState<any>([]);

    const getUrl = `${FEEDBACK}/${(isEdit ? feedbackId + '/edit' : 'create')}`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });
    const oldFeedback = initData?.data?.feedback;

    const handleOnSubmit = async (values: any) => {
        const formData = new FormData();
        if (oldFeedback?.feedback_type !== 'GOOGLE') {
            if (uploadedAvatar[0]?.originFileObj) {
                formData.append('avatarFile', uploadedAvatar[0].originFileObj);
                if (oldFeedback?.avatar_image) {
                    formData.append('delete_files[]', oldFeedback?.avatar_image_id);
                }
            } else if (oldFeedback?.avatar_image) {
                formData.append('isEmptyAvatar', 'true');
            }

            uploadedImages?.forEach((file: any) => {
                if (file.originFileObj) {
                    formData.append('files[]', file.originFileObj);
                }
            });

            if (isEdit) {
                deleteImages?.forEach((uid: any) => {
                    formData.append('delete_files[]', uid);
                });
            }
        }

        formData.append('is_active', values.is_active ? '1' : '0');
        formData.append('content', values.content || '');
        formData.append('full_name', values.full_name);
        formData.append('rating', values.rating);
        formData.append('feedback_date', values.feedback_date);
        values.tag_ids?.forEach((id: any) => {
            formData.append('tag_ids[]', id);
        });
        const postData = {
            url: 'admin-feedback' + (isEdit ? `/${feedbackId}?_method=PUT` : ''),
            data: formData,
            isFormData: true,
        }
        await handleApiResponse(
            storeUpdateApi(postData),
            () => {
                closeModal();
                form.resetFields();
                reloadDataList();
                showSuccessToastr(isEdit ? 'update_success' : 'create_success');
            },
            setSpinning,
        );
    }

    useEffect(() => {
        const feedback = initData?.data?.feedback;
        if (feedback) {
            form.setFieldsValue(feedback);
            setUploadedImages(feedback.imageList ?? []);
            setUploadedAvatar(feedback.avatar_image ? [feedback.avatar_image] : []);
        }
    }, [form, initData?.data?.feedback]);

    return (
        <>
            {spinning && <AdminLoading isLoading={true} />}
            <div className='pb-5'>
                <DrawerLoading isLoading={isFetching} />
                <Form
                    key={'formSubmit'}
                    form={form}
                    layout="vertical"
                    onFinish={(value) => handleOnSubmit(value)}
                    validateMessages={validateMessages}
                    initialValues={{ is_active: 1, rating: 5 }}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                >
                    <div ref={divRef}>
                        <div className='flex gap-3'>
                            <TagSelect tagOptions={initData?.data?.tagOptions} rules={[{ required: true }]} className='flex-1' name='tag_ids' />
                            <ActiveSelect />
                        </div>
                        <div className='flex gap-3'>
                            <Form.Item name="full_name" label="Họ tên" className='flex-1' rules={[{ required: true }]}>
                                <Input placeholder="Họ tên" />
                            </Form.Item>
                            <RatingSelect className='w-20' />
                            <Form.Item name="feedback_date" label="Ngày đăng" rules={[{ required: true }]}>
                                <Input placeholder='3 ngày trước' />
                            </Form.Item>
                        </div>
                        <Form.Item name="content" label="Nội dung" >
                            <Input.TextArea
                                placeholder="Nội dung"
                                autoSize
                            />
                        </Form.Item>
                        {
                            oldFeedback?.feedback_type !== 'GOOGLE' && <>
                                <CommonUploadImageForm
                                    uploadedImages={uploadedAvatar}
                                    setUploadedImages={setUploadedAvatar}
                                    single
                                    title='Avatar'
                                    listType='picture-circle'
                                    className='mb-3'
                                    setDeleteImages={setDeleteImages}
                                />
                                <CommonUploadImageForm
                                    uploadedImages={uploadedImages}
                                    setUploadedImages={setUploadedImages}
                                    setDeleteImages={setDeleteImages}
                                />
                            </>
                        }
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form>
            </div>
        </>
    )
}

export default AdminFeedbackCreateUpdate

