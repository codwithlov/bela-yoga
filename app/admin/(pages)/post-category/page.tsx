'use client';

import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { Button, Input, InputNumber, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useGetAdminPostsQuery } from '@/services/api/admin';
import { useDeleteMutation, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { showSuccessToastr } from '@/utils/toastr';
import type { IAdminPostCategory } from '@/interfaces/admin';

const AdminPostCategoryPage = () => {
  const { data, isLoading, isFetching, error, refetch } = useGetAdminPostsQuery();
  const [postApi] = usePostDataMutation();
  const [deleteApi] = useDeleteMutation();
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryStatus, setNewCategoryStatus] = useState<'active' | 'hidden'>('active');
  const [newCategorySortOrder, setNewCategorySortOrder] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<IAdminPostCategory | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingStatus, setEditingStatus] = useState<'active' | 'hidden'>('active');
  const [editingSortOrder, setEditingSortOrder] = useState<number>(1);
  const { handleConfirm, confirmModal } = useConfirm();

  const categories = useMemo(() => {
    return (data?.data?.categories || []).slice().sort((a, b) => a.sort_order - b.sort_order);
  }, [data?.data?.categories]);

  if (isLoading || isFetching) {
    return <AdminPageState message='Đang tải danh mục bài viết...' />;
  }

  if (error) {
    return <AdminPageState message='Không thể tải danh mục bài viết.' />;
  }

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    await handleApiResponse(
      postApi({
        url: 'admin/post-categories',
        method: 'POST',
        data: { name, status: newCategoryStatus, sort_order: newCategorySortOrder || undefined },
      }),
      async () => {
        setNewCategoryName('');
        setNewCategoryStatus('active');
        setNewCategorySortOrder(null);
        await refetch();
      },
      setSaving,
    );
  };

  const handleStartEdit = (category: IAdminPostCategory) => {
    setEditingCategory(category);
    setEditingName(category.name);
    setEditingStatus(category.status);
    setEditingSortOrder(category.sort_order);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    const name = editingName.trim();
    if (!name) return;

    await handleApiResponse(
      postApi({
        url: `admin/post-categories/${editingCategory.id}`,
        method: 'PATCH',
        data: {
          name,
          status: editingStatus,
          sort_order: editingSortOrder,
        },
      }),
      async () => {
        setEditingCategory(null);
        setEditingName('');
        setEditingStatus('active');
        setEditingSortOrder(1);
        await refetch();
      },
      setSaving,
    );
  };

  const handleDeleteCategory = async (category: IAdminPostCategory) => {
    handleConfirm(
      `Bạn có chắc muốn xóa danh mục "${category.name}"?`,
      async () => {
        await handleApiResponse(
          deleteApi({ url: `admin/post-categories/${category.id}` }),
          async (payload: any) => {
            showSuccessToastr(payload?.message || 'Đã xóa danh mục thành công.');
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
        eyebrow='Post categories'
        title='Quản lý danh mục bài viết'
        description='Danh mục được lưu trong database và dùng cho module Bài viết. Bạn có thể thêm/xóa danh mục tại đây.'
        badges={['DB-backed', 'Reusable', 'Admin managed']}
      />

      <div className='flex flex-wrap items-end gap-2 rounded-2xl border border-bela-gray-2 bg-white p-4'>
        <div className='min-w-[260px] flex-1'>
          <div className='mb-1 text-xs text-bela-neutral-3'>Tên danh mục</div>
          <Input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder='Ví dụ: Yoga cho người mới bắt đầu'
            onPressEnter={handleCreateCategory}
          />
        </div>
        <div className='w-40'>
          <div className='mb-1 text-xs text-bela-neutral-3'>Trạng thái</div>
          <Select
            value={newCategoryStatus}
            onChange={(value) => setNewCategoryStatus(value)}
            options={[
              { label: 'active', value: 'active' },
              { label: 'hidden', value: 'hidden' },
            ]}
          />
        </div>
        <div className='w-36'>
          <div className='mb-1 text-xs text-bela-neutral-3'>Thứ tự</div>
          <InputNumber className='w-full' min={1} value={newCategorySortOrder} onChange={(value) => setNewCategorySortOrder(value)} placeholder='Tự tăng' />
        </div>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateCategory} loading={saving}>Thêm danh mục</Button>
      </div>

      {editingCategory ? (
        <div className='flex flex-wrap items-end gap-2 rounded-2xl border border-bela-primary-2 bg-white p-4'>
          <div className='w-full text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1'>Chỉnh sửa danh mục #{editingCategory.id}</div>
          <div className='min-w-[260px] flex-1'>
            <div className='mb-1 text-xs text-bela-neutral-3'>Tên danh mục</div>
            <Input value={editingName} onChange={(event) => setEditingName(event.target.value)} />
          </div>
          <div className='w-40'>
            <div className='mb-1 text-xs text-bela-neutral-3'>Trạng thái</div>
            <Select
              value={editingStatus}
              onChange={(value) => setEditingStatus(value)}
              options={[
                { label: 'active', value: 'active' },
                { label: 'hidden', value: 'hidden' },
              ]}
            />
          </div>
          <div className='w-36'>
            <div className='mb-1 text-xs text-bela-neutral-3'>Thứ tự</div>
            <InputNumber className='w-full' min={1} value={editingSortOrder} onChange={(value) => setEditingSortOrder(Number(value || 1))} />
          </div>
          <Button type='primary' onClick={handleUpdateCategory} loading={saving}>Lưu sửa</Button>
          <Button onClick={() => setEditingCategory(null)}>Hủy</Button>
        </div>
      ) : null}

      <AdminDataTable
        title='Danh sách danh mục'
        description='Danh mục dùng cho phần Phân loại & hiển thị trong form bài viết.'
        rows={categories}
        emptyMessage='Chưa có danh mục nào.'
        columns={[
          {
            key: 'name',
            title: 'Tên danh mục',
            render: (row: IAdminPostCategory) => <div className='font-semibold text-bela-secondary-2'>{row.name}</div>,
          },
          {
            key: 'sort_order',
            title: 'Thứ tự',
            render: (row: IAdminPostCategory) => row.sort_order,
          },
          {
            key: 'status',
            title: 'Trạng thái',
            render: (row: IAdminPostCategory) => row.status,
          },
          {
            key: 'actions',
            title: 'Thao tác',
            render: (row: IAdminPostCategory) => (
              <div className='flex gap-2'>
                <Button
                  size='small'
                  icon={<EditOutlined />}
                  onClick={() => handleStartEdit(row)}
                  loading={saving}
                >
                  Sửa
                </Button>
                <Button
                  size='small'
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteCategory(row)}
                  loading={saving}
                >
                  Xóa
                </Button>
              </div>
            ),
          },
        ]}
      />

      {confirmModal}
    </div>
  );
};

export default AdminPostCategoryPage;
