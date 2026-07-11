'use client'
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { TrashCan } from '@/components/admin/atoms/TrashCan';
import { useState } from 'react';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { convertRangePickerDates } from '@/utils/helper';
import AdminRangePicker from '@/components/admin/atoms/AdminRangePicker';

const AdminSupportRequestFilter = (props: any) => {
    const { setParam, setPage, customerStatusOptions } = props;
    const [form] = Form.useForm();
    const [deleted, setDeleted] = useState(false);
    const userInfo = useGetUserInfo();
    const [dates, setDates] = useState<any>([null, null]);

    const handleOnFilter = async (values: any) => {
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

    const onTrashCanClicked = () => {
        setDates([null, null]);
        form.resetFields();
        setParam({
            deleted: deleted ? 0 : 1,
        });
        setPage(1);
        setDeleted(!deleted);
    };

    return (
        <section>
            <Form
                onFinish={(value) => handleOnFilter(value)}
                initialValues={{ limit: 10 }}
                form={form}
            >
                <Row className='gap-2'>
                    {
                        (userInfo?.permissionCodes || []).includes('SUPPORT_REQUEST_VIEW_TRASH') &&
                        <TrashCan onTrashCanClicked={onTrashCanClicked} deleted={deleted} />
                    }
                    <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                    {!deleted &&
                        <>
                            <Col span={6}>
                                <Form.Item name="by_text">
                                    <Input placeholder='Tìm tên, sđt, email' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="by_status">
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        options={customerStatusOptions}
                                        allowClear
                                        optionFilterProp="label"
                                        showSearch
                                        popupMatchSelectWidth={false}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <AdminRangePicker dates={dates} setDates={setDates} minDate={null} className='h-8 w-60' />
                            <SearchButton />
                            <ResetButton onClick={reset} />
                        </>
                    }
                </Row>
            </Form>
        </section >
    );
};

export default AdminSupportRequestFilter;
