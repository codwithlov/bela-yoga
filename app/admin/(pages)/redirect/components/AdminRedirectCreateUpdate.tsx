'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { REDIRECT } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input, Select, Switch } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { Role } from '@/interfaces/role';
import { Redirect } from '@/interfaces/redirect';
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';

type Params = {
    redirect_id?: string,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminRedirectCreateUpdate: React.FC<Params> = ({
    redirect_id,
    closeModal,
    reloadDataList
}) => {
    const isEdit = !!redirect_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const isSwitchOn = Form.useWatch('is_switch_on', form)

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();

    const getUrl = `${REDIRECT}/${(isEdit ? redirect_id + '/edit' : 'create')}`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });

    const roles = (initData?.roles || []).map((item: Role) => ({
        value: item?.id,
        label: item?.name,
    }));

    const handleOnSubmit = async (values: any) => {
        const postData = {
            url: REDIRECT + (!isEdit ? '' : `/${redirect_id}?_method=PUT`),
            data: values,
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
        if (initData?.redirect) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                if (isEdit) {
                    const redirect = initData.redirect as Redirect;
                    form.setFieldsValue({ ...redirect, is_switch_on: !!redirect.url_to });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.redirect]);

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
                    initialValues={{ status: 301, }}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                >
                    <div ref={divRef}>

                        <Form.Item name="status" label="Trạng thái" className="mb-4">
                            <Select
                                style={{ width: 80 }}
                                options={[
                                    { value: 301, label: '301' },
                                    { value: 302, label: '302' },
                                    { value: 303, label: '303' },
                                    { value: 304, label: '304' },
                                    { value: 305, label: '305' },
                                    { value: 306, label: '306' },
                                    { value: 307, label: '307' },
                                    { value: 308, label: '308' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="url_from" label="Từ url" rules={[{ required: true }]}>
                            <Input maxLength={100} />
                        </Form.Item>

                        {isSwitchOn ? (
                            <Form.Item name="url_to" label="Đến url" rules={[{ required: true }]}>
                                <Input placeholder='Nhập đường dẫn' />
                            </Form.Item>
                        ) : (
                            <SlugPrefixSelect
                                slugs={initData?.slugs}
                                name='slug_permalink_id'
                                label='Đến slug'
                                rules={[{ required: true }]}
                            />
                        )}

                        <Form.Item name="is_switch_on" label="Url khác" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form>
            </div >
        </>
    )
}

export default AdminRedirectCreateUpdate
