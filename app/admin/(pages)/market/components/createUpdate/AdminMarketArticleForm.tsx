'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import { validateMessages } from '@/utils/validateRule';
import { useStoreOrUpdateOtherInfosMutation } from '@/services/api/markets';
import { Divider, Form, Input, message, Select } from 'antd';
import { marketCkeditorTabFields } from '@/constants/ui';
import { formatSelectArray, getSlug } from '@/utils/helper';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { useGetDataQuery } from '@/services/api/common';
import { MARKET, TOUR } from '@/constants/route';
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { toQueryString } from '@/utils/apiUtils';
import dayjs from 'dayjs';
import OtherInfoForm from './OtherInfoForm';
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import SeoWarningBtn from '@/components/admin/molecules/SeoWarningBtn';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { autoSave } from '@/utils/localStorage';
import AutoSaveBtn from '@/components/admin/molecules/AutoSaveBtn';
import { SEO_CONDITION_COUNT } from '@/constants/Post';
import { AUTO_SAVE_DRAFT_TIME } from '@/constants/api';
import { TagSelect } from '@/components/admin/atoms/TagSelect';
import { IMarketOtherInfo } from '@/interfaces/market';

interface Props {
    marketData?: any;
    refetchList: () => void;
    marketId: number;
    refetch: any;
}

const AdminMarketArticleForm: React.FC<Props> = ({ marketData, refetchList, marketId, refetch }) => {
    const localStorageName = 'market' + marketId;
    const [form] = Form.useForm();
    const { handleConfirm, confirmModal } = useConfirm();
    const [messageApi, contextHolder] = message.useMessage();

    const defaultArticalIndex = useRef(0);
    const seoCollapseScore = useRef<number>(0);
    const seoWarningScore = useRef<number>(0);
    const isActive = useRef(1);
    const isChanged = useRef(false);

    const { data: nationsDestinationsData, isFetching } = useGetDataQuery(
        `${MARKET}/get-nations-destinations/${marketId}`,
        { refetchOnMountOrArgChange: true, skip: !marketId }
    );

    const params = { flight_date: dayjs().format('DD/MM/YYYY'), sort_by: 'tours.flight_date:asc' };
    const { data: toursData } = useGetDataQuery(
        `${TOUR}/tour-by-market/${marketId}${toQueryString(params)}`,
        { refetchOnMountOrArgChange: false, skip: !marketId }
    );

    const [loadingState, setLoadingState] = useState<any>(false);
    const initOtherInfoList = [{ id: 0, tour_ids: [] }];
    const [otherInfoList, setOtherInfoList] = useState<any>(initOtherInfoList);

    const [storeOrUpdateOtherInfos] = useStoreOrUpdateOtherInfosMutation();

    useEffect(() => {
        if (marketData) {
            const otherInfos = marketData.other_infos || [];

            defaultArticalIndex.current = otherInfos.findIndex((i: IMarketOtherInfo) => i.tour_ids.length === 0)

            const fieldValues = otherInfos.reduce((acc: any, item: any, index: any) => {
                acc[`tour_ids${index}`] = item.tour_ids;
                return acc;
            }, {});

            form.setFieldsValue({
                market_id: marketData.market?.market_id,
                ...marketData.slugPermalink,
                market_slug: getSlug(marketData.slugPermalink),
                is_active: marketData.market?.is_active,
                ...fieldValues,
            });
            isActive.current = marketData.market?.is_active;
            setOtherInfoList(otherInfos);
        }
    }, [form, marketData])

    useEffect(() => {
        const data = nationsDestinationsData?.data;
        if (data) {
            form.setFieldsValue({
                nations: data.nations.map((item: any) => item.nation_id),
                selected_destinations: data.selected_destinations.map((item: any) => item.id),
            });
        }
    }, [form, nationsDestinationsData?.data])

    const destinations = useMemo(() => {
        return formatSelectArray(
            nationsDestinationsData?.data?.destinations,
            'id',
            'destination_name',
        )
    }, [nationsDestinationsData?.data?.destinations]);

    const nations = useMemo(() => {
        return formatSelectArray(
            nationsDestinationsData?.data?.nations,
            'nation_id',
            'nation_name'
        )
    }, [nationsDestinationsData?.data?.nations]);

    const getFormValue = useCallback((name: any, index: any) => {
        const value = form.getFieldValue(name + (index));
        return value !== undefined ? value : (otherInfoList?.[index]?.[name] || '');
    }, [form, otherInfoList])

    const handleFinish = useCallback(

        async (isAutoSave = false) => {
            if (!isChanged.current && isAutoSave) return;
            let values = !isAutoSave ? await form.validateFields() : form.getFieldsValue();
            if (!values.meta_title) {
                showErrorToastr('fill_required_infomation');
                return;
            }
            const submit = async () => {
                values.market_id = marketId;
                isChanged.current = false;

                const otherInfos = otherInfoList?.map((item: any, index: number) => ({
                    id: item.id,
                    tour_ids: item.tour_ids,
                    histories: isAutoSave ? item.histories : [],
                    tours: isAutoSave ? item.tours : [],
                    ...marketCkeditorTabFields.reduce((acc, { key }) => ({
                        ...acc,
                        [key]: getFormValue(key, index),
                    }), {})
                }));
                isActive.current = values.is_active;

                const formData = {
                    ...values,
                    seo_score: (seoWarningScore.current + seoCollapseScore.current) / SEO_CONDITION_COUNT * 100,
                    market_id: marketId,
                    otherInfos: otherInfos,
                };
                if (isAutoSave) {
                    autoSave(localStorageName, formData);
                    messageApi.open({
                        type: 'success',
                        content: 'Đã tự động lưu thông tin vào bộ nhớ tạm',
                    });
                    return;
                }

                setLoadingState(true);
                await storeOrUpdateOtherInfos(formData)
                    .unwrap()
                    .then((payload: any) => {
                        if (payload?.success) {
                            localStorage.removeItem(localStorageName);
                            showSuccessToastr(payload?.message);
                            refetch();
                            refetchList();
                        }
                    })
                    .catch((error: any) => {
                        if (error?.status) {
                            showErrorToastr(error?.data.message);
                        }
                    })
                    .finally(
                        () => setLoadingState(false)
                    );
            }
            if (values.is_active === 0 && isActive.current === 1 && !isAutoSave) {
                handleConfirm('Xác nhận đổi trạng thái, link của bài viết sẽ không còn trỏ tới bài khác', submit, 'OK');
            } else {
                submit();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form, getFormValue, localStorageName, marketId, otherInfoList]
    )

    const updateCanonical = () => {
        const parentSlug = (marketData?.slugs || []).find((v: any) => v.id === form.getFieldValue('parent_id'))?.slug;
        form.setFieldValue('canonical', `${parentSlug ?? ''}${parentSlug ? '/' : ''}${form.getFieldValue('market_slug') ?? ''}`);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            handleFinish(true);
        }, AUTO_SAVE_DRAFT_TIME);
        return () => clearInterval(interval);
    }, [handleFinish]);

    const restore = (values: any) => {
        const otherInfos = values.otherInfos || [];

        defaultArticalIndex.current = otherInfos.findIndex((i: any) => i.tour_ids.length === 0)

        const fieldValues = values.otherInfos.reduce((acc: any, item: any, index: any) => {
            acc[`tour_ids${index}`] = item.tour_ids;
            return acc;
        }, {});

        form.setFieldsValue({
            ...values,
            ...fieldValues,
        });
        setOtherInfoList(values.otherInfos);
    }

    const divRef = useRef<HTMLDivElement>(null);
    return (
        <Form
            key={`otherInfoForm${marketId}`}
            form={form}
            validateMessages={validateMessages}
            onFinish={() => handleFinish()}
            layout="vertical"
            onValuesChange={() => isChanged.current = true}
        >
            <AdminLoading isLoading={loadingState} />
            <div ref={divRef}>
                <div className='pt-4 px-4'>
                    <SeoCollapse
                        form={form}
                        getFormValue={(v: string) => getFormValue(v, defaultArticalIndex.current)}
                        fieldNames={marketCkeditorTabFields.map(i => i.key)}
                        allKeywords={marketData?.allKeywords}
                        setSeoCollapseScore={(v: number) => seoCollapseScore.current = v}
                    />
                    {marketId &&
                        <div className='grid grid-cols-3 gap-x-4'>
                            <Form.Item name="nations" label="Quốc gia" >
                                <Select options={nations} mode="multiple" loading={isFetching} disabled />
                            </Form.Item>
                            <Form.Item name="selected_destinations" label="Điểm đến">
                                <Select
                                    options={destinations}
                                    mode="multiple"
                                    allowClear
                                    placeholder="Chọn điểm đến"
                                    loading={isFetching}
                                />
                            </Form.Item>
                            {/* <TagSelect tagOptions={marketData?.tagOptions} /> */}
                            <div></div>
                            <SlugPrefixSelect slugs={marketData?.slugs} onChange={updateCanonical} />
                            <Form.Item name="market_slug" label="Slug" rules={[{ required: true }]}>
                                <Input placeholder="Slug" onChange={updateCanonical} />
                            </Form.Item>
                            <ActiveSelect />
                        </div>
                    }
                    <Divider className='!mt-1 !mb-0' />
                </div>
                <OtherInfoForm
                    isChange={isChanged}
                    otherInfoList={otherInfoList}
                    setOtherInfoList={setOtherInfoList}
                    tours={toursData?.data}
                    fields={marketCkeditorTabFields}
                    getFormValue={getFormValue}
                />
            </div>
            <AutoSaveBtn name={localStorageName} rollbackFunc={restore} isDraft={false} />
            <SeoWarningBtn
                form={form}
                getFormValue={(v: string) => getFormValue(v, defaultArticalIndex.current)}
                slugName='market_slug'
                fieldNames={marketCkeditorTabFields.map(i => i.key)}
                sapoName='introduction'
                setSeoWarningScore={(v: number) => (seoWarningScore.current = v)}
            />
            <div className='mr-4'>
                <DrawerFormBtn divRef={divRef} isEdit={true} />
            </div>
            {contextHolder}
            {confirmModal}
        </Form >
    )
}

export default AdminMarketArticleForm
