'use client'
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Col, Form, Input, Popover, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { calculateSelectWidth, convertRangePickerDates, formatSelectArray } from '@/utils/helper';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { PushSaleSelect } from '@/components/admin/atoms/PushSaleSelect';
import AdminRangePicker from '@/components/admin/atoms/AdminRangePicker';
import ColumnSelect from '@/components/admin/molecules/ColumnSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { CaretDownOutlined, CaretUpOutlined, CheckSquareOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useCheckPermission from '@/hooks/useCheckPermission';

const AdminTourFilter = (props: any) => {
    const { setParam, setPage, marketsProp, columnsOptions, selectedColumns, setSelectedColumns, initParam, onConvertClicked } = props;
    const [dates, setDates] = useState<any>([null, null]);
    const [showAll, setShowAll] = useState<any>(false);
    const [form] = Form.useForm();
    const checkPermission = useCheckPermission();
    const canUpdate = checkPermission('TOUR_UPDATE');

    const markets = formatSelectArray(marketsProp, 'market_id', 'tour_name');
    const selectWidth = useMemo(() => calculateSelectWidth(markets), [markets]);

    const onFinish = (value: any) => {
        const { fromDate, toDate } = convertRangePickerDates(dates)
        setParam({
            ...value,
            from_date: fromDate || dayjs().format('YYYY-MM-DD'),
            to_date: toDate,
        });
        setPage(1);
    }

    const reset = () => {
        setParam(initParam);
        form.resetFields();
        setDates([null, null]);
        setPage(1);
    }
    return (
        <section>
            <Form
                onFinish={onFinish}
                initialValues={{ limit: 10, }}
                form={form}
                className='flex justify-between'
            >
                <div className='gap-x-2 flex flex-wrap'>
                    <div
                        className="border border-gray-300 rounded-lg flex items-center justify-center h-8 w-8 cursor-pointer"
                    >
                        <Popover
                            content={
                                <div className="w-96">
                                    <h3 className='font-medium'>Lưu ý</h3>
                                    <p>Tour sẽ không được hiển thị nếu <strong>Số chỗ trống</strong> bằng <strong>0</strong></p>
                                </div>
                            }
                            placement="bottomLeft"
                            className="cursor-pointer w-full h-full flex items-center justify-center">
                            <InfoCircleOutlined />
                        </Popover>
                    </div>
                    <ColumnSelect
                        options={columnsOptions}
                        value={selectedColumns}
                        onChange={setSelectedColumns}
                        type='tour'
                    />
                    {canUpdate &&
                        <div
                            className="border border-gray-300 rounded-lg flex items-center justify-center h-8 w-8 cursor-pointer"
                            onClick={onConvertClicked}
                        >
                            <CheckSquareOutlined />
                        </div>
                    }

                    <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                    <Form.Item name="by_code">
                        <Input placeholder='Tìm theo mã' allowClear />
                    </Form.Item>
                    <Form.Item name="by_market">
                        <Select
                            placeholder="Chọn tuyến tour"
                            options={markets}
                            allowClear
                            loading={markets?.length === 0}
                            optionFilterProp="label"
                            showSearch
                            listHeight={356}
                            dropdownStyle={{
                                width: selectWidth,
                                maxWidth: 550
                            }}
                            style={{ width: 250 }}
                        />
                    </Form.Item>
                    <PushSaleSelect notShowLabel={true} />
                    <Form.Item name="type">
                        <Select
                            placeholder="Loại"
                            options={[{ value: 'sgt', label: 'SGT' }, { value: 'tic', label: 'TIC' }]}
                            allowClear
                            style={{ width: 90 }}
                        />
                    </Form.Item>
                    {
                        showAll && <>
                            <ActiveSelect notShowLabel={true} />
                            <AdminRangePicker dates={dates} setDates={setDates} />
                        </>
                    }
                    <SearchButton />
                    <ResetButton onClick={reset} />
                </div>
                <Button
                    onClick={() => setShowAll(!showAll)}
                    icon={!showAll ? <CaretDownOutlined /> : <CaretUpOutlined />}
                />
            </Form>
        </section >
    );
};

export default AdminTourFilter;
