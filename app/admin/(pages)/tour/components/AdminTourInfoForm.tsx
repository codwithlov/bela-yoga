'use client';

import React, { useCallback, useMemo } from 'react';
import { Collapse, DatePicker, Form, Input, InputNumber, Select, TimePicker } from 'antd';
import { formatInputPrice } from '@/utils/formatPrice';
import { CollapseProps } from 'antd/lib';
import dayjs from 'dayjs';
type AdminTourUpdateProps = {
    initData: any;
    disabled: boolean;
};

const AdminTourInfoForm: React.FC<AdminTourUpdateProps> = ({ initData, disabled }) => {
    const infoFields = useMemo(() => [
        {
            name: 'market_id',
            label: 'Tuyến tour',
            type: 'select',
            options: initData?.marketOptions,
            disabled: initData?.tour?.tour_id > 0 || false,
        },
        { name: 'remaining_seats', label: 'Chỗ trống', type: 'number' },
        { name: 'total_seat', label: 'Tổng chỗ', type: 'number' },
        { name: 'departure_point', label: 'Điểm khởi hành' },

        { name: 'flight_date', label: 'Ngày đi', type: 'date' },
        { name: 'shcb', label: 'SHCB' },
        { name: 'takeoff_time', label: 'Giờ cất cánh', type: 'time' },
        { name: 'arrive_time', label: 'Giờ hạ cánh', type: 'time' },
        { name: 'from', label: 'Từ', },
        { name: 'to', label: 'Đến', },
        { name: 'flight_code', label: 'Hãng bay', type: 'select', options: initData?.carrierOptions },
        null,

        { name: 'flight_date_back', label: 'Ngày về', type: 'date' },
        { name: 'shcb_back', label: 'SHCB' },
        { name: 'takeoff_time_back', label: 'Giờ cất cánh', type: 'time' },
        { name: 'arrive_time_back', label: 'Giờ hạ cánh', type: 'time' },
        { name: 'from_back', label: 'Từ', },
        { name: 'to_back', label: 'Đến', },
        { name: 'flight_back_code', label: 'Hãng bay', type: 'select', options: initData?.carrierOptions },
        null,

        { name: 'price_adl', label: 'Giá ADL', type: 'number' },
        { name: 'price_chd', label: 'Giá CHD', type: 'number' },
        { name: 'price_inf', label: 'Giá INF', type: 'number' },
    ], [initData]);

    const renderInfo = useCallback((fields: typeof infoFields) => (
        <div className='grid grid-cols-4 gap-x-2'>
            {fields.map((field, index) => {
                return (
                    field ?
                        <Form.Item
                            key={index}
                            label={field.label}
                            rules={[{ required: disabled }]}
                            name={field.name}
                        >
                            {
                                field.type === 'select' ?
                                    <Select
                                        options={field.options}
                                        optionFilterProp="label"
                                        showSearch
                                        disabled={disabled || field.disabled}
                                        popupMatchSelectWidth={false}
                                        placeholder='Lựa chọn'
                                    />
                                    :
                                    field.type === 'number' ?
                                        <InputNumber
                                            className="!w-full"
                                            formatter={formatInputPrice}
                                            maxLength={11}
                                            disabled={disabled}
                                        />
                                        : field.type === 'date' ?
                                            <DatePicker
                                                className="w-full"
                                                placeholder='Chọn ngày'
                                                format='DD/MM/YYYY'
                                                disabled={disabled}
                                            />

                                            : field.type == 'time' ?
                                                <TimePicker
                                                    format="HH:mm"
                                                    defaultValue={dayjs('00:00:00', 'HH:mm')}
                                                    disabled={disabled}
                                                />

                                                : <Input
                                                    disabled={disabled}
                                                    placeholder='...'
                                                />
                            }
                        </Form.Item>
                        :
                        <div key={index} />
                )
            }
            )}
        </div>
    ), [disabled]);

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thông tin',
            children: <>{renderInfo(infoFields)}</>,
        },
    ]
    return (
        <>
            <Collapse items={items} defaultActiveKey={['1']} size="small" />
        </>

    );
};

export default AdminTourInfoForm;
