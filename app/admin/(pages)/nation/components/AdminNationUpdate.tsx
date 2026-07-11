'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { NATION } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, message } from 'antd'
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { commonCkeditorTabFields } from '@/constants/ui';
import CkeditorTabs from '@/components/admin/organisms/CkeditorTabs';
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import SeoWarningBtn from '@/components/admin/molecules/SeoWarningBtn';
import AdminNationBaseFields from './AdminNationBaseFields';
import { getSlug } from '@/utils/helper';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { autoSave } from '@/utils/localStorage';
import AutoSaveBtn from '@/components/admin/molecules/AutoSaveBtn';
import { SEO_CONDITION_COUNT } from '@/constants/Post';
import { AUTO_SAVE_DRAFT_TIME } from '@/constants/api';

type Params = {
    nation_id?: string,
    reloadDataList?: any,
}
const AdminNationUpdate: React.FC<Params> = ({
    nation_id,
    reloadDataList
}) => {
    const localStorageName = 'nation' + nation_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const [nationData, setNationData] = useState<any>(null);
    const [histories, setHistories] = useState([]);

    const { handleConfirm, confirmModal } = useConfirm();
    const [messageApi, contextHolder] = message.useMessage();

    const seoCollapseScore = useRef<number>(0);
    const seoWarningScore = useRef<number>(0);
    const isActive = useRef(1);
    const isChanged = useRef(false);
    const divRef = useRef<HTMLDivElement>(null);

    const { data: initData, isFetching } = useGetDataQuery(`${NATION}/${nation_id}/edit`, {
        refetchOnMountOrArgChange: true,
    });

    const [storeUpdateApi] = usePostDataMutation();
    useEffect(() => {
        if (initData?.nation) {
            if (initData?.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
            }
            isActive.current = initData?.nation?.is_active;
            setNationData(initData?.nation);
            setHistories(initData?.nation?.histories);
            form.setFieldsValue({
                ...initData?.nation,
                ...initData?.slugPermalink,
                nation_slug: getSlug(initData?.slugPermalink),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData]);

    const getFormValue = useCallback((name: any) => {
        const value = form.getFieldValue(name);
        return value !== undefined ? value : (nationData?.[name] || '');
    }, [form, nationData])

    const handleOnSubmit = useCallback(async (isAutoSave = false) => {
        if (!isChanged.current && isAutoSave) return;
        let values = !isAutoSave ? await form.validateFields() : form.getFieldsValue();
        if (!values.meta_title && !isAutoSave) {
            showErrorToastr('fill_required_infomation');
            return;
        }
        const submit = async () => {
            isChanged.current = false;
            values = {
                ...values,
                ...commonCkeditorTabFields.reduce((acc, { key }) => ({
                    ...acc,
                    [key]: getFormValue(key),
                }), {})
            }
            if (isAutoSave) {
                autoSave(localStorageName, values);
                messageApi.open({
                    type: 'success',
                    content: 'Đã tự động lưu thông tin vào bộ nhớ tạm',
                });
                return;
            }
            setSpinning(true);
            const formData = {
                url: NATION + `/${nation_id}?_method=PUT`,
                data: {
                    ...values,
                    updated_at: nationData?.updated_at,
                    seo_score: (seoWarningScore.current + seoCollapseScore.current)/SEO_CONDITION_COUNT * 100,
                },
            }
            isActive.current = values.is_active;

            await storeUpdateApi(formData)
                .unwrap()
                .then((payload: any) => {
                    if (payload?.success) {
                        localStorage.removeItem(localStorageName);
                        showSuccessToastr(payload?.message);
                        reloadDataList();
                        setHistories(payload.data.histories);
                    }
                })
                .catch((error: any) => {
                    if (error?.status) {
                        showErrorToastr(error?.data.message);
                    }
                })
            setSpinning(false);
        }
        if (values.is_active === 0 && isActive.current === 1 && !isAutoSave) {
            handleConfirm('Xác nhận đổi trạng thái, link của bài viết sẽ không còn trỏ tới bài khác', submit, 'OK');
        } else {
            submit();
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form, nation_id, nationData?.updated_at, getFormValue]
    )

    useEffect(() => {
        const interval = setInterval(() => {
            handleOnSubmit(true);
        }, AUTO_SAVE_DRAFT_TIME);

        return () => clearInterval(interval);
    }, [handleOnSubmit]);

    const updateCanonical = () => {
        const parentSlug = (initData?.slugs || []).find((v: any) => v.id === form.getFieldValue('parent_id'))?.slug;
        form.setFieldValue('canonical', `${parentSlug ?? ''}${parentSlug ? '/' : ''}${form.getFieldValue('nation_slug') ?? ''}`);
    }

    const restore = (values: any) => {
        setNationData(values);
        form.setFieldsValue(values);
    }

    return (
        <>
            {spinning && <AdminLoading isLoading={true}></AdminLoading>}
            <div className='pb-5'>
                <DrawerLoading isLoading={isFetching} />
                <Form
                    key={'formSubmit'}
                    form={form}
                    layout="vertical"
                    onFinish={() => handleOnSubmit()}
                    validateMessages={validateMessages}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                    onValuesChange={() => isChanged.current = true}
                >
                    <div ref={divRef}>
                        <SeoCollapse
                            form={form}
                            getFormValue={getFormValue}
                            allKeywords={initData?.allKeywords}
                            setSeoCollapseScore={(v: number) => seoCollapseScore.current = v}
                        />
                        <AdminNationBaseFields slugs={initData?.slugs} updateCanonical={updateCanonical} tagOptions={initData?.tagOptions} />
                        <CkeditorTabs getFormValue={getFormValue} histories={histories} />
                    </div>
                    <AutoSaveBtn name={localStorageName} rollbackFunc={restore} isDraft={false} />
                    <SeoWarningBtn
                        form={form}
                        getFormValue={getFormValue}
                        slugName='nation_slug'
                        setSeoWarningScore={(v: number) => (seoWarningScore.current = v)}
                    />
                    <DrawerFormBtn divRef={divRef} isEdit={!!nation_id} />
                </Form>
            </div>
            {contextHolder}
            {confirmModal}
        </>
    )
}

export default AdminNationUpdate

