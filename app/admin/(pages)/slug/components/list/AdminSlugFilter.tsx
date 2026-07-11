'use client'
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { formatSelectArray } from '@/utils/helper';

const AdminSlugFilter = (props: any) => {
    const { setParam, setPage, slugEntities } = props;
    const [form] = Form.useForm();
    const reset = () => {
        setParam({});
        form.resetFields();
        setPage(1);
    }
    const slugEntityOptions = formatSelectArray(slugEntities, 'type', 'type_name');

    return (
        <Form
            initialValues={{ limit: 10, }}
            form={form}
            onFinish={(value) => { setParam(value); setPage(1); }}
        >
            <Row className='gap-2'>
                <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                <Col span={4}>
                    <Form.Item name="by_slug">
                        <Input placeholder='Tìm slug' allowClear />
                    </Form.Item>
                </Col>
                <Form.Item name="by_entity_type">
                    <Select
                        options={slugEntityOptions}
                        placeholder='Chọn loại slug'
                        style={{ minWidth: 160 }}
                        allowClear
                    />
                </Form.Item>
                <SearchButton />
                <ResetButton onClick={reset} />
            </Row>
        </Form>
    );
};

export default AdminSlugFilter;
