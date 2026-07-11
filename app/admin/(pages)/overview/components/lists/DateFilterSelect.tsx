import { useState } from 'react';
import { Select } from 'antd';
import { getPastDate } from '@/utils/formatDate';

const { Option } = Select;

interface DateFilterSelectProps {
    setParam: (param: any) => void;
    setPage: (page: number) => void;
}

const DateFilterSelect = ({ setParam, setPage }: DateFilterSelectProps) => {
    const [days, setDays] = useState(1);

    const handleDateChange = (value: number) => {
        setDays(value);
        setParam({ created_at: getPastDate(value) });
        setPage(1);
    };

    return (
        <Select value={days} onChange={handleDateChange} style={{ width: 150 }}>
            <Option value={1}>1 ngày(24 giờ)</Option>
            <Option value={7}>1 tuần</Option>
            <Option value={31}>1 tháng</Option>
            <Option value={62}>2 tháng</Option>
        </Select>
    );
};

export default DateFilterSelect;
