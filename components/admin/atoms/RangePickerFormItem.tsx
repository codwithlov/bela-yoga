'use client'
import React from 'react';
import { DatePicker, Form } from 'antd';

interface Props {
}

const RangePickerFormItem: React.FC<Props> = ({ }) => {
    return (
        <Form.Item name="dates">
            <DatePicker.RangePicker
                allowClear
                placeholder={['Từ ngày', 'Đến ngày']}
                // minDate={dayjs()}
                className={'h-8 w-56'}
                format='DD/MM/YYYY'
            />
        </Form.Item>
    );
};

export default RangePickerFormItem;
