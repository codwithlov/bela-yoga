'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { VOUCHER } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input, Select } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { IVoucher } from '@/interfaces/voucher';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import CommonUploadImageForm from '@/components/admin/organisms/CommonUploadImageForm';

type Params = {
    voucher_id?: string,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminVoucherCreateUpdate: React.FC<Params> = ({
    voucher_id,
    closeModal,
    reloadDataList
}) => {
    const isEdit = !!voucher_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const [uploadedImages, setUploadedImage] = useState<any>([]);

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();
    const getUrl = `${VOUCHER}/${(isEdit ? voucher_id + '/edit' : 'create')}`;

    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });

    const handleOnSubmit = async (values: any) => {
        const oldVoucher = initData?.voucher;
        const formData = new FormData();
        if (uploadedImages[0]?.originFileObj) {
            formData.append('imageFile', uploadedImages[0].originFileObj);
        }
        if (!uploadedImages[0]?.url && oldVoucher?.image) {
            formData.append('delete_files[]', oldVoucher?.image_id);
            formData.append('isEmptyImage', 'true');
        }

        formData.append('name', values.name);
        formData.append('is_active', values.is_active);

        values.market_ids?.forEach((id: any) => {
            formData.append('market_ids[]', id);
        });
        values.values?.forEach((id: any) => {
            formData.append('values[]', id);
        });

        const postData = {
            url: VOUCHER + (!isEdit ? '' : `/${voucher_id}?_method=PUT`),
            data: formData,
            isFormData: true,
        };
        await handleApiResponse(
            storeUpdateApi(postData),
            (payload: any) => {
                form.resetFields();
                showSuccessToastr(payload?.message);
                reloadDataList();
                closeModal();
            },
            setSpinning,
        );
    }

    useEffect(() => {
        if (initData?.voucher) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                if (isEdit) {
                    const voucher = initData.voucher as IVoucher;
                    form.setFieldsValue({ ...voucher, values: voucher.values.map(i => i.value) });
                    setUploadedImage(voucher.image ? [voucher.image] : []);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.voucher]);

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
                    initialValues={{ is_active: 0, }}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                >
                    <div ref={divRef} className='pb-1'>
                        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                            <Input placeholder='Nhập tên' />
                        </Form.Item>
                        <ActiveSelect />
                        <Form.Item name="market_ids" label="Tuyến tour">
                            <Select
                                showSearch
                                placeholder="Chọn tuyến tour"
                                options={initData?.marketOptions}
                                allowClear
                                optionFilterProp="label"
                                mode='multiple'
                            />
                        </Form.Item>
                        <CommonUploadImageForm
                            uploadedImages={uploadedImages}
                            setUploadedImages={setUploadedImage}
                            single
                            title='Ảnh hiển thị'
                            className='mb-3'
                        />
                        <Form.List
                            name="values"
                            rules={[
                                {
                                    validator: async (_, values) => {
                                        if (!values || values.length < 4) {
                                            return Promise.reject(new Error('Cần nhập ít nhất 4 giá trị'));
                                        }
                                        if (values.length % 2 !== 0) {
                                            return Promise.reject(new Error('Số lượng giá trị phải là số trẵn'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <div>
                                    <label className='font-medium mb-1.5 block'>Giá trị voucher</label>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            required={true}
                                            key={field.key}
                                            className="mb-2"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name]}
                                                    rules={[{ required: true }]}
                                                    key={field.key}
                                                    noStyle
                                                >
                                                    <Input placeholder='2 triệu' maxLength={8} />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <MinusCircleOutlined onClick={() => remove(field.name)} className="!text-red-500" />
                                                )}
                                            </div>
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            icon={<PlusOutlined />}
                                            className="w-full"
                                        >
                                            Thêm giá trị
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form >
            </div >
        </>
    )
}

export default AdminVoucherCreateUpdate
