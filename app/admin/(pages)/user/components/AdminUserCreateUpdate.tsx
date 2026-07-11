'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { USER } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input, Select } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { Role } from '@/interfaces/role';
import { ADMIN_ROLE_NAME } from '@/constants/user';
import { IUser } from '@/interfaces/user';

type Params = {
    user_id?: string,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminUserCreateUpdate: React.FC<Params> = ({
    user_id,
    closeModal,
    reloadDataList
}) => {
    const isEdit = !!user_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();

    const getUrl = `${USER}/${(isEdit ? user_id + '/edit' : 'create')}`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });

    const roles = (initData?.roles || []).map((item: Role) => ({
        value: item?.id,
        label: item?.name,
    }));

    const handleOnSubmit = async (values: any) => {
        const postData = {
            url: USER + (!isEdit ? '' : `/${user_id}?_method=PUT`),
            data: values,
        };
        await handleApiResponse(
            storeUpdateApi(postData),
            (payload: any) => {
                showSuccessToastr(payload?.message);
                reloadDataList();
                closeModal();
            },
            setSpinning,
        );
    }

    useEffect(() => {
        if (initData?.user) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                if (isEdit) {
                    const user = initData.user as IUser;
                    form.setFieldsValue(
                        { is_active: user?.is_active, 
                          roles: user?.roles.map((item) => item.id) });
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.user]);

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
                    <div ref={divRef}>
                        {
                            !isEdit && <>
                                <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true }]}>
                                    <Input maxLength={100} />
                                </Form.Item>
                                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="phone" label="Số điện thoại">
                                    <Input maxLength={12} />
                                </Form.Item>
                                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                                    <Input.Password placeholder="Nhập mật khẩu" maxLength={30} />
                                </Form.Item>
                            </>
                        }
                        {(!isEdit || initData?.user?.role === ADMIN_ROLE_NAME) &&
                            <Form.Item name="roles" label={'Vai trò'} rules={[{ required: true }]}>
                                <Select
                                    placeholder="Chọn vai trò"
                                    options={roles}
                                    mode="multiple"
                                />
                            </Form.Item>
                        }
                        <Form.Item name="is_active" label={'Kích hoạt'}>
                            <Select
                                options={[
                                    { value: 1, label: 'Kích hoạt' },
                                    { value: 0, label: 'Không kích hoạt' }
                                ]}
                            />
                        </Form.Item>
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form>
            </div >
        </>
    )
}

export default AdminUserCreateUpdate

