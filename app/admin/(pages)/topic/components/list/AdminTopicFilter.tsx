'use client'
import { Col, Form, Input, Row } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { TrashCan } from '@/components/admin/atoms/TrashCan';
import { useState } from 'react';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { DraftBtn } from '@/components/admin/atoms/DraftBtn';
import { getSlugFromUrl } from '@/utils/helper';

const AdminTopicFilter = (props: any) => {
    const { setParam, setPage, initParam, setSubTitle, draftCount } = props;
    const [form] = Form.useForm();
    const [deleted, setDeleted] = useState(false);
    const userInfo = useGetUserInfo();
    const [isDraft, setIsDraft] = useState(false);

    const onFinish = (values: any) => {
        setParam((previousValue: any) => ({
            ...previousValue,
            page: 1,
            ...values,
            filter_search: getSlugFromUrl(values.filter_search),
        }));
        setPage(1);
    };

    const reset = (param = {}) => {
        setParam({ ...param, ...initParam, });
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
        <Form
            onFinish={onFinish}
            initialValues={{ limit: 10, }}
            form={form}
        >
            <Row className='gap-2'>
                {
                    (userInfo?.permissionCodes || []).includes('TOPIC_VIEW_TRASH') &&
                    <TrashCan onTrashCanClicked={onTrashCanClicked} deleted={deleted} />
                }
                {
                    (userInfo?.permissionCodes || []).includes('TOPIC_CREATE') &&
                    <DraftBtn onDraftClicked={onDraftClicked} isDraft={isDraft} draftCount={draftCount} />
                }
                <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                {!deleted &&
                    <>
                        <Col span={6}>
                            <Form.Item className='col-span-3' name="filter_search">
                                <Input placeholder='Tìm theo tên, slug, nội dung' allowClear />
                            </Form.Item>
                        </Col>
                        <ActiveSelect notShowLabel />
                        <SearchButton />
                        <ResetButton onClick={() => reset()} />
                    </>
                }
            </Row>
        </Form>
    );
};

export default AdminTopicFilter;
