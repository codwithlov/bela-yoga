'use client'
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { ITagBase } from '@/interfaces/tag';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';

const AdminFeedbackFilter = (props: any) => {
    const { setParam, setPage, tagList } = props;
    const [form] = Form.useForm();

    const handleOnFilter = async (values: any) => {
        setPage(1);
        setParam(values);
    }

    const reset = () => {
        setParam({});
        form.resetFields();
        setPage(1);
    }

    const tagOptions = tagList?.map((item: ITagBase) => {
        return {
            value: item.id,
            label: item.name,
        }
    })

    return (
        <section>
            <Form
                onFinish={(value) => handleOnFilter(value)}
                initialValues={{ limit: 12 }}
                form={form}
            >
                <Row className='gap-2'>
                    <NumberPerPageSelect setParam={setParam} setPage={setPage} firstValue={12} />
                    <Col span={6}>
                        <Form.Item name="by_text">
                            <Input placeholder='Tìm tên, nội dung' allowClear />
                        </Form.Item>
                    </Col>
                    <Form.Item name="by_tag">
                        <Select
                            placeholder="Chọn tag"
                            options={tagOptions}
                            allowClear={true}
                            style={{ width: 210 }}
                            optionFilterProp="label"
                            popupMatchSelectWidth={false}
                        />
                    </Form.Item>
                    <Form.Item name="by_type">
                        <Select
                            placeholder="Chọn loại"
                            options={[
                                {
                                    value: 'GOOGLE',
                                },
                                {
                                    value: 'SGT',
                                }
                            ]}
                            allowClear={true}
                            style={{ width: 120 }}
                            optionFilterProp="label"
                            popupMatchSelectWidth={false}
                        />
                    </Form.Item>
                    <ActiveSelect notShowLabel={true} />
                    <SearchButton />
                    <ResetButton onClick={() => reset()} />
                </Row>
            </Form>
        </section >
    );
};

export default AdminFeedbackFilter;
