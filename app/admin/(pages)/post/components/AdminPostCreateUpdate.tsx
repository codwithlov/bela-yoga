import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { POST } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Col, DatePicker, Form, Input, message, Row, Select } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { getSlug, handleApiResponse } from '@/utils/helper';
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import dynamic from 'next/dynamic';
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';
import SeoWarningBtn from '@/components/admin/molecules/SeoWarningBtn';
import { IUser } from '@/interfaces/user';
// import { postTypes } from '@/constants/options';
import { IAuthor } from '@/interfaces/user';
import { formatDateTime } from '@/utils/formatDate';
import dayjs from 'dayjs';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { autoSave } from '@/utils/localStorage';
import AutoSaveBtn from '@/components/admin/molecules/AutoSaveBtn';
import { SEO_CONDITION_COUNT } from '@/constants/Post';
import { AUTO_SAVE_DRAFT_TIME } from '@/constants/api';

import { TagSelect } from '@/components/admin/atoms/TagSelect';
import { PostType } from '@/interfaces/post';
import { ITagType } from '@/interfaces/tag';
const CustomEditor = dynamic(() => import('@/components/admin/atoms/CustomEditor'), { ssr: false });

type Params = {
    post_id?: string,
    reloadDataList?: any,
    closeModal?: any,
    open?: boolean,
}

const AdminPostCreateUpdate: React.FC<Params> = ({
    post_id,
    closeModal,
    reloadDataList,
    open
}) => {
    const isEdit = !!post_id;
    const localStorageName = 'post' + post_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [histories, setHistories] = useState([]);
    const seoCollapseScore = useRef<number>(0);
    const seoWarningScore = useRef<number>(0);
    const draftId = useRef(null);
    const isActive = useRef(1);
    const divRef = useRef<HTMLDivElement>(null);
    const isChanged = useRef(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [storeUpdateApi] = usePostDataMutation();
    const { handleConfirm, confirmModal } = useConfirm();
    const [tagOptions, setTagOptions] = useState<any[]>();
    const getUrl = `${POST}/${(isEdit ? post_id + '/edit' : 'create')}`;
    const { data: initData, isFetching, refetch } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });
    const isDraft = initData?.data?.post?.status === 'draft' || !isEdit;

    const authors = (initData?.data?.authors || []).map((item: IAuthor) => ({
        value: item.id,
        label: item.display_name,
    }))

    //isDone mean save button clicked
    // isAutoSave = true when some thing is changed and post has published already
    const handleOnSubmit = useCallback(
        async (isDone = false, isAutoSave = false, forceSaveDraft = false) => {
            if ((!form.getFieldValue('post_slug') || !isChanged.current) && !isDone) return;
            const values = isDone ? await form.validateFields() : form.getFieldsValue();
            const submit = async () => {
                isChanged.current = false;
                if (isAutoSave) {
                    autoSave(localStorageName, values);
                    messageApi.open({
                        type: 'success',
                        content: 'Đã tự động lưu thông tin vào bộ nhớ tạm',
                    });
                    return;
                }
                values.publish_date = formatDateTime(values.publish_date);
                values.seo_score =(seoWarningScore.current + seoCollapseScore.current)/SEO_CONDITION_COUNT * 100;
                values.status = isDone ? 'done' : initData?.data?.post?.status || (isEdit ? 'done' : 'draft')

                const postData = {
                    url: POST + ((!isEdit && !draftId.current) ? '' : `/${(post_id || draftId.current)}?_method=PUT`),
                    data: values,
                };
                await handleApiResponse(
                    storeUpdateApi(postData),
                    (payload: any) => {
                        if (isDone) {
                            localStorage.removeItem(localStorageName);
                            isActive.current = values.is_active;
                            showSuccessToastr(payload?.message);
                            if (!isEdit) {
                                closeModal();
                                form.resetFields();
                                form.setFieldsValue({ is_active: 1 });
                            }
                            if (initData?.data?.post?.status === 'draft') {
                                refetch();
                            }
                        } else {
                            // when auto save draft on create mode
                            if (!isDone && !isEdit && !draftId.current) {
                                draftId.current = payload?.data?.id;
                                messageApi.open({
                                    type: 'success',
                                    content: 'Đã lưu bản nháp',
                                });
                            } else {
                                messageApi.open({
                                    type: 'success',
                                    content: forceSaveDraft ? 'Đã lưu bản nháp' : 'Đã tự động lưu',
                                });
                            }
                        }
                        setHistories(payload?.data?.histories);
                        reloadDataList();
                    },
                    isDone || forceSaveDraft ? setSpinning : () => { },
                    !isDone ? messageApi : ''
                );
            }

            if (isDone && values.is_active === 0 && isActive.current === 1 && !isAutoSave) {
                handleConfirm('Xác nhận đổi trạng thái, link của bài viết sẽ không còn trỏ tới bài khác', submit, 'OK');
            } else {
                submit();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form, post_id, draftId, initData?.data?.post?.status]
    );

    useEffect(() => {
        if (initData) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                if (isEdit) {
                    const data = initData?.data;
                    getTagTypeRange(data?.post.post_type_id);
                    form.setFieldsValue({
                        ...data?.post,
                        ...data?.slugPermalink,
                        publish_date: data?.post?.publish_date ? dayjs(data?.post?.publish_date) : null,
                        post_slug: getSlug(data?.slugPermalink),
                    });
                    setDescription(data?.post?.description || '');
                    isActive.current = data?.post?.is_active;
                    setHistories(data?.post?.histories);
                } else {
                    setTagOptions(initData?.data?.tagOptions);
                    form.setFieldsValue({ is_active: 1 });
                    isActive.current = 1;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData]);

    // auto save
    useEffect(() => {
        const interval = setInterval(() => {
            if (open) {
                const isDraft = !isEdit || initData?.data?.post?.status === 'draft';
                handleOnSubmit(false, !isDraft);
            }
        }, AUTO_SAVE_DRAFT_TIME);

        return () => clearInterval(interval);
    }, [handleOnSubmit, initData?.data?.post?.status, isEdit, open]);

    const updateCanonical = () => {
        const parentSlug = (initData?.data?.slugs || []).find((v: any) => v.id === form.getFieldValue('parent_id'))?.slug;
        form.setFieldValue('canonical', `${parentSlug ?? ''}${parentSlug ? '/' : ''}${form.getFieldValue('post_slug') ?? ''}`);
    }

    const restore = (values: any) => {
        form.setFieldsValue({
            ...values,
            publish_date: values.publish_date ? dayjs(values.publish_date) : null,
        });
        setDescription(values.description || '');
    }

    const getTagTypeId = ((v: any) => {
        let tagTypeId = 0;
        let postType = (initData?.data?.postTypes as PostType[]).filter((i: PostType) => i.value == v);
        if (postType.length > 0) {
            return tagTypeId = postType[0].tag_type_id;
        }
        return tagTypeId;
    });

    const getTagTypeRange = ((v: any) => {
        let tagTypeId = getTagTypeId(v);
        let tagTypeRange = (initData?.data?.tagOptions as ITagType[])
            .filter((i: ITagType) => {
                return i.tag_type_id == tagTypeId
            });
        if (tagTypeRange.length > 0) {
            setTagOptions(tagTypeRange);
        } else {
            setTagOptions(initData?.data?.tagOptions);
        }
    })

    const handleOnChangePostType = async (v: any) => {
        getTagTypeRange(v);
        form.setFieldsValue({ tags: [] });
    };


    return (
        <>
            {spinning && <AdminLoading isLoading={true} />}
            <div className="pb-5">
                <DrawerLoading isLoading={isFetching} />
                <Form
                    key={'formSubmit'}
                    form={form}
                    layout="vertical"
                    onFinish={() => handleOnSubmit(true)}
                    validateMessages={validateMessages}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                    onValuesChange={() => isChanged.current = true}
                >
                    <div ref={divRef}>
                        <SeoCollapse
                            form={form}
                            getFormValue={(v: string) => form.getFieldValue(v)}
                            allKeywords={initData?.data?.allKeywords}
                            setSeoCollapseScore={(v: number) => seoCollapseScore.current = v}
                        />
                        <Row gutter={12}>
                            <Col span={6}>
                                <Form.Item name="post_type_id" label="Loại bài viết" rules={[{ required: true }]}>
                                    <Select
                                        placeholder="Chọn loại bài viết"
                                        options={initData?.data?.postTypes}
                                        onChange={(v) => handleOnChangePostType(v)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <ActiveSelect />
                            </Col>
                            <Col span={6}>
                                <Form.Item name="author_id" label="Tác giả">
                                    <Select
                                        placeholder="Chọn tác giả"
                                        options={authors}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="publish_date" label="Ngày đăng" rules={[{ required: true }]}>
                                    <DatePicker className="w-full" placeholder='Ngày đăng' format='HH:mm:ss DD/MM/YYYY' showTime />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <SlugPrefixSelect slugs={initData?.data?.slugs} onChange={updateCanonical} />
                            </Col>
                            <Col span={8}>
                                <Form.Item name="post_slug" label="Slug" rules={[{ required: true }]}>
                                    <Input onChange={updateCanonical} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <TagSelect tagOptions={tagOptions} />
                            </Col>
                            <Col span={12}>
                                <Form.Item name="market_ids" label="Tuyến tour liên quan">
                                    <Select
                                        placeholder="Chọn tuyến tour liên quan"
                                        options={initData?.data?.marketOptions}
                                        mode="multiple"
                                        allowClear
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <TagSelect tagOptions={initData?.data?.tagOptions} name="related_tag_ids" label="Tag liên quan"/>
                            </Col>
                        </Row>
                        <div className={'flex flex-1 justify-center bg-bela-bg-primary mb-2'}>
                            <Form.Item name="description" className='w-[800px] !my-2'>
                                <CustomEditor data={description} histories={histories} type="description" />
                            </Form.Item>
                        </div>
                    </div>
                    <AutoSaveBtn
                        name={localStorageName}
                        rollbackFunc={restore}
                        isDraft={isDraft}
                    />
                    <SeoWarningBtn
                        form={form}
                        getFormValue={(v: string) => form.getFieldValue(v)}
                        slugName="post_slug"
                        endArticleName="description"
                        setSeoWarningScore={(v: number) => (seoWarningScore.current = v)}
                    />
                    <DrawerFormBtn
                        divRef={divRef}
                        isEdit={isEdit}
                        text={isDraft ? 'Xuất bản' : ''}
                        isDraft={isDraft}
                        onSaveDraftClicked={() => handleOnSubmit(false, false, true)}
                    />
                </Form>
            </div>
            {contextHolder}
            {confirmModal}
        </>
    )
}

export default AdminPostCreateUpdate

