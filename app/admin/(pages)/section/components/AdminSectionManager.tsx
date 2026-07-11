'use client';

import { useConfirm } from '@/components/admin/atoms/useConfirm';
import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminStatGrid from '@/components/admin/sportverse/AdminStatGrid';
import { IAdminSectionRow } from '@/interfaces/admin';
import { useGetAdminSectionsQuery } from '@/services/api/admin';
import { useDeleteMutation, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { Button, Drawer, Form, Input, InputNumber, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const AdminSectionManager = () => {
    const { data, isLoading, isFetching, error, refetch } = useGetAdminSectionsQuery();
    const [sectionRows, setSectionRows] = useState<IAdminSectionRow[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingSection, setEditingSection] = useState<IAdminSectionRow | null>(null);
    const [form] = Form.useForm();
    const [postApi] = usePostDataMutation();
    const [deleteApi] = useDeleteMutation();
    const { handleConfirm, confirmModal } = useConfirm();

    useEffect(() => {
        if (data?.data?.sections) {
            setSectionRows(data.data.sections);
        }
    }, [data]);

    const stats = useMemo(() => ({
        total: sectionRows.length,
        active: sectionRows.filter((row) => row.status === 'active').length,
        home: sectionRows.filter((row) => row.page === 'home').length,
        store: sectionRows.filter((row) => row.page === 'store').length,
    }), [sectionRows]);

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải section template...' />;
    }

    if (error) {
        return <AdminPageState message='Không thể tải section template từ admin API.' />;
    }

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const nextRow = {
            page: values.page,
            name: values.name,
            type: values.type,
            status: values.status,
            display_order: Number(values.display_order || editingSection?.display_order || sectionRows.length + 1),
            summary: values.summary,
        };

        await handleApiResponse(
            postApi({ url: editingSection ? `admin/sections/${editingSection.id}` : 'admin/sections', data: nextRow, method: editingSection ? 'PATCH' : 'POST' }),
            async () => {
                await refetch();
                form.resetFields();
                setEditingSection(null);
                setOpenDrawer(false);
            },
            setSaving,
        );
    };

    const handleEdit = (row: IAdminSectionRow) => {
        setEditingSection(row);
        form.setFieldsValue({ ...row });
        setOpenDrawer(true);
    };

    const handleDelete = async (row: IAdminSectionRow) => {
        handleConfirm(
            `Bạn có chắc muốn xóa section "${row.name}"?`,
            async () => {
                await handleApiResponse(
                    deleteApi({ url: `admin/sections/${row.id}` }),
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
        <div className='space-y-4'>
            <AdminPageHeader
                eyebrow='Section'
                title='Quản trị block nội dung theo trang'
                description='Phần này tách riêng để quản lý các block nội dung như hero, CTA, listing và FAQ cho từng page trong template CMS.'
                badges={['Homepage blocks', 'Store blocks', 'Content builder']}
            />

            <div className='flex justify-end'>
                <Button type='primary' onClick={() => {
                    setEditingSection(null);
                    form.resetFields();
                    setOpenDrawer(true);
                }}>Thêm section</Button>
            </div>

            <AdminStatGrid
                items={[
                    { label: 'Tổng section', value: stats.total },
                    { label: 'Đang active', value: stats.active },
                    { label: 'Trang chủ', value: stats.home },
                    { label: 'Trang store', value: stats.store },
                ]}
            />

            <AdminDataTable
                title='Page sections'
                description='Các khối nội dung mẫu để ráp trang chủ, store, venue detail hoặc page listing.'
                rows={sectionRows}
                emptyMessage='Chưa có section nào.'
                columns={[
                    {
                        key: 'name',
                        title: 'Section',
                        render: (row) => (
                            <div>
                                <div className='font-semibold text-sgt-secondary-2'>{row.name}</div>
                                <div className='mt-1 text-xs text-sgt-neutral-3'>{row.summary}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'page',
                        title: 'Trang / loại',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.page}</div>
                                <div>{row.type}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'status',
                        title: 'Trạng thái',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div className='inline-flex rounded-full bg-sgt-bg-primary px-3 py-1 font-semibold text-sgt-primary-1'>{row.status}</div>
                                <div>Order: {row.display_order}</div>
                            </div>
                        ),
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

            <Drawer title={editingSection ? 'Chỉnh sửa section' : 'Thêm section'} open={openDrawer} onClose={() => {
                setOpenDrawer(false);
                setEditingSection(null);
            }} width={500} destroyOnHidden loading={saving}>
                <Form layout='vertical' form={form} initialValues={{ page: 'home', type: 'hero', status: 'draft', display_order: sectionRows.length + 1 }}>
                    <Form.Item label='Tên section' name='name' rules={[{ required: true, message: 'Nhập tên section' }]}>
                        <Input placeholder='Ví dụ: Homepage CTA Banner' />
                    </Form.Item>
                    <Form.Item label='Mô tả ngắn' name='summary' rules={[{ required: true, message: 'Nhập mô tả' }]}>
                        <Input.TextArea rows={4} placeholder='Mô tả vai trò của block nội dung...' />
                    </Form.Item>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Form.Item label='Trang' name='page' rules={[{ required: true, message: 'Chọn page' }]}>
                            <Select options={['home', 'venue_detail', 'match_listing', 'store'].map((value) => ({ label: value, value }))} />
                        </Form.Item>
                        <Form.Item label='Loại block' name='type' rules={[{ required: true, message: 'Chọn type' }]}>
                            <Select options={['hero', 'listing', 'cta', 'feature_grid', 'faq'].map((value) => ({ label: value, value }))} />
                        </Form.Item>
                        <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Chọn status' }]}>
                            <Select options={['active', 'draft'].map((value) => ({ label: value, value }))} />
                        </Form.Item>
                        <Form.Item label='Thứ tự hiển thị' name='display_order'>
                            <InputNumber className='w-full' min={1} />
                        </Form.Item>
                    </div>
                    <div className='flex justify-end gap-2'>
                        <Button onClick={() => setOpenDrawer(false)}>Huỷ</Button>
                        <Button type='primary' onClick={handleSubmit}>{editingSection ? 'Lưu thay đổi' : 'Thêm section'}</Button>
                    </div>
                </Form>
            </Drawer>

            {confirmModal}
        </div>
    );
};

export default AdminSectionManager;