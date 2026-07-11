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

type Params = {
    result_id?: string,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminCustomerCreateUpdate: React.FC<Params> = ({
    result_id,
    closeModal,
    reloadDataList
}) => {
    const isEdit = !!result_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();
    const voucherId = Form.useWatch('voucher_id', form);

    const { data: voucherValuesData, isFetching: fetchingValues } = useGetDataQuery(`${VOUCHER}/get-voucher-values/${voucherId}`, {
        refetchOnMountOrArgChange: !!isEdit,
        skip: !voucherId,
    });

    const getUrl = `${VOUCHER}/${(isEdit ? result_id + '/edit-fake-result' : 'create-fake-result')}`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });

    const handleOnSubmit = async (values: any) => {
        const postData = {
            url: VOUCHER + (isEdit ? `/${result_id}/update-fake-result` : '/store-fake-result'),
            data: {
                ...values,
            },
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
        if (initData?.voucherResult) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                if (isEdit) {
                    const result = initData.voucherResult;
                    form.setFieldsValue({
                        full_name: result.customer?.name,
                        phone: result.customer?.phone,
                        value: result.voucher_value,
                        voucher_id: result.voucher_id,
                    });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.voucherResult]);

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
                    initialValues={{ is_active: 1, }}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                >
                    <div ref={divRef} className='pb-1'>
                        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                            <Input placeholder='Nhập số điện thoại' disabled={isEdit} />
                        </Form.Item>
                        <Form.Item name="full_name" label="Tên">
                            <Input placeholder='Nhập tên' />
                        </Form.Item>
                        <Form.Item name="voucher_id" label="Voucher" rules={[{ required: true }]}>
                            <Select
                                disabled={isEdit}
                                showSearch
                                placeholder="Chọn voucher"
                                options={initData?.voucherOptions}
                                optionFilterProp="label"
                            />
                        </Form.Item>
                        {
                            voucherId &&
                            <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Chọn giá trị"
                                    options={voucherValuesData?.valueOptions}
                                    loading={fetchingValues}
                                />
                            </Form.Item>
                        }

                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form >
            </div >
        </>
    )
}

export default AdminCustomerCreateUpdate
