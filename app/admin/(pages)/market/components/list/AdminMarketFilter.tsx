'use client'
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import ColumnSelect from '@/components/admin/molecules/ColumnSelect';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { TrashCan } from '@/components/admin/atoms/TrashCan';
import { useState } from 'react';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { getSlugFromUrl } from '@/utils/helper';

const AdminMarketFilter = (props: any) => {
    const { setParam, setPage, columnsOptions, selectedColumns, setSelectedColumns, marketNames } = props;
    const [form] = Form.useForm();
    const [deleted, setDeleted] = useState(false);
    const userInfo = useGetUserInfo();

    const marketNamesOptions = (marketNames || []).map((item: any) => ({ value: item })).filter((item: any) => (item.value));

    const reset = () => {
        setParam({});
        form.resetFields();
        setPage(1);
    }

    const onTrashCanClicked = () => {
        form.resetFields();
        setParam({
            deleted: deleted ? 0 : 1,
        });
        setPage(1);
        setDeleted(!deleted);
    };

    const onFinish = (values: any) => {
        setParam({
            ...values,
            by_name: getSlugFromUrl(values.by_name),
        });
        setPage(1);
    }

    return (
        <section>
            <Form
                initialValues={{ limit: 10, }}
                onFinish={onFinish}
                form={form}
            >
                <Row className='gap-2'>
                    {
                        (userInfo?.permissionCodes || []).includes('MARKET_VIEW_TRASH') &&
                        <TrashCan onTrashCanClicked={onTrashCanClicked} deleted={deleted} />
                    }
                    <ColumnSelect
                        options={columnsOptions}
                        value={selectedColumns}
                        onChange={setSelectedColumns}
                        type='market'
                    />
                    <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                    {!deleted &&
                        <>
                            <Col span={6}>
                                <Form.Item name="by_name">
                                    <Input placeholder='Tìm theo tên, slug' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="by_market_name">
                                    <Select
                                        placeholder="Chọn thị trường"
                                        options={marketNamesOptions}
                                        allowClear
                                        loading={marketNamesOptions?.length === 0}
                                        showSearch
                                        popupMatchSelectWidth={false}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <ActiveSelect notShowLabel={true} />
                            <SearchButton />
                            <ResetButton onClick={reset} />
                        </>
                    }
                </Row>
            </Form>
        </section >
    );
};

export default AdminMarketFilter;
