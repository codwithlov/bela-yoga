'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { SLUG } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { getSlug, handleApiResponse } from '@/utils/helper';
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';
import { SlugPermalink } from '@/interfaces/slugPermalink';
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import { MARKET_TYPE_SLUG } from '@/constants/SlugPermalink';

type Params = {
    slug_id?: number,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminSlugUpdate: React.FC<Params> = ({
    slug_id,
    closeModal,
    reloadDataList
}) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();

    const getUrl = `${SLUG}/${slug_id}/edit`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: true,
    });

    const handleOnSubmit = async (values: any) => {
        const postData = {
            url: `${SLUG}/${slug_id}?_method=PUT`,
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
        if (initData?.slugPermalink) {
            if (initData?.error) {
                showErrorToastr(initData?.message);
                closeModal();
                reloadDataList();
            } else {
                const slugPermalink = initData?.slugPermalink as SlugPermalink
                form.setFieldsValue({ ...slugPermalink, slug: getSlug(slugPermalink) });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.slugPermalink]);

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
                            initData?.slugPermalink?.entity_type !== MARKET_TYPE_SLUG &&
                            <SeoCollapse form={form} notCheckSeo disabled />
                        }
                        <SlugPrefixSelect slugs={initData?.slugs} />
                        <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={true} />
                </Form>
            </div >
        </>
    )
}

export default AdminSlugUpdate

