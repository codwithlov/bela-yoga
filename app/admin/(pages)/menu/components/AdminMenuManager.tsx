import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminStatGrid from '@/components/admin/sportverse/AdminStatGrid';
import { ADMIN_PAGE } from '@/constants/route';
import { IAdminMenuCustomPage, IAdminMenuCustomPageSection, IAdminMenuItemRow, IAdminMenuTargetOption } from '@/interfaces/admin';
import { useGetAdminMenusQuery } from '@/services/api/admin';
import { useDeleteMutation, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { Button, Card, Drawer, Form, Input, InputNumber, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const CustomEditor = dynamic(() => import('@/components/admin/atoms/CustomEditor'), { ssr: false });

const MENU_PAGE_TYPES: Array<{ label: string; value: IAdminMenuItemRow['page_type'] }> = [
    { label: 'Custom path', value: 'custom' },
    { label: 'Bài viết', value: 'post' },
    { label: 'CMS page', value: 'cms_page' },
];

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

const AdminMenuManager = () => {
    const { data, isLoading, isFetching, error, refetch } = useGetAdminMenusQuery();
    const [menuRows, setMenuRows] = useState<IAdminMenuItemRow[]>([]);
    const [openMenuDrawer, setOpenMenuDrawer] = useState(false);
    const [openCustomPageDrawer, setOpenCustomPageDrawer] = useState(false);
    const [savingMenu, setSavingMenu] = useState(false);
    const [editingMenu, setEditingMenu] = useState<IAdminMenuItemRow | null>(null);
    const [editingCustomPageMenu, setEditingCustomPageMenu] = useState<IAdminMenuItemRow | null>(null);
    const [menuForm] = Form.useForm();
    const [customPageForm] = Form.useForm<IAdminMenuCustomPage>();
    const [postApi] = usePostDataMutation();
    const [deleteApi] = useDeleteMutation();
    const { handleConfirm, confirmModal } = useConfirm();
    const menuPageType = Form.useWatch('page_type', menuForm);

    const targetOptions = useMemo(() => {
        if (menuPageType === 'post') return data?.data?.post_options || [];
        if (menuPageType === 'cms_page') return data?.data?.page_options || [];
        return [];
    }, [data?.data?.page_options, data?.data?.post_options, menuPageType]);
    const postOptions = data?.data?.post_options || [];

    useEffect(() => {
        if (data?.data?.menus) {
            setMenuRows(data.data.menus);
        }
    }, [data]);

    const stats = useMemo(() => ({
        menuItems: menuRows.length,
        headerItems: menuRows.filter((item) => item.location === 'header').length,
        footerItems: menuRows.filter((item) => item.location === 'footer').length,
        accountItems: menuRows.filter((item) => item.location === 'account').length,
    }), [menuRows]);

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải menu template...' />;
    }

    if (error) {
        return <AdminPageState message='Không thể tải menu template từ admin API.' />;
    }

    const handleSubmitMenu = async () => {
        const values = await menuForm.validateFields();
        const nextRow = {
            title: values.title,
            path: values.path,
            location: values.location,
            parent_id: null,
            sort_order: Number(values.sort_order || editingMenu?.sort_order || menuRows.length + 1),
            badge: values.badge || null,
            page_type: values.page_type || 'custom',
            page_ref: values.page_type === 'custom' ? null : Number(values.page_ref || 0) || null,
        };

        await handleApiResponse(
            postApi({ url: editingMenu ? `admin/menus/${editingMenu.id}` : 'admin/menus', data: nextRow, method: editingMenu ? 'PATCH' : 'POST' }),
            async () => {
                await refetch();
                menuForm.resetFields();
                setEditingMenu(null);
                setOpenMenuDrawer(false);
            },
            setSavingMenu,
        );
    };

    const handleEditMenu = (row: IAdminMenuItemRow) => {
        setEditingMenu(row);
        menuForm.setFieldsValue({ ...row });
        setOpenMenuDrawer(true);
    };

    const handleDeleteMenu = async (row: IAdminMenuItemRow) => {
        handleConfirm(
            `Bạn có chắc muốn xóa menu "${row.title}"?`,
            async () => {
                await handleApiResponse(
                    deleteApi({ url: `admin/menus/${row.id}` }),
                    async () => {
                        await refetch();
                    },
                    setSavingMenu,
                );
            },
            'Xóa',
        );
    };

    const handleOpenCustomPageEditor = (row: IAdminMenuItemRow) => {
        const nextCustomPage = row.custom_page || buildDefaultCustomPage(row.title, row.path);
        setEditingCustomPageMenu(row);
        customPageForm.setFieldsValue(nextCustomPage);
        setOpenCustomPageDrawer(true);
    };

    const handleSubmitCustomPage = async () => {
        if (!editingCustomPageMenu) return;

        const values = await customPageForm.validateFields();
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

        const nextPayload = {
            title: editingCustomPageMenu.title,
            path: editingCustomPageMenu.path,
            location: editingCustomPageMenu.location,
            parent_id: editingCustomPageMenu.parent_id,
            sort_order: editingCustomPageMenu.sort_order,
            badge: editingCustomPageMenu.badge,
            page_type: 'custom' as const,
            page_ref: null,
            custom_page: {
                eyebrow: values.eyebrow || 'Custom page',
                summary: values.summary || '',
                content: values.content || '<p>Nội dung đang được cập nhật.</p>',
                sections: normalizedSections,
                related_post_ids: values.related_post_ids || [],
                keywords: values.keywords || '',
                meta_title: values.meta_title || editingCustomPageMenu.title,
                meta_description: values.meta_description || values.summary || '',
            },
        };

        await handleApiResponse(
            postApi({ url: `admin/menus/${editingCustomPageMenu.id}`, data: nextPayload, method: 'PATCH' }),
            async () => {
                await refetch();
                setOpenCustomPageDrawer(false);
                setEditingCustomPageMenu(null);
            },
            setSavingMenu,
        );
    };

    return (
        <div className='space-y-4'>
            <AdminPageHeader
                eyebrow='Menu'
                title='Quản trị điều hướng menu'
                description='Phần này tập trung quản lý navigation. Nội dung chi tiết của custom page đã được tách sang module Quản lý page riêng để biên tập rõ ràng hơn.'
                badges={['Header/Footer', 'Account links', 'Navigation builder']}
            />

            <div className='flex flex-wrap justify-end gap-2'>
                <Button type='primary' onClick={() => {
                    setEditingMenu(null);
                    menuForm.resetFields();
                    setOpenMenuDrawer(true);
                }}>Thêm menu item</Button>
            </div>

            <AdminStatGrid
                items={[
                    { label: 'Menu items', value: stats.menuItems },
                    { label: 'Header links', value: stats.headerItems },
                    { label: 'Footer links', value: stats.footerItems },
                    { label: 'Account links', value: stats.accountItems },
                ]}
            />

            <AdminDataTable
                title='Navigation menu'
                description='Menu mẫu cho header, footer và account area của template. Section đã được tách sang module riêng để quản lý rõ hơn.'
                rows={menuRows}
                emptyMessage='Chưa có menu item nào.'
                columns={[
                    {
                        key: 'title',
                        title: 'Menu item',
                        render: (row) => (
                            <div>
                                <div className='font-semibold text-sgt-secondary-2'>{row.title}</div>
                                <div className='mt-1 text-xs text-sgt-neutral-3'>{row.path}</div>
                                <div className='mt-2 text-[11px] uppercase tracking-[0.18em] text-sgt-primary-1'>{row.page_type}{row.page_ref ? ` #${row.page_ref}` : ''}</div>
                                {row.page_type === 'custom' ? (
                                    <div className='mt-2 text-xs text-sgt-neutral-3'>Sections: {row.custom_page?.sections?.length || 0} · Related posts: {row.custom_page?.related_post_ids?.length || 0}</div>
                                ) : null}
                            </div>
                        ),
                    },
                    {
                        key: 'location',
                        title: 'Vị trí',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.location}</div>
                                <div>Sort: {row.sort_order}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'badge',
                        title: 'Badge',
                        render: (row) => row.badge || '—',
                    },
                    {
                        key: 'actions',
                        title: 'Thao tác',
                        render: (row) => (
                            <div className='flex gap-2'>
                                {row.page_type === 'custom' ? <Button size='small' href={`${ADMIN_PAGE}?menuId=${row.id}`}>Edit page</Button> : null}
                                <Button size='small' onClick={() => handleEditMenu(row)}>Edit</Button>
                                <Button size='small' danger onClick={() => handleDeleteMenu(row)}>Delete</Button>
                            </div>
                        ),
                    },
                ]}
            />

            <Drawer title={editingMenu ? 'Chỉnh sửa menu item' : 'Thêm menu item'} open={openMenuDrawer} onClose={() => {
                setOpenMenuDrawer(false);
                setEditingMenu(null);
            }} width={500} destroyOnHidden loading={savingMenu}>
                <Form
                    layout='vertical'
                    form={menuForm}
                    initialValues={{ location: 'header', sort_order: menuRows.length + 1, page_type: 'custom', page_ref: null }}
                    onValuesChange={(changedValues) => {
                        if ('page_type' in changedValues && changedValues.page_type === 'custom') {
                            menuForm.setFieldValue('page_ref', null);
                        }

                        if ('page_ref' in changedValues) {
                            const selectedTarget = targetOptions.find((item: IAdminMenuTargetOption) => item.id === changedValues.page_ref);
                            if (selectedTarget) {
                                if (!menuForm.getFieldValue('title')) {
                                    menuForm.setFieldValue('title', selectedTarget.title);
                                }
                                if (!editingMenu || !menuForm.getFieldValue('path')) {
                                    menuForm.setFieldValue('path', selectedTarget.path);
                                }
                            }
                        }
                    }}
                >
                    <Form.Item label='Tên menu' name='title' rules={[{ required: true, message: 'Nhập tên menu' }]}>
                        <Input placeholder='Ví dụ: Blog / Tuyển dụng / FAQ' />
                    </Form.Item>
                    <Form.Item label='Đường dẫn' name='path' rules={[{ required: true, message: 'Nhập đường dẫn' }]}>
                        <Input placeholder='/blog' />
                    </Form.Item>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Form.Item label='Page type' name='page_type' rules={[{ required: true, message: 'Chọn page type' }]}> 
                            <Select options={MENU_PAGE_TYPES} />
                        </Form.Item>
                        <Form.Item
                            label='Page ref'
                            name='page_ref'
                            rules={menuPageType && menuPageType !== 'custom' ? [{ required: true, message: 'Chọn page nguồn' }] : []}
                        >
                            <Select
                                allowClear
                                disabled={!menuPageType || menuPageType === 'custom'}
                                placeholder={menuPageType === 'post' ? 'Chọn bài viết' : menuPageType === 'cms_page' ? 'Chọn CMS page' : 'Không cần chọn'}
                                options={targetOptions.map((item: IAdminMenuTargetOption) => ({
                                    label: `${item.title} (${item.path})`,
                                    value: item.id,
                                }))}
                                showSearch
                                optionFilterProp='label'
                            />
                        </Form.Item>
                    </div>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Form.Item label='Vị trí' name='location' rules={[{ required: true, message: 'Chọn vị trí' }]}>
                            <Select options={['header', 'footer', 'account'].map((value) => ({ label: value, value }))} />
                        </Form.Item>
                        <Form.Item label='Sort order' name='sort_order'>
                            <InputNumber className='w-full' min={1} />
                        </Form.Item>
                    </div>
                    <Form.Item label='Badge' name='badge'>
                        <Input placeholder='new / hot / sale' />
                    </Form.Item>
                    <div className='flex justify-end gap-2'>
                        <Button onClick={() => setOpenMenuDrawer(false)}>Huỷ</Button>
                        <Button type='primary' onClick={handleSubmitMenu}>{editingMenu ? 'Lưu thay đổi' : 'Thêm menu'}</Button>
                    </div>
                </Form>
            </Drawer>

            <Drawer
                title={editingCustomPageMenu ? `Biên tập custom page: ${editingCustomPageMenu.title}` : 'Biên tập custom page'}
                open={openCustomPageDrawer}
                onClose={() => {
                    setOpenCustomPageDrawer(false);
                    setEditingCustomPageMenu(null);
                }}
                width='calc(100vw - var(--admin-sidebar-width, 200px))'
                rootStyle={{
                    left: 'var(--admin-sidebar-width, 200px)',
                    width: 'calc(100vw - var(--admin-sidebar-width, 200px))',
                }}
                destroyOnHidden={false}
                loading={savingMenu}
                styles={{
                    body: {
                        minHeight: 'calc(100vh - 55px)',
                        overflowY: 'auto',
                    },
                }}
            >
                <Form form={customPageForm} layout='vertical'>
                    <div className='space-y-6 pb-24'>
                        <div className='grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]'>
                            <div className='space-y-6'>
                                <Card className='rounded-2xl border border-sgt-gray-2'>
                                    <div className='mb-4'>
                                        <div className='text-xs font-semibold uppercase tracking-[0.2em] text-sgt-primary-1'>Custom page editor</div>
                                        <div className='mt-1 text-sm text-sgt-neutral-3'>Dùng editor này như một mini WordPress page builder: có nội dung chính, section và bài viết liên quan cho menu custom.</div>
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

                                <Card className='rounded-2xl border border-sgt-gray-2' title='Sections'>
                                    <Form.List name='sections'>
                                        {(fields, { add, remove }) => (
                                            <div className='space-y-4'>
                                                {fields.map((field, index) => (
                                                    <div key={field.key} className='rounded-2xl border border-sgt-gray-2 p-4'>
                                                        <div className='mb-4 flex items-center justify-between gap-3'>
                                                            <div>
                                                                <div className='text-sm font-semibold text-sgt-secondary-2'>Section #{index + 1}</div>
                                                                <div className='text-xs text-sgt-neutral-3'>Khối nội dung con hiển thị bên dưới nội dung chính.</div>
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
                                <Card className='rounded-2xl border border-sgt-gray-2' title='Bài viết liên quan'>
                                    <Form.Item name='related_post_ids'>
                                        <Select
                                            mode='multiple'
                                            placeholder='Chọn bài viết để show ở cuối page'
                                            options={postOptions.map((item) => ({
                                                label: `${item.title} (${item.path})`,
                                                value: item.id,
                                            }))}
                                            optionFilterProp='label'
                                            showSearch
                                        />
                                    </Form.Item>
                                    <div className='text-xs leading-6 text-sgt-neutral-3'>Các bài này sẽ được render thành khối related posts ở cuối custom page.</div>
                                </Card>

                                <Card className='rounded-2xl border border-sgt-gray-2' title='SEO'>
                                    <Form.Item label='Meta title' name='meta_title'>
                                        <Input placeholder='Meta title cho custom page' />
                                    </Form.Item>
                                    <Form.Item label='Meta description' name='meta_description'>
                                        <Input.TextArea rows={4} placeholder='Meta description cho custom page' />
                                    </Form.Item>
                                </Card>

                                <Card className='rounded-2xl border border-sgt-gray-2' title='Điều hướng'>
                                    <div className='space-y-2 text-sm text-sgt-neutral-3'>
                                        <div><span className='font-semibold text-sgt-secondary-2'>Path:</span> {editingCustomPageMenu?.path}</div>
                                        <div><span className='font-semibold text-sgt-secondary-2'>Location:</span> {editingCustomPageMenu?.location}</div>
                                        <div><span className='font-semibold text-sgt-secondary-2'>Menu:</span> {editingCustomPageMenu?.title}</div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className='flex justify-end gap-2'>
                            <Button onClick={() => setOpenCustomPageDrawer(false)}>Huỷ</Button>
                            <Button type='primary' onClick={handleSubmitCustomPage}>Lưu custom page</Button>
                        </div>
                    </div>
                </Form>
            </Drawer>

            {confirmModal}
        </div>
    );
};

export default AdminMenuManager;
