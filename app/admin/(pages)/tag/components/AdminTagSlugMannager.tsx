'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { TAG } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import { Form, Select } from 'antd';
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { slugEntityOptions } from '@/constants/options';
import { DefaultOptionType } from 'antd/es/select';

type Params = {
    tag_id?: string,
    reloadDataList?: any,
    closeModal?: any,
};

const AdminTagSlugMannager: React.FC<Params> = ({ tag_id, closeModal, reloadDataList }) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();

    const getUrl = `${TAG}/${tag_id}/edit-multiple-tag-slug`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: true,
    });

    const handleOnSubmit = async (values: any) => {
        let slugIds = [] as string[];
        slugEntityOptions.forEach(({ value }) => {
            slugIds = [...slugIds, ...(values[value] ?? [])]
        })

        const postData = {
            url: TAG + (`/${tag_id}/update-multiple-tag-slug`),
            data: {
                slugIds,
            },
        };
        await handleApiResponse(
            storeUpdateApi(postData),
            (payload: any) => {
                showSuccessToastr(payload?.message);
                reloadDataList();
            },
            setSpinning,
        );
    };

    useEffect(() => {
        if (initData) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                let formValue = {} as any;
                slugEntityOptions.forEach(({ value }) => {
                    formValue[value] = initData[value]?.filter((item: DefaultOptionType) => initData.slugIds?.includes(item.value))
                        .map((item: DefaultOptionType) => item.value);
                })
                form.setFieldsValue(formValue);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData]);

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
                    initialValues={{ is_active: 1 }}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                >
                    <div ref={divRef}>
                        {slugEntityOptions.map(({ label, value }) => (
                            <Form.Item
                                key={value}
                                name={value}
                                label={`${label}`}
                                rules={[{ required: false }]}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder={`Chọn ${label}`}
                                    options={initData?.[value] ?? []}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        ))}
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={true} />
                </Form>
            </div>
        </>
    );
};

export default AdminTagSlugMannager;
