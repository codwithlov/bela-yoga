'use client';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import AdminRangePicker from '@/components/admin/atoms/AdminRangePicker';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { topicTypeOptions } from '@/constants/options';
import { TOPIC } from '@/constants/route';
import { IAdminTopicSummary } from '@/interfaces/topic';
import { useGetDataQuery } from '@/services/api/common';
import { useStoreTopicMutation, useUpdateTopicMutation } from '@/services/api/topics';
import { formatNumber } from '@/utils/formatPrice';
import { transferStringToSlug } from '@/utils/formatString';
import { convertRangePickerDates, formatRangePickerDates, getSlug, handleApiResponse } from '@/utils/helper';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input, InputNumber, message, Select } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import SeoWarningBtn from '@/components/admin/molecules/SeoWarningBtn';
import CkeditorTabs from '@/components/admin/organisms/CkeditorTabs';
import { commonCkeditorTabFields } from '@/constants/ui';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { autoSave } from '@/utils/localStorage';
import AutoSaveBtn from '@/components/admin/molecules/AutoSaveBtn';
import { SEO_CONDITION_COUNT } from '@/constants/Post';
import { AUTO_SAVE_DRAFT_TIME } from '@/constants/api';
import { TagSelect } from '@/components/admin/atoms/TagSelect';

type AdminTopicCreateUpdateParams = {
    topicId?: number
    closeModal?: any,
    reloadDataList?: any,
    open?: boolean,
}

const AdminTopicCreateUpdate: React.FC<AdminTopicCreateUpdateParams> = ({
    topicId,
    closeModal,
    reloadDataList,
    open,
}) => {
    const [form] = Form.useForm();

    const [spinning, setSpinning] = useState<boolean>(false);
    const [dates, setDates] = useState<any>([null, null]);
    const [topic, setTopic] = useState<any>();
    const [histories, setHistories] = useState([]);

    const draftId = useRef(null);
    const seoCollapseScore = useRef<number>(0);
    const seoWarningScore = useRef<number>(0);
    const isChanged = useRef(false);
    const isActive = useRef(1);

    const [messageApi, contextHolder] = message.useMessage();
    const [storeTopic] = useStoreTopicMutation();
    const [updateTopic] = useUpdateTopicMutation();
    const { handleConfirm, confirmModal } = useConfirm();

    const isEdit = !!topicId;
    const localStorageName = 'topic' + topicId;

    const getUrl = `${TOPIC}/${(isEdit ? topicId + '/edit' : 'create')}`;
    const { data: initData, isFetching, refetch } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });
    const isDraft = initData?.data?.topic?.status === 'draft' || !isEdit

    const handleOnSubmit = useCallback(
        async (isDone = false, isAutoSave = false, forceSaveDraft = false) => {
            const { fromDate, toDate } = convertRangePickerDates(dates);
            if ((!form.getFieldValue('slug') || !isChanged.current) && !isDone) return;
            let values = isDone ? await form.validateFields() : form.getFieldsValue();

            const submit = async () => {
                isChanged.current = false;
                values = {
                    ...values,
                    ...commonCkeditorTabFields.reduce((acc, { key }) => ({
                        ...acc,
                        [key]: getFormValue(key as any),
                    }), {}),
                    start_date: fromDate,
                    end_date: toDate,
                }
                if (isAutoSave) {
                    autoSave(localStorageName, values);
                    messageApi.open({
                        type: 'success',
                        content: 'Đã tự động lưu thông tin vào bộ nhớ tạm',
                    });
                    return;
                }
                const formData = {
                    ...values,
                    seo_score: (seoWarningScore.current + seoCollapseScore.current) / SEO_CONDITION_COUNT * 100,
                    status: isDone ? 'done' : initData?.data?.topic?.status || (isEdit ? 'done' : 'draft'),
                };
                await handleApiResponse(
                    (!isEdit && !draftId.current) ? storeTopic(formData) : updateTopic(formData),
                    (payload: any) => {
                        if (isDone) {
                            localStorage.removeItem(localStorageName);
                            isActive.current = values.is_active;
                            showSuccessToastr(payload?.message);
                            if (!isEdit) {
                                closeModal();
                                form.resetFields();
                                form.setFieldsValue({ is_active: 1 });
                                setDates([null, null]);
                            }
                            if (initData?.data?.topic?.status === 'draft') {
                                refetch();
                            }
                        } else {
                            if (!isDone && !isEdit && !draftId.current) {
                                draftId.current = payload?.data?.id;
                                form.setFieldsValue({ topic_id: payload?.data?.id });
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
        [topicId, draftId, dates, initData?.data?.topic?.status]
    );

    useEffect(() => {
        if (initData) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                if (isEdit) {
                    const data = initData?.data;
                    setTopic(data?.topic);
                    form.setFieldsValue({
                        ...data?.topic,
                        ...data?.slugPermalink,
                        slug: getSlug(data?.slugPermalink),
                    });
                    setDates(formatRangePickerDates(data?.topic?.start_date, data?.topic?.end_date))
                    setHistories(data?.topic?.histories);
                    isActive.current = data?.topic?.is_active;
                } else {
                    form.setFieldsValue({ is_active: 1 });
                    isActive.current = 1;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData]);

    // auto save
    useEffect(() => {
        const interval = setInterval(() => {
            if (open) {
                const isDraft = !isEdit || initData?.data?.topic?.status === 'draft';
                handleOnSubmit(false, !isDraft);
            }
        }, AUTO_SAVE_DRAFT_TIME);

        return () => clearInterval(interval);
    }, [handleOnSubmit, initData?.data?.topic?.status, isEdit, open]);

    const onChangeName = (e: any) => {
        form.setFieldValue('slug', transferStringToSlug(e.target.value))
    }
    const getFormValue = (name: keyof IAdminTopicSummary) => {
        const value = form.getFieldValue(name);
        return value !== undefined ? value : (topic?.[name] || '');
    }

    const updateCanonical = () => {
        const parentSlug = (initData?.data?.slugs || []).find((v: any) => v.id === form.getFieldValue('parent_id'))?.slug;
        form.setFieldValue('canonical', `${parentSlug ?? ''}${parentSlug ? '/' : ''}${form.getFieldValue('slug') ?? ''}`);
    }

    const restore = (values: any) => {
        form.setFieldsValue(values);
        setTopic(values);
        setDates(formatRangePickerDates(values?.start_date, values?.end_date))
    }

    const divRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <AdminLoading isLoading={spinning || isFetching} />
            <div>
                <Form
                    key={'formSubmit'}
                    form={form}
                    onFinish={() => handleOnSubmit(true)}
                    validateMessages={validateMessages}
                    layout='vertical'
                    onValuesChange={() => isChanged.current = true}
                >
                    <div ref={divRef}>
                        <SeoCollapse
                            form={form}
                            getFormValue={getFormValue}
                            allKeywords={initData?.data?.allKeywords}
                            setSeoCollapseScore={(v: number) => seoCollapseScore.current = v}
                        />
                        <div className='grid grid-cols-6 gap-x-4'>
                            <Form.Item className='hidden' name="topic_id">
                                <Input />
                            </Form.Item>
                            <Form.Item className='col-span-2' name="name" label="Tên chủ đề" rules={[{ required: true }]}>
                                <Input onChange={onChangeName} placeholder='Tour Du Lịch Mùa Thu' />
                            </Form.Item>
                            <ActiveSelect className="col-span-2" />
                            <TagSelect className='col-span-2' tagOptions={initData?.data?.tagOptions} />
                            <SlugPrefixSelect slugs={initData?.data?.slugs} className="col-span-3" onChange={updateCanonical} />
                            <Form.Item className='col-span-3' name="slug" label="Slug" rules={[{ required: true }]}>
                                <Input placeholder='tour-mua-thu' onChange={updateCanonical} />
                            </Form.Item>
                            <div className='col-span-2'>
                                <p className='mb-1'>Chọn khoảng thời gian</p>
                                <AdminRangePicker dates={dates} setDates={setDates} className='w-full h-8' />
                            </div>
                            <Form.Item className='col-span-2' name="sort_order" label="Thứ tự ưu tiên">
                                <InputNumber
                                    className="!w-full"
                                    formatter={formatNumber}
                                    maxLength={3}
                                />
                            </Form.Item>
                            <Form.Item className='col-span-2' name="type" label="Loại">
                                <Select
                                    placeholder="Chọn loại"
                                    options={topicTypeOptions}
                                    allowClear={true}
                                />
                            </Form.Item>
                        </div>
                        <SeoWarningBtn
                            form={form}
                            getFormValue={getFormValue}
                            slugName='slug'
                            setSeoWarningScore={(v: number) => (seoWarningScore.current = v)}
                        />
                        <CkeditorTabs getFormValue={getFormValue} histories={histories} />
                    </div>
                    <AutoSaveBtn
                        name={localStorageName}
                        rollbackFunc={restore}
                        isDraft={!isDraft}
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
            {confirmModal}
            {contextHolder}
        </>
    )
}

export default AdminTopicCreateUpdate