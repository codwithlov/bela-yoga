'use client'
import { Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { formatSelectArray, getSlugFromUrl } from '@/utils/helper';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { TrashCan } from '@/components/admin/atoms/TrashCan';
import { useState } from 'react';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { DraftBtn } from '@/components/admin/atoms/DraftBtn';

const AdminDestinationFilter = (props: any) => {
    const { nationsProp, setParam, setPage, setSubTitle, draftCount } = props;
    const [form] = Form.useForm();
    const [deleted, setDeleted] = useState(false);
    const userInfo = useGetUserInfo();
    const [isDraft, setIsDraft] = useState(false);

    const nations = formatSelectArray(nationsProp, 'nation_id', 'nation_name');

    const handleOnFilter = async (values: any) => {
        setPage(1);
        setParam({
            ...values,
            by_name: getSlugFromUrl(values.by_name),
        });
    }

    const reset = (param = {}) => {
        setParam(param);
        form.resetFields();
        setPage(1);
    }

    const onTrashCanClicked = () => {
        reset({ deleted: deleted ? 0 : 1 });
        setSubTitle(!deleted ? 'đã xóa' : '')
        setDeleted(!deleted);
        setIsDraft(false);
    };

    const onDraftClicked = () => {
        reset({ status: isDraft ? '' : 'draft' });
        setSubTitle(!isDraft ? 'nháp' : '')
        setDeleted(false);
        setIsDraft(!isDraft);
    };

    return (
        <section>
            <Form
                onFinish={(value) => handleOnFilter(value)}
                initialValues={{ limit: 10, }}
                form={form}
            >
                <Row className='gap-2'>
                    {
                        (userInfo?.permissionCodes || []).includes('DESTINATION_VIEW_TRASH') &&
                        <TrashCan onTrashCanClicked={onTrashCanClicked} deleted={deleted} />
                    }
                    {
                        (userInfo?.permissionCodes || []).includes('DESTINATION_CREATE') &&
                        <DraftBtn onDraftClicked={onDraftClicked} isDraft={isDraft} draftCount={draftCount} />
                    }
                    <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                    {!deleted && !isDraft &&
                        <>
                            <Col span={6}>
                                <Form.Item name="by_name">
                                    <Input placeholder='Tìm theo tên, slug, nội dung' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="by_nation">
                                    <Select
                                        placeholder="Chọn quốc gia"
                                        options={nations}
                                        allowClear
                                        loading={nations?.length === 0}
                                        optionFilterProp="label"
                                        showSearch
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <ActiveSelect notShowLabel />
                            <SearchButton />
                            <ResetButton onClick={() => reset()} />
                        </>
                    }
                </Row>
            </Form>
        </section >
    );
};

export default AdminDestinationFilter;
