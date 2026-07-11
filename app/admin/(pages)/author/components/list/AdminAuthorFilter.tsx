'use client';
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { authorRoles, authorRoleOptionsArray, activeOptionsArray } from '../AuthorFields';

const AdminAuthorFilter = (props: any) => {
  const { setParam, setPage } = props;
  const [form] = Form.useForm();
  const reset = () => {
    setParam({});
    form.resetFields();
    setPage(1);
  };
  return (
    <Form
      initialValues={{ limit: 10 }}
      form={form}
      onFinish={(value) => {
        setParam(value);
        setPage(1);
      }}
    >
      <Row className="gap-2">
        <NumberPerPageSelect setParam={setParam} setPage={setPage} />
        <Col span={4}>
          <Form.Item name="by_text">
            <Input placeholder="Tìm tên, nickname, slug" allowClear />
          </Form.Item>
        </Col>
        <Form.Item name="is_role_author">
          <Select
            options={authorRoleOptionsArray}
            placeholder="Chọn vai trò"
            style={{ minWidth: 160 }}
            allowClear
          />
        </Form.Item>
        <Form.Item name="is_active">
          <Select
            options={activeOptionsArray}
            placeholder="Chọn trạng thái"
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

export default AdminAuthorFilter;
