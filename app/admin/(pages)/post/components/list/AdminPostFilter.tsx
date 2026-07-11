'use client'
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { NumberPerPageSelect } from '@/components/admin/atoms/NumberPerPageSelect';
import { SearchButton } from '@/components/admin/atoms/SearchButton';
import { ResetButton } from '@/components/admin/atoms/ResetButton';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { TrashCan } from '@/components/admin/atoms/TrashCan';
import { useState } from 'react';
import { DraftBtn } from '@/components/admin/atoms/DraftBtn';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { getSlugFromUrl } from '@/utils/helper';
import ColumnSelect from '@/components/admin/molecules/ColumnSelect';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedColumns } from '@/store/selectColumnSlice';
import { TagSelect } from '@/components/admin/atoms/TagSelect';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

const AdminPostFilter = (props: any) => {
    const { setParam, setPage, setSubTitle, draftCount, postTypes, tagOptions } = props;
    const [form] = Form.useForm();
    const [deleted, setDeleted] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [showAll, setShowAll] = useState<any>(false);
    const userInfo = useGetUserInfo();
    const selectedColumns = useAppSelector((state) => state.selectColumn.selectedColumns);
    const columnsOptions = useAppSelector((state) => state.selectColumn.columnsOptions);
    const dispatch = useAppDispatch();

    const handleOnFilter = async (values: any) => {
        setPage(1);
        setParam({
            ...values,
            by_text: getSlugFromUrl(values.by_text),
            deleted: deleted ? 1 : 0,
            status: isDraft ? 'draft' : '',
        });
    }

    const reset = (param = {}, isClicked = false) => {
        if (isClicked) {
            setDeleted(false);
            setIsDraft(false);
        }
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
                className='flex justify-between'
            >
                <div className='flex flex-wrap gap-2'>
                    {
                        (userInfo?.permissionCodes || []).includes('POST_VIEW_TRASH') &&
                        <TrashCan onTrashCanClicked={onTrashCanClicked} deleted={deleted} />
                    }
                    {
                        (userInfo?.permissionCodes || []).includes('POST_CREATE') &&
                        <DraftBtn onDraftClicked={onDraftClicked} isDraft={isDraft} draftCount={draftCount} />
                    }
                    <ColumnSelect
                        options={columnsOptions}
                        value={selectedColumns}
                        onChange={(v: string[]) => dispatch(setSelectedColumns(v))}
                        type='post'
                    />
                    <NumberPerPageSelect setParam={setParam} setPage={setPage} />
                    <Form.Item name="by_text" className='w-64'>
                        <Input placeholder='Tìm tiêu đề, tác giả, slug, nội dung' allowClear />
                    </Form.Item>
                    <Form.Item name="by_type" className='w-44'>
                        <Select
                            placeholder="Chọn loại"
                            options={postTypes}
                            allowClear
                            optionFilterProp="label"
                            showSearch
                        >
                        </Select>
                    </Form.Item>
                    <TagSelect tagOptions={tagOptions} notShowLabel isNotMultiple name='by_tag' className='w-52' />
                    {!deleted && !isDraft && showAll &&
                        < ActiveSelect notShowLabel />
                    }
                    <SearchButton />
                    <ResetButton onClick={() => reset({}, true)} />
                </div>
                <Button
                    onClick={() => setShowAll(!showAll)}
                    icon={!showAll ? <CaretDownOutlined /> : <CaretUpOutlined />}
                />
            </Form>
        </section >
    );
};

export default AdminPostFilter;
