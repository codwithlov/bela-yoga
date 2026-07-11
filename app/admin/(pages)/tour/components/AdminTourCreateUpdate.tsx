'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Divider, Form, Input, InputNumber } from 'antd';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import { validateMessages } from '@/utils/validateRule';
import { formatInputPrice } from '@/utils/formatPrice';
import { convertRangePickerDates, formatRangePickerDates, generateSeriesCode } from '@/utils/helper';
import { PushSaleSelect } from '@/components/admin/atoms/PushSaleSelect';
import { TOUR } from '@/constants/route';
import AdminRangePicker from '@/components/admin/atoms/AdminRangePicker';
import AutoFillTourForm from './AutoFillTourForm';
import dayjs from 'dayjs';
import AdminTourInfoForm from './AdminTourInfoForm';

type AdminTourUpdateProps = {
    tour_id?: string;
    reloadDataList: () => void;
    closeModal: () => void;
};

const AdminTourCreateUpdate: React.FC<AdminTourUpdateProps> = ({ tour_id, reloadDataList, closeModal }) => {
    const [form] = Form.useForm();
    const marketId = Form.useWatch('market_id', form)
    const [spinning, setSpinning] = useState<boolean>(false);
    const [dates, setDates] = useState<any>([null, null]);
    const divRef = useRef<HTMLDivElement>(null);
    const isEdit = !!tour_id;
    const url = isEdit ? `${TOUR}/${tour_id}/edit` : `${TOUR}/create`;
    const timeFormat = "HH:mm";
    const timeFormatDB = "HH:mm:ss";
    const { data: initData, isFetching } = useGetDataQuery(url, {
        refetchOnMountOrArgChange: true,
    });

    const isPushSale = Form.useWatch('is_push_sale', form);

    const [storeUpdateApi] = usePostDataMutation();

    const handleOnSubmit = async (values: any) => {
        setSpinning(true);
        try {
            const { fromDate, toDate } = convertRangePickerDates(dates);
            const formData = {
                url: TOUR + (!isEdit ? '' : `/${tour_id}`),
                data: {
                    ...values,
                    updated_at: initData?.tour?.updated_at,
                    push_sale_start_date: fromDate,
                    push_sale_end_date: toDate,
                    flight_date: dayjs(values.flight_date).format('YYYY-MM-DD'),
                    flight_date_back: dayjs(values.flight_date_back).format('YYYY-MM-DD'),
                    takeoff_time: dayjs(values.takeoff_time, timeFormat).format(timeFormatDB),
                    arrive_time: dayjs(values.arrive_time, timeFormat).format(timeFormatDB),
                    takeoff_time_back: dayjs(values.arrive_time_back, timeFormat).format(timeFormatDB),
                    arrive_time_back: dayjs(values.arrive_time_back, timeFormat).format(timeFormatDB),
                },
            };
            const payload = await storeUpdateApi(formData).unwrap();
            if (payload?.success) {
                showSuccessToastr(payload?.message);
                // if (isEdit) {
                //     form.resetFields();
                //     closeModal();
                // }
                reloadDataList();
            }
        } catch (error: any) {
            showErrorToastr(error?.data?.message || 'update_failed');
        } finally {
            setSpinning(false);
        }
    };

    const setFieldsValue = (tour: any) => {
        setDates(formatRangePickerDates(tour?.push_sale_start_date, tour?.push_sale_end_date))
        form.setFieldsValue({
            ...tour,
            flight_date: tour?.flight_date ? dayjs(tour?.flight_date) : null,
            flight_date_back: tour?.flight_date_back ? dayjs(tour?.flight_date_back) : null,
            takeoff_time: tour?.takeoff_time ? dayjs(tour?.takeoff_time, timeFormat) : null,
            arrive_time: tour?.arrive_time ? dayjs(tour?.arrive_time, timeFormat) : null,
            takeoff_time_back: tour?.arrive_time_back ? dayjs(tour?.arrive_time_back, timeFormat) : null,
            arrive_time_back: tour?.arrive_time_back ? dayjs(tour?.arrive_time_back, timeFormat) : null,
        });
    }

    useEffect(() => {
        if (initData?.tour) {
            if (initData?.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                setFieldsValue(initData?.tour);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData?.tour]);

    useEffect(() => {
        if (isPushSale === 0) {
            form.setFieldsValue({
                push_sale_price_adl_off: 0,
                push_sale_price_chd_off: 0,
                push_sale_price_inf_off: 0,
            })
        }
    }, [form, isPushSale]);

    const priceFields = useMemo(() => [
        { name: 'price_adl_off', label: 'Giá ADL bán' },
        { name: 'price_chd_off', label: 'Giá CHD bán' },
        { name: 'price_inf_off', label: 'Giá INF bán' },
    ], []);

    const pushSalePriceFields = useMemo(() => [
        { name: 'push_sale_price_adl_off', label: 'Giá ADL push sale' },
        { name: 'push_sale_price_chd_off', label: 'Giá CHD push sale' },
        { name: 'push_sale_price_inf_off', label: 'Giá INF push sale' },
    ], []);

    const renderFields = useCallback((fields: typeof priceFields, disabled: boolean) => (
        <div className='flex flex-row gap-2'>
            {fields.map((field) => (
                <Form.Item
                    key={field.name}
                    name={field.name}
                    className="flex-1"
                    label={field.label}
                >
                    <InputNumber
                        disabled={disabled}
                        className="!w-full"
                        formatter={formatInputPrice}
                        maxLength={11}
                    />
                </Form.Item>
            ))}
        </div>
    ), []);

    const updateSeriesCode = (changedValues: any) => {
        if (changedValues.series_code) return;
        const tour = form.getFieldsValue();
        const prefix = tour.series_code?.split('.')?.[0];
        form.setFieldValue('series_code', generateSeriesCode(tour, prefix));
    }

    return (
        <>
            {spinning && <AdminLoading isLoading />}
            <div className='pb-5'>
                <DrawerLoading isLoading={isFetching} />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOnSubmit}
                    validateMessages={validateMessages}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                    onValuesChange={updateSeriesCode}
                >
                    <div ref={divRef}>
                        <AdminTourInfoForm initData={initData} disabled={isEdit && initData?.tour?.type === 'tic'} />

                        <div className='flex gap-3'>
                            {
                                !isEdit &&
                                <AutoFillTourForm setFormValue={setFieldsValue} marketId={marketId} />
                            }
                            {
                                (!isEdit || initData?.tour?.type !== 'tic') &&
                                <Form.Item
                                    name="series_code"
                                    className='w-96 !mt-3'
                                >
                                    <Input placeholder='Mã tour' />
                                </Form.Item>
                            }
                        </div>
                        <Divider className='!mt-4 !mb-2'>Chỉnh sửa</Divider>
                        <div className="grid grid-cols-4  gap-x-2">
                            <ActiveSelect checkbox className="col-span-1" />
                            <PushSaleSelect checkbox className="col-span-1" />
                        </div>
                        <div className='w-1/2 mb-3'>
                            <p className='mb-1'>Chọn khoảng push sale</p>
                            <AdminRangePicker dates={dates} setDates={setDates} />
                        </div>
                        {renderFields(priceFields, false)}
                        {renderFields(pushSalePriceFields, isPushSale === 0)}
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={!!tour_id} />
                </Form>
            </div>
        </>
    );
};

export default AdminTourCreateUpdate;
