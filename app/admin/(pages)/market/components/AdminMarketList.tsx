'use client';

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminStatGrid from '@/components/admin/sportverse/AdminStatGrid';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { IAdminStoreItemRow } from '@/interfaces/admin';
import { useGetAdminStoreItemsQuery } from '@/services/api/admin';
import { useDeleteMutation, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { Button, Drawer, Form, Input, InputNumber, Select, Switch } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const AdminMarketList = () => {
    const { data, isLoading, isFetching, error, refetch } = useGetAdminStoreItemsQuery();
    const [rows, setRows] = useState<IAdminStoreItemRow[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingRow, setEditingRow] = useState<IAdminStoreItemRow | null>(null);
    const [form] = Form.useForm();
    const [postApi] = usePostDataMutation();
    const [deleteApi] = useDeleteMutation();
    const { handleConfirm, confirmModal } = useConfirm();

    useEffect(() => {
        if (data?.data?.store_items) {
            setRows(data.data.store_items);
        }
    }, [data]);

    const stats = useMemo(() => ({
        total: rows.length,
        active: rows.filter((row) => row.status === 'active').length,
        featured: rows.filter((row) => row.featured).length,
        stockTracked: rows.filter((row) => row.stock_quantity !== null).length,
    }), [rows]);

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải dữ liệu cửa hàng template...' />;
    }

    if (error) {
        return <AdminPageState message='Không thể tải danh mục cửa hàng từ admin API.' />;
    }

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const nextRow = {
            name: values.name,
            sku: values.sku,
            category: values.category,
            type: values.type,
            organization_name: values.organization_name || null,
            price: Number(values.price || 0),
            unit: values.unit,
            stock_quantity: values.stock_quantity ?? null,
            status: values.status,
            featured: Boolean(values.featured),
        };

        await handleApiResponse(
            postApi({ url: editingRow ? `admin/store-items/${editingRow.id}` : 'admin/store-items', data: nextRow, method: editingRow ? 'PATCH' : 'POST' }),
            async () => {
                await refetch();
                form.resetFields();
                setEditingRow(null);
                setOpenDrawer(false);
            },
            setSaving,
        );
    };

    const handleEdit = (row: IAdminStoreItemRow) => {
        setEditingRow(row);
        form.setFieldsValue({ ...row });
        setOpenDrawer(true);
    };

    const handleDelete = async (row: IAdminStoreItemRow) => {
        handleConfirm(
            `Bạn có chắc muốn xóa item "${row.name}"?`,
            async () => {
                await handleApiResponse(
                    deleteApi({ url: `admin/store-items/${row.id}` }),
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
                eyebrow='Store'
                title='Quản trị cửa hàng / add-on template'
                description='Đây là module storefront cơ bản cho template: có thể quản lý add-on booking, media service, voucher và equipment như một site CMS đầy đủ.'
                badges={['Store-ready', 'Booking add-ons', 'Service catalog']}
            />

            <div className='flex justify-end'>
                <Button type='primary' onClick={() => {
                    setEditingRow(null);
                    form.resetFields();
                    setOpenDrawer(true);
                }}>Thêm sản phẩm / dịch vụ</Button>
            </div>

            <AdminStatGrid
                items={[
                    { label: 'Tổng item', value: stats.total },
                    { label: 'Đang active', value: stats.active },
                    { label: 'Featured', value: stats.featured },
                    { label: 'Có tồn kho', value: stats.stockTracked },
                ]}
            />

            <AdminDataTable
                title='Store catalog'
                description='Danh mục mẫu cho cửa hàng, add-on booking và dịch vụ media trong template.'
                rows={rows}
                emptyMessage='Chưa có item nào.'
                columns={[
                    {
                        key: 'name',
                        title: 'Sản phẩm / dịch vụ',
                        render: (row) => (
                            <div>
                                <div className='font-semibold text-sgt-secondary-2'>{row.name}</div>
                                <div className='mt-1 text-xs text-sgt-neutral-3'>{row.sku} · {row.category}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'type',
                        title: 'Loại',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.type}</div>
                                <div className='text-sgt-neutral-3'>{row.organization_name || 'Global catalog'}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'price',
                        title: 'Giá / tồn kho',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.price.toLocaleString('vi-VN')} VND / {row.unit}</div>
                                <div>{row.stock_quantity === null ? 'Không track tồn kho' : `${row.stock_quantity} item`}</div>
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

            <Drawer title={editingRow ? 'Chỉnh sửa item cửa hàng' : 'Thêm item cửa hàng'} open={openDrawer} onClose={() => {
                setOpenDrawer(false);
                setEditingRow(null);
            }} width={520} destroyOnHidden loading={saving}>
                <Form layout='vertical' form={form} initialValues={{ type: 'product', status: 'draft', featured: false }}>
                    <Form.Item label='Tên item' name='name' rules={[{ required: true, message: 'Nhập tên item' }]}>
                        <Input placeholder='Ví dụ: Combo booking cuối tuần' />
                    </Form.Item>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Form.Item label='SKU' name='sku' rules={[{ required: true, message: 'Nhập SKU' }]}>
                            <Input placeholder='SV-XXX-001' />
                        </Form.Item>
                        <Form.Item label='Danh mục' name='category' rules={[{ required: true, message: 'Nhập danh mục' }]}>
                            <Input placeholder='Addon / Media / Voucher' />
                        </Form.Item>
                        <Form.Item label='Loại item' name='type' rules={[{ required: true, message: 'Chọn loại' }]}>
                            <Select options={['product', 'service', 'package'].map((value) => ({ label: value, value }))} />
                        </Form.Item>
                        <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
                            <Select options={['active', 'draft', 'hidden'].map((value) => ({ label: value, value }))} />
                        </Form.Item>
                        <Form.Item label='Giá bán' name='price' rules={[{ required: true, message: 'Nhập giá' }]}>
                            <InputNumber className='w-full' min={0} />
                        </Form.Item>
                        <Form.Item label='Đơn vị' name='unit' rules={[{ required: true, message: 'Nhập đơn vị' }]}>
                            <Input placeholder='combo / trận / giờ / gói' />
                        </Form.Item>
                        <Form.Item label='Tồn kho' name='stock_quantity'>
                            <InputNumber className='w-full' min={0} />
                        </Form.Item>
                        <Form.Item label='Tổ chức' name='organization_name'>
                            <Input placeholder='Để trống nếu là catalog dùng chung' />
                        </Form.Item>
                    </div>
                    <Form.Item label='Featured' name='featured' valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                    <div className='flex justify-end gap-2'>
                        <Button onClick={() => setOpenDrawer(false)}>Huỷ</Button>
                        <Button type='primary' onClick={handleSubmit}>{editingRow ? 'Lưu thay đổi' : 'Tạo item mẫu'}</Button>
                    </div>
                </Form>
            </Drawer>

            {confirmModal}
        </div>
    );
};

export default AdminMarketList;