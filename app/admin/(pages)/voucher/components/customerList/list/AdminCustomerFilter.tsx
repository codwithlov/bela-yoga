'use client'
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { useState } from 'react';
import { convertRangePickerDates } from '@/utils/helper';
import AdminRangePicker from '@/components/admin/atoms/AdminRangePicker';

const AdminCustomerFilter = (props: any) => {
    const { setParam, setPage, voucherOptions } = props;
    const [form] = Form.useForm();
    const [dates, setDates] = useState<any>([null, null]);
    const onFinish = async (values: any) => {
        const { fromDate, toDate } = convertRangePickerDates(dates)
        setPage(1);
        setParam({
            ...values,
            fromDate,
            toDate,
        });
    }
    const reset = () => {
        setParam({});
        form.resetFields();
        setPage(1);
        setDates([null, null]);
    }
    return (
        <Form
            initialValues={{ limit: 10, }}
            form={form}
            onFinish={onFinish}
        >
            <Row className='gap-2'>
                <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                <Col span={5}>
                    <Form.Item name="by_text">
                        <Input placeholder='Tìm tên, sdt' allowClear />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item name="voucher_id">
                        <Select
                            placeholder="Chọn voucher"
                            options={voucherOptions}
                            allowClear
                            optionFilterProp="label"
                            showSearch
                            popupMatchSelectWidth={false}
                        />
                    </Form.Item>
                </Col>
                <Form.Item name="type" className='w-32'>
                    <Select
                        placeholder="Chọn loại"
                        options={[
                            { value: 'FAKE', label: 'Tự tạo' },
                            { value: 'REAL', label: 'Khách hàng' }
                        ]}
                        allowClear
                    />
                </Form.Item>
                <AdminRangePicker dates={dates} setDates={setDates} minDate={null} className='h-8 w-60' />

                <SearchButton />
                <ResetButton onClick={reset} />
            </Row>
        </Form>
    );
};

export default AdminCustomerFilter;
