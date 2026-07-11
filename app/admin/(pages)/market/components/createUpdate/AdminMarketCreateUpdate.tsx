'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { MARKET, TOUR } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Form, Input, InputNumber, Select } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { formatDate } from '@/utils/formatDate';
import { toQueryString } from '@/utils/apiUtils';
import { formatInputPrice } from '@/utils/formatPrice';
import { marketHighlightOptions } from '@/constants/options';

type Params = {
    market_id?: number,
    reloadDataList?: any,
    closeDrawer?: any,
}

const AdminMarketCreateUpdate: React.FC<Params> = ({
    market_id,
    closeDrawer,
    reloadDataList
}) => {
    const isEdit = !!market_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const parentId = Form.useWatch('parent_id', form);
    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();

    const getUrl = `${MARKET}/${(isEdit ? market_id + '/edit' : 'create')}`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });

    const params = { sort_by: 'tours.flight_date:asc' };
    const { data: toursData, isFetching: fetchingTour } = useGetDataQuery(
        `${TOUR}/tour-by-market/${parentId}${toQueryString(params)}`,
        { skip: !parentId }
    );

    const markets = (initData?.markets || []).map((item: any) => ({
        value: item.market_id,
        label: item.tour_name,
    }));

    const uniqueTours = Array.from(new Map([...(initData?.market?.tours || []), ...(toursData?.data || []),].map(tour => [tour.tour_id, tour])).values());
    const tours = uniqueTours.map((item: any) => ({
        value: item.tour_id,
        label: `${item.series_code} (${formatDate(item.flight_date)}) - ${item.from[0] ?? ''}`,
    }));

    const handleOnSubmit = async (values: any) => {
        const postData = {
            url: MARKET + (!isEdit ? '' : `/${market_id}?_method=PUT`),
            data: values,
        };
        await handleApiResponse(
            storeUpdateApi(postData),
            (payload: any) => {
                showSuccessToastr(payload?.message);
                reloadDataList();
                closeDrawer();
                form.resetFields();
            },
            setSpinning,
        );
    }

    useEffect(() => {
        if (initData?.market) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeDrawer();
            } else {
                if (isEdit) {
                    form.setFieldsValue(initData.market);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.market]);

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
                        <Form.Item name="parent_id" label="Chọn tuyến tour chính" rules={[{ required: !isEdit }]}>
                            <Select
                                options={markets}
                                placeholder="Chọn tuyến tour"
                                loading={markets?.length === 0}
                                showSearch
                                popupMatchSelectWidth={false}
                                optionFilterProp="label"
                                allowClear
                                onChange={() => { form.setFieldValue('tour_ids', []) }}
                            />
                        </Form.Item>

                        <Form.Item name="tour_name" label="Tên tuyến tour" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        {
                            (initData?.market?.parent_id || 0) > 0 &&
                            <Form.Item name="tour_ids" label="Sản phẩm tour">
                                <Select
                                    options={tours}
                                    mode="multiple"
                                    allowClear
                                    placeholder="Chọn sản phẩm tour"
                                    loading={fetchingTour}
                                    disabled={tours.length === 0}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        }

                        <Form.Item name="market_type_id" label="Loại tuyến tour" rules={[{ required: true }]}>
                            <Select
                                options={initData?.market_types || []}
                                placeholder="Chọn loại"
                                popupMatchSelectWidth={false}
                            />
                        </Form.Item>
                        {
                            isEdit && <div className='flex gap-3'>
                                <Form.Item name="market_name" label="Tên thị trường" className='!w-1/5'>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="nation_ids" label="Quốc gia" className='!w-1/3'>
                                    <Select
                                        options={initData?.nationOptions || []}
                                        mode="multiple"
                                        allowClear
                                        placeholder="Chọn quốc gia"
                                        loading={fetchingTour}
                                        disabled={!initData?.nationOptions}
                                        optionFilterProp="label"
                                    />
                                </Form.Item>

                                <Form.Item name="day_number" label="Số ngày">
                                    <InputNumber maxLength={2} />
                                </Form.Item>

                                <Form.Item name="night_number" label="Số đêm">
                                    <InputNumber maxLength={2} />
                                </Form.Item>

                                <Form.Item name="display_price" label="Giá hiển thị">
                                    <InputNumber
                                        className='!w-32'
                                        formatter={formatInputPrice}
                                        maxLength={11}
                                    />
                                </Form.Item>

                                <Form.Item className='w-36' name="sale_status" label="Thẻ nổi bật">
                                    <Select
                                        placeholder="Chọn thẻ nổi bật"
                                        options={marketHighlightOptions}
                                        allowClear={true}
                                    />
                                </Form.Item>
                            </div>
                        }

                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form>
            </div>
        </>
    )
}

export default AdminMarketCreateUpdate

