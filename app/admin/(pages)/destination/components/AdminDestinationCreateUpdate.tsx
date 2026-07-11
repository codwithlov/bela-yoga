'use client';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { DESTINATION } from '@/constants/route';
import { commonCkeditorTabFields, DROPDOWN_PLACEHOLDER } from '@/constants/ui';
import { useCreateEditDestinationsQuery, useStoreOrUpdateDestinationMutation } from '@/services/api/destinations';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input, message, Select } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { transferStringToSlug } from '@/utils/formatString';
import CkeditorTabs from '@/components/admin/organisms/CkeditorTabs';
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import SeoWarningBtn from '@/components/admin/molecules/SeoWarningBtn';
import { getSlug, handleApiResponse } from '@/utils/helper';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { autoSave } from '@/utils/localStorage';
import AutoSaveBtn from '@/components/admin/molecules/AutoSaveBtn';
import { SEO_CONDITION_COUNT } from '@/constants/Post';
import { AUTO_SAVE_DRAFT_TIME } from '@/constants/api';
import { TagSelect } from '@/components/admin/atoms/TagSelect';

type Params = {
    destination_id?: string,
    reloadDataList?: any,
    closeModal?: any,
    open?: boolean,
}
const AdminDestinationCreateUpdate: React.FC<Params> = ({
    destination_id,
    closeModal,
    reloadDataList,
    open
}) => {
    const isEdit = !!destination_id;
    const localStorageName = 'destination' + destination_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const [destination, setDestination] = useState<any>();
    const [histories, setHistories] = useState([]);

    const seoCollapseScore = useRef<number>(0);
    const seoWarningScore = useRef<number>(0);
    const draftId = useRef(null);
    const divRef = useRef<HTMLDivElement>(null);
    const isChanged = useRef(false);
    const isActive = useRef(1);

    const [messageApi, contextHolder] = message.useMessage();
    const { handleConfirm, confirmModal } = useConfirm();

    const subUrl = isEdit ? destination_id + '/edit' : 'create';
    const { data: initData, isFetching, refetch } = useCreateEditDestinationsQuery(subUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });
    const isDraft = initData?.data?.destination?.status === 'draft' || !isEdit;

    const nations = (initData?.data?.nations || []).map((item: any) => ({
        value: item?.nation_id,
        label: item?.nation_name,
    }));

    const [storeUpdateApi] = useStoreOrUpdateDestinationMutation();

    const handleOnSubmit = useCallback(
        async (isDone = false, isAutoSave = false, forceSaveDraft = false) => {
            if ((!form.getFieldValue('destination_slug') || !isChanged.current) && !isDone) return;
            let values = isDone ? await form.validateFields() : form.getFieldsValue();

            const submit = async () => {
                isChanged.current = false;
                values = {
                    ...values,
                    ...commonCkeditorTabFields.reduce((acc, { key }) => ({
                        ...acc,
                        [key]: getFormValue(key),
                    }), {}),
                }
                if (isAutoSave) {
                    autoSave(localStorageName, values);
                    messageApi.open({
                        type: 'success',
                        content: 'Đã tự động lưu thông tin vào bộ nhớ tạm',
                    });
                    return;
                }
                console.log(seoWarningScore.current, seoCollapseScore.current)
                const formData = {
                    url: DESTINATION + ((!isEdit && !draftId.current) ? '' : `/${(destination_id || draftId.current)}?_method=PUT`),
                    data: {
                        ...values,
                        updated_at: initData?.data?.destination?.updated_at,
                        seo_score: (seoWarningScore.current + seoCollapseScore.current) / SEO_CONDITION_COUNT * 100,
                        status: isDone ? 'done' : initData?.data?.destination?.status || (isEdit ? 'done' : 'draft'),
                    },
                }

                await handleApiResponse(
                    storeUpdateApi(formData),
                    (payload: any) => {
                        if (isDone) {
                            isActive.current = values.is_active;
                            localStorage.removeItem(localStorageName);
                            showSuccessToastr(payload?.message);
                            if (!isEdit) {
                                form.resetFields();
                                form.setFieldsValue({ is_active: 1 });
                                closeModal();
                            }
                            if (initData?.data?.destination?.status === 'draft') {
                                refetch();
                            }
                        } else {
                            if (!isDone && !isEdit && !draftId.current) {
                                draftId.current = payload?.data?.id;
                                messageApi.open({
                                    type: 'success',
                                    content: 'Đã lưu bản nháp',
                                });
                            } else {
                                messageApi.open({
                                    type: 'success',
                                    content: forceSaveDraft ? 'Đã lưu bản nháp' : 'Đã tự động lưu',
                                });
                            }
                        }
                        setHistories(payload?.data?.histories);
                        reloadDataList();
                    },
                    isDone || forceSaveDraft ? setSpinning : () => { },
                    !isDone ? messageApi : ''
                );
            }
            if (isDone && values.is_active === 0 && isActive.current === 1 && !isAutoSave) {
                handleConfirm('Xác nhận đổi trạng thái, link của bài viết sẽ không còn trỏ tới bài khác', submit, 'OK');
            } else {
                submit();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form, destination_id, draftId, initData?.data?.destination?.status]
    );

    useEffect(() => {
        if (initData?.data) {
            if (initData?.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            }
            if (!destination_id) {
                form.setFieldsValue({ is_active: 1 });
                isActive.current = 1;
            } else {
                const destination = initData?.data?.destination
                form.setFieldsValue({
                    ...destination,
                    ...initData?.data?.slugPermalink,
                    destination_slug: getSlug(initData?.data?.slugPermalink),
                });
                isActive.current = destination?.is_active;
                setHistories(destination?.histories);
                setDestination(destination);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destination_id, initData?.data]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (open) {
                const isDraft = !isEdit || initData?.data?.destination?.status === 'draft';
                handleOnSubmit(false, !isDraft);
            }
        }, AUTO_SAVE_DRAFT_TIME);

        return () => clearInterval(interval);
    }, [handleOnSubmit, initData?.data?.destination?.status, isEdit, open]);

    const onChangeName = (e: any) => {
        form.setFieldValue('destination_slug', transferStringToSlug(e.target.value))
    }

    const updateCanonical = () => {
        const parentSlug = (initData?.data?.slugs || []).find((v: any) => v.id === form.getFieldValue('parent_id'))?.slug;
        form.setFieldValue('canonical', `${parentSlug ?? ''}${parentSlug ? '/' : ''}${form.getFieldValue('destination_slug') ?? ''}`);
    }

    const getFormValue = (name: any) => {
        const value = form.getFieldValue(name);
        return value !== undefined ? value : (destination?.[name] || '');
    }

    const restore = (values: any) => {
        form.setFieldsValue(values);
        setDestination(values);
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
                    onFinish={() => handleOnSubmit(true)}
                    validateMessages={validateMessages}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                    onValuesChange={() => isChanged.current = true}
                >
                    <div ref={divRef} >
                        <SeoCollapse
                            form={form}
                            getFormValue={getFormValue}
                            allKeywords={initData?.data?.allKeywords}
                            setSeoCollapseScore={(v: number) => seoCollapseScore.current = v}
                        />
                        <div className='grid grid-cols-3 gap-x-4'>
                            <Form.Item name="destination_name" label="Tên điểm đến" rules={[{ required: true }]}>
                                <Input onChange={onChangeName} />
                            </Form.Item>
                            <Form.Item name="nation_id" label="Quốc gia" rules={[{ required: true }]}>
                                <Select
                                    placeholder={DROPDOWN_PLACEHOLDER}
                                    options={nations}
                                />
                            </Form.Item>
                            <ActiveSelect />
                            <SlugPrefixSelect slugs={initData?.data?.slugs} onChange={updateCanonical} />
                            <Form.Item name="destination_slug" label="Slug" rules={[{ required: true }]} >
                                <Input onChange={updateCanonical} />
                            </Form.Item>
                            <TagSelect tagOptions={initData?.data?.tagOptions} />
                        </div>
                        <SeoWarningBtn
                            form={form}
                            getFormValue={getFormValue}
                            slugName='destination_slug'
                            setSeoWarningScore={(v: number) => (seoWarningScore.current = v)}
                        />
                        <CkeditorTabs getFormValue={getFormValue} histories={histories} />
                    </div>
                    <AutoSaveBtn
                        name={localStorageName}
                        rollbackFunc={restore}
                        isDraft={isDraft}
                    />
                    <DrawerFormBtn
                        divRef={divRef}
                        isEdit={isEdit}
                        text={isDraft ? 'Xuất bản' : ''}
                        isDraft={isDraft}
                        onSaveDraftClicked={() => handleOnSubmit(false, false, true)}
                    />
                </Form>
            </div >
            {contextHolder}
            {confirmModal}
        </>
    )
}

export default AdminDestinationCreateUpdate

