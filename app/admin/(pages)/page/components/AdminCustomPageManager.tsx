'use client';

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminStatGrid from '@/components/admin/sportverse/AdminStatGrid';
import { IAdminMenuCustomPage, IAdminMenuCustomPageSection, IAdminMenuItemRow, IAdminMenuTargetOption } from '@/interfaces/admin';
import { useGetAdminMenusQuery } from '@/services/api/admin';
import { usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { ADMIN_PAGE } from '@/constants/route';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Drawer, Form, Input, InputNumber, Select } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

const CustomEditor = dynamic(() => import('@/components/admin/atoms/CustomEditor'), { ssr: false });

const buildDefaultCustomPage = (title: string, path: string): IAdminMenuCustomPage => ({
    eyebrow: 'Custom page',
    summary: `${title} là custom page được quản trị trực tiếp từ menu. Có thể dùng như landing page mini cho ${path}.`,
    content: `<p>${title} là trang custom page đang được quản trị trong admin.</p><h2>Viết nội dung như WordPress</h2><p>Bạn có thể dùng editor để thêm bài giới thiệu, nội dung dài, CTA và section.</p>`,
    sections: [
        {
            id: Date.now(),
            title: `Section chính của ${title}`,
            summary: 'Section mẫu để bắt đầu biên tập.',
            content: '<p>Nội dung section mẫu...</p>',
            cta_label: 'Xem thêm',
            cta_href: '/gioi-thieu',
            sort_order: 1,
        },
    ],
    related_post_ids: [],
    keywords: `${title}, custom page, sportverse cms`,
    meta_title: title,
    meta_description: `${title} là custom page được quản trị từ menu.`,
});

const AdminCustomPageManager = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedMenuId = Number(searchParams.get('menuId') || 0) || null;
    const { data, isLoading, isFetching, error, refetch } = useGetAdminMenusQuery();
    const [postApi] = usePostDataMutation();
    const [rows, setRows] = useState<IAdminMenuItemRow[]>([]);
    const [saving, setSaving] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [editingRow, setEditingRow] = useState<IAdminMenuItemRow | null>(null);
    const [form] = Form.useForm<IAdminMenuCustomPage>();
    const isClosingDrawerRef = useRef(false);
    const postOptions = data?.data?.post_options || [];

    useEffect(() => {
        const customRows = (data?.data?.menus || []).filter((item) => item.page_type === 'custom');
        setRows(customRows);
    }, [data]);

    useEffect(() => {
        if (!selectedMenuId) {
            isClosingDrawerRef.current = false;
            return;
        }

        if (isClosingDrawerRef.current) return;

        if (!selectedMenuId || !rows.length) return;
        const matched = rows.find((item) => item.id === selectedMenuId);
        if (!matched) return;
        if (editingRow?.id === matched.id && openDrawer) return;

        setEditingRow(matched);
        form.setFieldsValue(matched.custom_page || buildDefaultCustomPage(matched.title, matched.path));
        setOpenDrawer(true);
    }, [selectedMenuId, rows, editingRow?.id, openDrawer, form]);

    const stats = useMemo(() => ({
        total: rows.length,
        header: rows.filter((item) => item.location === 'header').length,
        footer: rows.filter((item) => item.location === 'footer').length,
        sections: rows.reduce((total, item) => total + (item.custom_page?.sections?.length || 0), 0),
    }), [rows]);

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải custom page...' />;
    }

    if (error) {
        return <AdminPageState message='Không thể tải danh sách custom page từ admin API.' />;
    }

    const closeDrawer = () => {
        isClosingDrawerRef.current = true;
        setOpenDrawer(false);
        setEditingRow(null);
        form.resetFields();
        router.replace(ADMIN_PAGE);
    };

    const handleEdit = (row: IAdminMenuItemRow) => {
        isClosingDrawerRef.current = false;
        setEditingRow(row);
        form.setFieldsValue(row.custom_page || buildDefaultCustomPage(row.title, row.path));
        setOpenDrawer(true);
        router.replace(`${ADMIN_PAGE}?menuId=${row.id}`);
    };

    const handleSubmit = async () => {
        if (!editingRow) return;

        const values = await form.validateFields();
        const normalizedSections = (values.sections || []).map((section: IAdminMenuCustomPageSection, index: number) => ({
            ...section,
            id: Number(section.id || Date.now() + index),
            title: section.title,
            summary: section.summary || '',
            content: section.content || '<p>Nội dung section...</p>',
            cta_label: section.cta_label || null,
            cta_href: section.cta_href || null,
            sort_order: Number(section.sort_order || index + 1),
        }));

        await handleApiResponse(
            postApi({
                url: `admin/menus/${editingRow.id}`,
                method: 'PATCH',
                data: {
                    title: editingRow.title,
                    path: editingRow.path,
                    location: editingRow.location,
                    parent_id: editingRow.parent_id,
                    sort_order: editingRow.sort_order,
                    badge: editingRow.badge,
                    page_type: 'custom',
                    page_ref: null,
                    custom_page: {
                        eyebrow: values.eyebrow || 'Custom page',
                        summary: values.summary || '',
                        content: values.content || '<p>Nội dung đang được cập nhật.</p>',
                        sections: normalizedSections,
                        related_post_ids: values.related_post_ids || [],
                        keywords: values.keywords || '',
                        meta_title: values.meta_title || editingRow.title,
                        meta_description: values.meta_description || values.summary || '',
                    },
                },
            }),
            async () => {
                await refetch();
                closeDrawer();
            },
            setSaving,
        );
    };

    return (
        <div className='relative space-y-4'>
            <AdminPageHeader
                eyebrow='Pages'
                title='Quản lý custom page'
                description='Module này gom các page kiểu WordPress được sinh từ menu custom. Bạn có thể vào đây để chọn page, biên tập nội dung, thêm section và gắn bài viết liên quan.'
                badges={['Custom pages', 'Mini WordPress', 'Menu-driven pages']}
            />

            <AdminStatGrid
                items={[
                    { label: 'Tổng page', value: stats.total },
                    { label: 'Header page', value: stats.header },
                    { label: 'Footer page', value: stats.footer },
                    { label: 'Tổng section', value: stats.sections },
                ]}
            />

            <AdminDataTable
                title='Custom page library'
                description='Chỉ các menu có `page_type = custom` mới xuất hiện tại đây. Nhấn Edit để vào editor riêng của page.'
                rows={rows}
                emptyMessage='Chưa có custom page nào. Hãy tạo menu với page type là custom ở module Menu trước.'
                columns={[
                    {
                        key: 'title',
                        title: 'Page',
                        render: (row) => (
                            <div>
                                <div className='font-semibold text-bela-secondary-2'>{row.title}</div>
                                <div className='mt-1 text-xs text-bela-neutral-3'>{row.path}</div>
                                <div className='mt-2 text-xs text-bela-neutral-3'>{row.custom_page?.summary || 'Chưa có summary'}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'meta',
                        title: 'Metadata',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>Location: {row.location}</div>
                                <div>Sections: {row.custom_page?.sections?.length || 0}</div>
                                <div>Related posts: {row.custom_page?.related_post_ids?.length || 0}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'seo',
                        title: 'SEO',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div className='font-semibold text-bela-secondary-2'>{row.custom_page?.meta_title || row.title}</div>
                                <div className='line-clamp-3 text-bela-neutral-3'>{row.custom_page?.meta_description || 'Chưa có meta description'}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'actions',
                        title: 'Thao tác',
                        render: (row) => (
                            <div className='flex gap-2'>
                                <Button size='small' onClick={() => handleEdit(row)}>Edit</Button>
                                <Button size='small' icon={<EyeOutlined />} href={row.path} target='_blank'>View</Button>
                            </div>
                        ),
                    },
                ]}
            />

            <Drawer
                title={editingRow ? `Biên tập page: ${editingRow.title}` : 'Biên tập custom page'}
                open={openDrawer}
                onClose={closeDrawer}
                width='calc(100vw - var(--admin-sidebar-width, 200px))'
                rootStyle={{
                    left: 'var(--admin-sidebar-width, 200px)',
                    width: 'calc(100vw - var(--admin-sidebar-width, 200px))',
                }}
                destroyOnHidden={false}
                loading={saving}
                styles={{
                    body: {
                        minHeight: 'calc(100vh - 55px)',
                        overflowY: 'auto',
                    },
                }}
            >
                <Form form={form} layout='vertical'>
                    <div className='space-y-6 pb-24'>
                        <div className='grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]'>
                            <div className='space-y-6'>
                                <Card className='rounded-2xl border border-bela-gray-2'>
                                    <div className='mb-4'>
                                        <div className='text-xs font-semibold uppercase tracking-[0.2em] text-bela-primary-1'>Page editor</div>
                                        <div className='mt-1 text-sm text-bela-neutral-3'>Editor riêng cho custom page. Dùng để viết nội dung chính, các section phụ và khối bài viết liên quan.</div>
                                    </div>

                                    <div className='grid gap-4 md:grid-cols-2'>
                                        <Form.Item label='Eyebrow' name='eyebrow'>
                                            <Input placeholder='Custom page / Yoga / Landing' />
                                        </Form.Item>
                                        <Form.Item label='Keywords' name='keywords'>
                                            <Input placeholder='yoga, tap yoga, custom page' />
                                        </Form.Item>
                                    </div>

                                    <Form.Item label='Summary' name='summary' rules={[{ required: true, message: 'Nhập phần summary cho page' }]}>
                                        <Input.TextArea rows={4} placeholder='Tóm tắt phần mở đầu của custom page...' />
                                    </Form.Item>

                                    <Form.Item label='Nội dung chính' name='content' valuePropName='data' getValueFromEvent={(value) => value} rules={[{ required: true, message: 'Nhập nội dung chính cho page' }]}>
                                        <CustomEditor />
                                    </Form.Item>
                                </Card>

                                <Card className='rounded-2xl border border-bela-gray-2' title='Sections'>
                                    <Form.List name='sections'>
                                        {(fields, { add, remove }) => (
                                            <div className='space-y-4'>
                                                {fields.map((field, index) => (
                                                    <div key={field.key} className='rounded-2xl border border-bela-gray-2 p-4'>
                                                        <div className='mb-4 flex items-center justify-between gap-3'>
                                                            <div>
                                                                <div className='text-sm font-semibold text-bela-secondary-2'>Section #{index + 1}</div>
                                                                <div className='text-xs text-bela-neutral-3'>Khối nội dung con hiển thị bên dưới nội dung chính.</div>
                                                            </div>
                                                            <Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>Xoá section</Button>
                                                        </div>

                                                        <Form.Item name={[field.name, 'id']} hidden>
                                                            <InputNumber />
                                                        </Form.Item>

                                                        <div className='grid gap-4 md:grid-cols-2'>
                                                            <Form.Item label='Tiêu đề section' name={[field.name, 'title']} rules={[{ required: true, message: 'Nhập tiêu đề section' }]}>
                                                                <Input placeholder='Ví dụ: Lợi ích khi tập Yoga' />
                                                            </Form.Item>
                                                            <Form.Item label='Sort order' name={[field.name, 'sort_order']}>
                                                                <InputNumber className='w-full' min={1} />
                                                            </Form.Item>
                                                        </div>

                                                        <Form.Item label='Summary' name={[field.name, 'summary']}>
                                                            <Input.TextArea rows={3} placeholder='Tóm tắt ngắn của section...' />
                                                        </Form.Item>

                                                        <Form.Item label='Nội dung section' name={[field.name, 'content']} valuePropName='data' getValueFromEvent={(value) => value}>
                                                            <CustomEditor />
                                                        </Form.Item>

                                                        <div className='grid gap-4 md:grid-cols-2'>
                                                            <Form.Item label='CTA label' name={[field.name, 'cta_label']}>
                                                                <Input placeholder='Xem thêm / Đăng ký ngay' />
                                                            </Form.Item>
                                                            <Form.Item label='CTA href' name={[field.name, 'cta_href']}>
                                                                <Input placeholder='/gioi-thieu' />
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                ))}

                                                <Button type='dashed' icon={<PlusOutlined />} onClick={() => add({ id: Date.now(), title: '', summary: '', content: '<p>Nội dung section...</p>', cta_label: null, cta_href: null, sort_order: fields.length + 1 })}>
                                                    Thêm section
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>
                                </Card>
                            </div>

                            <div className='space-y-6'>
                                <Card className='rounded-2xl border border-bela-gray-2' title='Bài viết liên quan'>
                                    <Form.Item name='related_post_ids'>
                                        <Select
                                            mode='multiple'
                                            placeholder='Chọn bài viết để show ở cuối page'
                                            options={postOptions.map((item: IAdminMenuTargetOption) => ({
                                                label: `${item.title} (${item.path})`,
                                                value: item.id,
                                            }))}
                                            optionFilterProp='label'
                                            showSearch
                                        />
                                    </Form.Item>
                                    <div className='text-xs leading-6 text-bela-neutral-3'>Các bài này sẽ được render thành khối related posts ở cuối page.</div>
                                </Card>

                                <Card className='rounded-2xl border border-bela-gray-2' title='SEO'>
                                    <Form.Item label='Meta title' name='meta_title'>
                                        <Input placeholder='Meta title cho custom page' />
                                    </Form.Item>
                                    <Form.Item label='Meta description' name='meta_description'>
                                        <Input.TextArea rows={4} placeholder='Meta description cho custom page' />
                                    </Form.Item>
                                </Card>

                                <Card className='rounded-2xl border border-bela-gray-2' title='Điều hướng'>
                                    <div className='space-y-2 text-sm text-bela-neutral-3'>
                                        <div><span className='font-semibold text-bela-secondary-2'>Path:</span> {editingRow?.path}</div>
                                        <div><span className='font-semibold text-bela-secondary-2'>Location:</span> {editingRow?.location}</div>
                                        <div><span className='font-semibold text-bela-secondary-2'>Menu:</span> {editingRow?.title}</div>
                                        {editingRow?.path ? <Link href={editingRow.path} target='_blank' className='inline-flex pt-2 text-sm font-semibold text-bela-primary-1'>Mở public page ↗</Link> : null}
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className='flex justify-end gap-2'>
                            <Button onClick={closeDrawer}>Huỷ</Button>
                            <Button type='primary' onClick={handleSubmit}>Lưu page</Button>
                        </div>
                    </div>
                </Form>
            </Drawer>
        </div>
    );
};

export default AdminCustomPageManager;
