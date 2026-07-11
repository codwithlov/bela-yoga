'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { TAG } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input, Select } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { Tag } from '@/interfaces/tag';
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { transferStringToSlug } from '@/utils/formatString';

type Params = {
    tag_id?: string,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminTagCreateUpdate: React.FC<Params> = ({
    tag_id,
    closeModal,
    reloadDataList
}) => {
    const isEdit = !!tag_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();
    const getUrl = `${TAG}/${(isEdit ? tag_id + '/edit' : 'create')}`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });

    const handleOnSubmit = async (values: any) => {
        const postData = {
            url: TAG + (!isEdit ? '' : `/${tag_id}?_method=PUT`),
            data: {
                ...values,
                slug: 'tags/' + values.slug,
                parent_id: 0,
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
        if (initData?.tag) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                if (isEdit) {
                    const tag = initData.tag as Tag;
                    form.setFieldsValue({ ...tag, ...tag.tagslug, slug: tag.tagslug?.slug?.replace('tags/', '') });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.tag]);

    const updateCanonical = () => {
        form.setFieldValue('canonical', `tags/${form.getFieldValue('slug') ?? ''}`);
    }

    const onChangeName = (e: any) => {
        form.setFieldValue('slug', transferStringToSlug(e.target.value));
        updateCanonical();
    }

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
                        <SeoCollapse form={form} notCheckSeo notShowKeyword />
                        <div className='grid grid-cols-4 gap-3'>
                            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                                <Input onChange={onChangeName} placeholder='Du lịch nhật bản' />
                            </Form.Item>

                            <Form.Item name="tag_type_id" label="Loại tag" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Chọn loại tag"
                                    options={initData?.tagTypes}
                                />
                            </Form.Item>
                            <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                                <Input addonBefore="tags/" onChange={updateCanonical} />
                            </Form.Item>
                            <ActiveSelect />
                        </div>
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form >
            </div >
        </>
    )
}

export default AdminTagCreateUpdate
