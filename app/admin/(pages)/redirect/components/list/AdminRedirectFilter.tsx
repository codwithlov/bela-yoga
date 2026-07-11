'use client'
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';

const AdminRedirectFilter = (props: any) => {
    const { setParam, setPage } = props;
    const [form] = Form.useForm();
    const reset = () => {
        setParam({});
        form.resetFields();
        setPage(1);
    }
    return (
        <Form
            initialValues={{ limit: 10, }}
            form={form}
            onFinish={(value) => { setParam(value); setPage(1); }}
        >
            <Row className='gap-2'>
                <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                <Col span={6}>
                    <Form.Item name="by_text">
                        <Input placeholder='Tìm đường dẫn' allowClear />
                    </Form.Item>
                </Col>
                <SearchButton />
                <ResetButton onClick={reset} />
            </Row>
        </Form>
    );
};

export default AdminRedirectFilter;
