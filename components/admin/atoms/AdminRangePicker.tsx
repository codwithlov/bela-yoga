'use client'
import React from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface AdminRangePickerProps {
    dates: [Dayjs | null, Dayjs | null];
    setDates: (dates: [Dayjs | null, Dayjs | null]) => void;
    className?: string;
    minDate?: any;
}

const AdminRangePicker: React.FC<AdminRangePickerProps> = ({ dates, setDates, className, minDate = dayjs() }) => {
    const handleChange = (dates: [Dayjs | null, Dayjs | null]) => {
        setDates(dates);
    };

    return (
        <RangePicker
            value={dates}
            onCalendarChange={handleChange}
            allowClear
            placeholder={['Từ ngày', 'Đến ngày']}
            minDate={minDate}
            className={className ?? ' h-8 w-56'}
            format='DD/MM/YYYY'
        />
    );
};

export default AdminRangePicker;
