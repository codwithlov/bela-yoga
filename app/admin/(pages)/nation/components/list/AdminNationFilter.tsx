'use client'
import { Col, Form, Input, Row } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { getSlugFromUrl } from '@/utils/helper';

const AdminNationFilter = (props: any) => {
    const { setParam, setPage } = props;
    const [form] = Form.useForm();

    const reset = () => {
        setParam({});
        form.resetFields();
        setPage(1);
    }

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
                onFinish={onFinish}
                initialValues={{ limit: 10, }}
                form={form}
            >
                <Row className='gap-2'>
                    <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                    <Col span={6}>
                        <Form.Item name="by_name">
                            <Input placeholder='Tìm theo tên, slug, nội dung' allowClear />
                        </Form.Item>
                    </Col>
                    <ActiveSelect notShowLabel />
                    <SearchButton />
                    <ResetButton onClick={reset} />
                </Row>
            </Form>
        </section >
    );
};

export default AdminNationFilter;
