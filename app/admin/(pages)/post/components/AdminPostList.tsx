'use client';

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminStatGrid from '@/components/admin/sportverse/AdminStatGrid';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import SeoCollapse from '@/components/admin/molecules/SeoCollapse';
import SeoWarningBtn from '@/components/admin/molecules/SeoWarningBtn';
import { IAdminPostRow } from '@/interfaces/admin';
import { useGetAdminPostsQuery } from '@/services/api/admin';
import { useDeleteMutation, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { Button, DatePicker, Drawer, Form, Input, Select, Switch } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

const slugify = (value: string) => value.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const buildCanonical = (slug: string) => `/bai-viet/${slug}`;
const CustomEditor = dynamic(() => import('@/components/admin/atoms/CustomEditor'), { ssr: false });

const POST_CATEGORIES = ['Platform Update', 'Template Guide', 'Community News', 'Case Study', 'SEO Content', 'Organization Story'];
const POST_STATUSES: IAdminPostRow['status'][] = ['draft', 'review', 'published'];
const POST_PLACEMENTS: IAdminPostRow['placement'][] = ['home_hero', 'news_feed', 'seo_landing', 'organization_story'];

const AdminPostList = () => {
    const { data, isLoading, isFetching, error, refetch } = useGetAdminPostsQuery();
    const [rows, setRows] = useState<IAdminPostRow[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingRow, setEditingRow] = useState<IAdminPostRow | null>(null);
    const [form] = Form.useForm();
    const [postApi] = usePostDataMutation();
    const [deleteApi] = useDeleteMutation();
    const { handleConfirm, confirmModal } = useConfirm();
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [seoCollapseScore, setSeoCollapseScore] = useState(0);
    const [seoWarningScore, setSeoWarningScore] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const autoUpdatingSlugRef = useRef(false);
    const keywordPool = useMemo(() => Array.from(new Set(rows.flatMap((row) => (row.keywords || '').split(',').map((keyword) => keyword.trim().toLowerCase()).filter(Boolean)))), [rows]);

    useEffect(() => {
        if (data?.data?.posts) {
            setRows(data.data.posts);
        }
    }, [data]);

    const stats = useMemo(() => ({
        total: rows.length,
        published: rows.filter((row) => row.status === 'published').length,
        draft: rows.filter((row) => row.status === 'draft').length,
        featured: rows.filter((row) => row.featured).length,
    }), [rows]);

    const pageState = isLoading || isFetching
        ? <AdminPageState message='Đang tải danh sách bài viết mẫu...' />
        : error
            ? <AdminPageState message='Không thể tải danh sách bài viết template từ admin API.' />
            : null;

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const publishedAt = values.status === 'published'
            ? (values.published_at ? values.published_at.toISOString() : editingRow?.published_at || new Date().toISOString())
            : null;
        const slug = slugify(values.slug || values.title);
        const nextRow = {
            title: values.title,
            slug,
            category: values.category,
            excerpt: values.excerpt,
            description: values.description,
            author_name: values.author_name,
            status: values.status,
            published_at: publishedAt,
            featured: Boolean(values.featured),
            placement: values.placement,
            keywords: values.keywords || '',
            meta_title: values.meta_title || values.title,
            meta_description: values.meta_description || values.excerpt,
            canonical: values.canonical || buildCanonical(slug),
            index: Boolean(values.index),
            follow: Boolean(values.follow),
        };

        await handleApiResponse(
            postApi({ url: editingRow ? `admin/posts/${editingRow.id}` : 'admin/posts', data: nextRow, method: editingRow ? 'PATCH' : 'POST' }),
            async () => {
                await refetch();
                form.resetFields();
                setEditingRow(null);
                setOpenDrawer(false);
            },
            setSaving,
        );
    };

    const handleEdit = (row: IAdminPostRow) => {
        setEditingRow(row);
        setSlugManuallyEdited(true);
        form.setFieldsValue({
            title: row.title,
            slug: row.slug,
            category: row.category,
            excerpt: row.excerpt,
            description: row.description,
            author_name: row.author_name,
            status: row.status,
            featured: row.featured,
            placement: row.placement,
            keywords: row.keywords,
            meta_title: row.meta_title,
            meta_description: row.meta_description,
            canonical: row.canonical,
            index: row.index,
            follow: row.follow,
            published_at: row.published_at ? dayjs(row.published_at) : null,
        });
        setOpenDrawer(true);
    };

    const resetEditorState = () => {
        setEditingRow(null);
        setSlugManuallyEdited(false);
        setSeoCollapseScore(0);
        setSeoWarningScore(0);
        form.resetFields();
        form.setFieldsValue({
            status: 'draft',
            placement: 'news_feed',
            featured: false,
            index: true,
            follow: true,
            published_at: null,
        });
    };

    const handleCreate = () => {
        resetEditorState();
        setOpenDrawer(true);
    };

    const handleValuesChange = (changedValues: Partial<IAdminPostRow>) => {
        if (typeof changedValues.title === 'string' && !slugManuallyEdited) {
            const nextSlug = slugify(changedValues.title);
            autoUpdatingSlugRef.current = true;
            form.setFieldValue('slug', nextSlug);
            if (!form.getFieldValue('canonical')) {
                form.setFieldValue('canonical', buildCanonical(nextSlug));
            }
            if (!form.getFieldValue('meta_title')) {
                form.setFieldValue('meta_title', changedValues.title);
            }
        }

        if (typeof changedValues.slug === 'string') {
            const normalizedSlug = slugify(changedValues.slug);
            if (autoUpdatingSlugRef.current) {
                autoUpdatingSlugRef.current = false;
            } else {
                setSlugManuallyEdited(true);
            }
            if (changedValues.slug !== normalizedSlug) {
                form.setFieldValue('slug', normalizedSlug);
            }
            const currentCanonical = form.getFieldValue('canonical');
            if (!currentCanonical || currentCanonical === buildCanonical(editingRow?.slug || '')) {
                form.setFieldValue('canonical', buildCanonical(normalizedSlug));
            }
        }

        if (typeof changedValues.excerpt === 'string' && !form.getFieldValue('meta_description')) {
            form.setFieldValue('meta_description', changedValues.excerpt);
        }
    };

    const handleDelete = async (row: IAdminPostRow) => {
        handleConfirm(
            `Bạn có chắc muốn xóa bài viết "${row.title}"?`,
            async () => {
                await handleApiResponse(
                    deleteApi({ url: `admin/posts/${row.id}` }),
                    async () => {
                        await refetch();
                    },
                    setSaving,
                );
            },
            'Xóa',
        );
    };

    return (
        <div className='relative space-y-4'>
            <AdminPageHeader
                eyebrow='Posts'
                title='Quản trị bài viết template'
                description='Module này đóng vai trò như phần blog/CMS cơ bản kiểu WordPress: có bài mẫu, trạng thái xuất bản, vị trí hiển thị và form thêm mới để đội dự án tái sử dụng sau này.'
                badges={['Template-ready', 'Demo content', 'No external backend required']}
            />

            <div className='flex justify-end'>
                <Button type='primary' onClick={handleCreate}>Thêm bài viết mẫu</Button>
            </div>

            {pageState || (
                <>
                    <AdminStatGrid
                        items={[
                            { label: 'Tổng bài viết', value: stats.total },
                            { label: 'Đã xuất bản', value: stats.published },
                            { label: 'Bản nháp', value: stats.draft },
                            { label: 'Bài nổi bật', value: stats.featured },
                        ]}
                    />

                    <AdminDataTable
                        title='Post library'
                        description='Các bài viết mẫu phục vụ homepage, SEO landing, community feed và story page.'
                        rows={rows}
                        emptyMessage='Chưa có bài viết nào.'
                        columns={[
                            {
                                key: 'title',
                                title: 'Bài viết',
                                render: (row) => (
                                    <div>
                                        <div className='font-semibold text-sgt-secondary-2'>{row.title}</div>
                                        <div className='mt-1 text-xs text-sgt-neutral-3'>/{row.slug}</div>
                                        <div className='mt-2 text-xs text-sgt-neutral-3'>{row.excerpt}</div>
                                        <div className='mt-2 text-[11px] uppercase tracking-[0.18em] text-sgt-primary-1'>{row.meta_title}</div>
                                    </div>
                                ),
                            },
                            {
                                key: 'meta',
                                title: 'Metadata',
                                render: (row) => (
                                    <div className='space-y-1 text-xs'>
                                        <div>{row.category}</div>
                                        <div>{row.author_name}</div>
                                        <div>{row.placement}</div>
                                        <div className='line-clamp-2 text-sgt-neutral-3'>{row.keywords || 'Chưa có từ khóa'}</div>
                                    </div>
                                ),
                            },
                            {
                                key: 'status',
                                title: 'Trạng thái',
                                render: (row) => (
                                    <div className='space-y-1 text-xs'>
                                        <div className='inline-flex rounded-full bg-sgt-bg-primary px-3 py-1 font-semibold text-sgt-primary-1'>{row.status}</div>
                                        <div>{row.featured ? 'Featured' : 'Standard'}</div>
                                    </div>
                                ),
                            },
                            {
                                key: 'published_at',
                                title: 'Publish',
                                render: (row) => row.published_at ? new Date(row.published_at).toLocaleString('vi-VN') : 'Chưa xuất bản',
                            },
                            {
                                key: 'actions',
                                title: 'Thao tác',
                                render: (row) => (
                                    <div className='flex gap-2'>
                                        <Button size='small' onClick={() => handleEdit(row)}>Edit</Button>
                                        <Button size='small' danger onClick={() => handleDelete(row)}>Delete</Button>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </>
            )}

            <Drawer title={editingRow ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mẫu'} open={openDrawer} onClose={() => {
                setOpenDrawer(false);
                resetEditorState();
            }} width='100%' getContainer={false} rootStyle={{ position: 'absolute' }} destroyOnHidden={false} loading={saving}>
                <Form
                    layout='vertical'
                    form={form}
                    initialValues={{ status: 'draft', placement: 'news_feed', featured: false, index: true, follow: true }}
                    onValuesChange={handleValuesChange}
                >
                    <div ref={contentRef} className='space-y-6 pb-24'>
                        <div className='grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]'>
                            <div className='space-y-4'>
                                <div className='rounded-2xl border border-sgt-gray-2 bg-white p-4'>
                                    <div className='mb-4'>
                                        <div className='text-xs font-semibold uppercase tracking-[0.2em] text-sgt-primary-1'>Biên tập bài viết</div>
                                        <div className='mt-1 text-sm text-sgt-neutral-3'>Bố cục được làm lại theo hướng thân thiện hơn: có phần nội dung dài, preview SEO và cấu hình xuất bản như WordPress.</div>
                                    </div>

                                    <Form.Item label='Tiêu đề' name='title' rules={[{ required: true, message: 'Nhập tiêu đề bài viết' }]}>
                                        <Input placeholder='Ví dụ: Tin mới từ SPORTVERSE' size='large' />
                                    </Form.Item>

                                    <div className='grid gap-4 md:grid-cols-2'>
                                        <Form.Item label='Slug' name='slug' rules={[{ required: true, message: 'Nhập slug' }]}>
                                            <Input placeholder='tin-moi-tu-sportverse' />
                                        </Form.Item>
                                        <Form.Item label='Canonical URL' name='canonical'>
                                            <Input placeholder='/bai-viet/tin-moi-tu-sportverse' />
                                        </Form.Item>
                                    </div>

                                    <Form.Item label='Tóm tắt' name='excerpt' rules={[{ required: true, message: 'Nhập tóm tắt' }]}>
                                        <Input.TextArea rows={4} placeholder='Tóm tắt ngắn cho card/listing...' />
                                    </Form.Item>

                                    <Form.Item label='Nội dung bài viết' name='description' valuePropName='data' getValueFromEvent={(value) => value} rules={[{ required: true, message: 'Nhập nội dung bài viết' }]}>
                                        <CustomEditor />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <div className='rounded-2xl border border-sgt-gray-2 bg-sgt-bg-primary p-4'>
                                    <div className='text-sm font-semibold text-sgt-secondary-2'>Xuất bản</div>
                                    <div className='mt-3 grid gap-4'>
                                        <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
                                            <Select options={POST_STATUSES.map((value) => ({ label: value, value }))} />
                                        </Form.Item>
                                        <Form.Item label='Ngày đăng' name='published_at'>
                                            <DatePicker className='w-full' showTime format='HH:mm DD/MM/YYYY' placeholder='Chọn ngày đăng' />
                                        </Form.Item>
                                        <Form.Item label='Bài nổi bật' name='featured' valuePropName='checked'>
                                            <Switch />
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className='rounded-2xl border border-sgt-gray-2 bg-white p-4'>
                                    <div className='text-sm font-semibold text-sgt-secondary-2'>Phân loại & hiển thị</div>
                                    <div className='mt-3 grid gap-4'>
                                        <Form.Item label='Danh mục' name='category' rules={[{ required: true, message: 'Chọn danh mục' }]}>
                                            <Select options={POST_CATEGORIES.map((value) => ({ label: value, value }))} showSearch optionFilterProp='label' />
                                        </Form.Item>
                                        <Form.Item label='Tác giả' name='author_name' rules={[{ required: true, message: 'Nhập tác giả' }]}>
                                            <Input placeholder='SV Super Admin' />
                                        </Form.Item>
                                        <Form.Item label='Vị trí hiển thị' name='placement' rules={[{ required: true, message: 'Chọn placement' }]}>
                                            <Select options={POST_PLACEMENTS.map((value) => ({ label: value, value }))} />
                                        </Form.Item>
                                        <Form.Item label='Từ khóa chính' name='keywords'>
                                            <Input.TextArea rows={3} placeholder='sportverse cms, nextjs blog, landing page seo' />
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className='rounded-2xl border border-sgt-gray-2 bg-white p-4'>
                                    <div className='mb-3 flex items-center justify-between'>
                                        <div>
                                            <div className='text-sm font-semibold text-sgt-secondary-2'>SEO</div>
                                            <div className='text-xs text-sgt-neutral-3'>Điểm nhanh: {seoCollapseScore + seoWarningScore}/15</div>
                                        </div>
                                    </div>
                                    <SeoCollapse
                                        form={form}
                                        getFormValue={(value: string) => form.getFieldValue(value)}
                                        fieldNames={['description']}
                                        allKeywords={keywordPool}
                                        setSeoCollapseScore={setSeoCollapseScore}
                                    />
                                </div>

                                <div className='rounded-2xl border border-sgt-gray-2 bg-white p-4'>
                                    <div className='text-sm font-semibold text-sgt-secondary-2'>Preview snippet</div>
                                    <div className='mt-3 rounded-xl border border-dashed border-sgt-gray-2 p-4'>
                                        <div className='text-xs text-green-700'>{form.getFieldValue('canonical') || buildCanonical(form.getFieldValue('slug') || '')}</div>
                                        <div className='mt-1 text-lg font-semibold text-blue-700'>{form.getFieldValue('meta_title') || form.getFieldValue('title') || 'Meta title'}</div>
                                        <div className='mt-1 text-sm text-sgt-neutral-3'>{form.getFieldValue('meta_description') || form.getFieldValue('excerpt') || 'Meta description sẽ hiển thị ở đây.'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SeoWarningBtn
                            form={form}
                            getFormValue={(value: string) => form.getFieldValue(value)}
                            slugName='slug'
                            fieldNames={['description']}
                            sapoName='description'
                            endArticleName='description'
                            setSeoWarningScore={setSeoWarningScore}
                        />
                    </div>

                    <div className='sticky bottom-0 left-0 right-0 -mx-6 -mb-6 mt-6 border-t border-sgt-gray-2 bg-white px-6 py-4'>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <div className='text-xs text-sgt-neutral-3'>SEO score hiện tại: <span className='font-semibold text-sgt-secondary-2'>{seoCollapseScore + seoWarningScore}/15</span></div>
                            <div className='flex gap-2'>
                                <Button onClick={() => {
                                    setOpenDrawer(false);
                                    resetEditorState();
                                }}>Huỷ</Button>
                                <Button type='primary' onClick={handleSubmit}>{editingRow ? 'Lưu thay đổi' : 'Tạo bài mẫu'}</Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Drawer>

            {confirmModal}
        </div>
    );
};

export default AdminPostList;