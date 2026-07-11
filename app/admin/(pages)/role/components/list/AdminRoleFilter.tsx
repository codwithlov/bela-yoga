'use client'
import { Form, Row } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';

const AdminRoleFilter = (props: any) => {
    const { setParam, setPage } = props;
    const [form] = Form.useForm();

    return (
        <section>
            <Form
                initialValues={{ limit: 10, }}
                form={form}
            >
                <Row className='gap-2'>
                    <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                </Row>
            </Form>
        </section >
    );
};

export default AdminRoleFilter;
