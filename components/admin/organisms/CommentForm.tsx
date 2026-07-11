'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { COMMENT } from '@/constants/route';
import { showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Col, DatePicker, Form, Input, Select, Switch } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { clickClassButton, handleApiResponse, validateDateBeforeToday } from '@/utils/helper';
import CommonUploadImageForm from './CommonUploadImageForm';
import { formatDateTime } from '@/utils/formatDate';
import dayjs from 'dayjs';
import { RatingSelect } from '../atoms/RatingSelect';

type Params = {
    isEdit: boolean;
    marketId: string;
    closeModal: any;
    comment: any;
}

const CommentForm: React.FC<Params> = ({
    isEdit = false,
    marketId,
    closeModal,
    comment
}) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const isSwitchOn = Form.useWatch('is_switch_on', form)
    const [uploadedImages, setUploadedImages] = useState<any>([]);
    const [deleteImages, setDeleteImages] = useState<any>([]);

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();

    const getUrl = `${COMMENT}/create?entity_type=market`;
    const { data: initData, isFetching, refetch } = useGetDataQuery(getUrl);

    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue({
                ...comment,
                publish_date: dayjs(comment.publish_date ?? comment.created_at ?? '')
            });
            const listImgs = (comment.images ?? []).map((url: string, index: any) => ({
                uid: comment.imageIds?.[index] ?? '',
                url: url,
            })
            );

            setUploadedImages(listImgs)
        }
    }, [isEdit, comment, form]);

    const handleOnSubmit = async (values: any) => {
        const formData = new FormData();

        if (isEdit) {
            formData.append('is_active', values.is_active == true ? '1' : '0');
        };

        uploadedImages?.forEach((file: any) => {
            formData.append('file[]', file.originFileObj || file.url);
        });

        if (deleteImages) {
            deleteImages?.forEach((uid: any) => {
                formData.append('delete_files[]', uid);
            });
        }

        formData.append('entity_id', marketId);
        formData.append('entity_type', 'market');
        formData.append('content', values.content || '');
        formData.append('rating', values.rating);
        formData.append('publish_date', formatDateTime(values.publish_date));
        formData.append('fromAdmin', 'true');
        if (!isSwitchOn) {
            formData.append('user_id', values.user_id);
        } else {
            formData.append('full_name', values.full_name);
        }

        const postData = {
            url: 'admin-comment' + (isEdit ? `/${comment.id}?_method=PUT` : ''),
            data: formData,
            isFormData: true,
        }
        await handleApiResponse(
            storeUpdateApi(postData),
            () => {
                closeModal();
                form.resetFields();
                setUploadedImages([]);
                if (isSwitchOn) {
                    refetch();
                }
                clickClassButton('hidden-refetch-comment-btn');
                showSuccessToastr(isEdit ? 'update_success' : 'create_success');
            },
            setSpinning,
        );
    }

    return (
        <>
            {spinning && <AdminLoading isLoading={true} />}
            <div className='pb-5'>
                <DrawerLoading isLoading={isFetching} />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(value) => handleOnSubmit(value)}
                    validateMessages={validateMessages}
                    initialValues={{ rating: 5, }}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                >
                    <div ref={divRef}>
                        <Col span={4}>
                            <RatingSelect />
                        </Col>
                        <Form.Item name="is_switch_on" label="Người dùng khác" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        {isSwitchOn ? (
                            <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true }]}>
                                <Input maxLength={100} placeholder="Nhập họ tên" />
                            </Form.Item>
                        ) : (
                            <Form.Item name="user_id" label="Chọn người dùng" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Chọn người dùng"
                                    options={initData?.data?.users}
                                    loading={!initData?.data?.users}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        )}
                        <Form.Item name="publish_date" label="Ngày hiển thị" rules={[
                            { required: true }, { validator: validateDateBeforeToday },
                        ]}>
                            <DatePicker className="w-full" placeholder='Ngày hiển thị' format='DD/MM/YYYY' />
                        </Form.Item>
                        <Form.Item name="content" label="Nội dung" className='w-100'>
                            <Input.TextArea
                                placeholder="Nhập nội dung"
                                rows={3}
                            />
                        </Form.Item>
                        <Form.Item name="is_active" label="Cho phép hiển thị" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <CommonUploadImageForm
                            uploadedImages={uploadedImages}
                            setUploadedImages={setUploadedImages}
                            setDeleteImages={setDeleteImages}
                        />
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form>
            </div>
        </>
    )
}

export default CommentForm

