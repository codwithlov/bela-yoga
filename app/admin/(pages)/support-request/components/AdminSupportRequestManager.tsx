'use client';

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminStatGrid from '@/components/admin/sportverse/AdminStatGrid';
import { IAdminCustomerRow } from '@/interfaces/admin';
import { useGetAdminCustomersQuery } from '@/services/api/admin';
import { useDeleteMutation, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import dayjs from 'dayjs';
import { Button, Input, Popconfirm, Select, Space, message } from 'antd';
import { useMemo, useState } from 'react';

const STATUS_OPTIONS: Array<{ value: IAdminCustomerRow['status']; label: string }> = [
  { value: 'new', label: 'Mới' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'closed', label: 'Đã xử lý' },
];

const statusBadgeClass: Record<IAdminCustomerRow['status'], string> = {
  new: 'bg-amber-100 text-amber-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed: 'bg-emerald-100 text-emerald-700',
};

const statusLabel: Record<IAdminCustomerRow['status'], string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  closed: 'Đã xử lý',
};

type DraftState = Record<string, {
  status: IAdminCustomerRow['status'];
  note: string;
  name: string;
  address: string;
  contact: string;
}>;

const AdminSupportRequestManager = () => {
  const { data, isLoading, isFetching, error, refetch } = useGetAdminCustomersQuery();
  const [postApi] = usePostDataMutation();
  const [deleteApi] = useDeleteMutation();
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});
  const [deletingMap, setDeletingMap] = useState<Record<string, boolean>>({});
  const [draftMap, setDraftMap] = useState<DraftState>({});
  const [messageApi, contextHolder] = message.useMessage();

  const rows = data?.data?.customers || [];

  const stats = useMemo(
    () => ({
      total: rows.length,
      newCount: rows.filter((item) => item.status === 'new').length,
      contactedCount: rows.filter((item) => item.status === 'contacted').length,
      closedCount: rows.filter((item) => item.status === 'closed').length,
    }),
    [rows],
  );

  const pageState = isLoading || isFetching
    ? <AdminPageState message='Đang tải danh sách đăng ký khách hàng...' />
    : error
      ? <AdminPageState message='Không thể tải dữ liệu khách hàng từ admin API.' />
      : null;

  const getDraft = (row: IAdminCustomerRow) => {
    return draftMap[row.id] || {
      status: row.status,
      note: row.note || '',
      name: row.name || '',
      address: row.address || '',
      contact: row.contact || '',
    };
  };

  const setDraft = (
    id: string,
    patch: Partial<{ status: IAdminCustomerRow['status']; note: string; name: string; address: string; contact: string }>,
    fallback: { status: IAdminCustomerRow['status']; note: string; name: string; address: string; contact: string },
  ) => {
    setDraftMap((prev) => ({
      ...prev,
      [id]: {
        status: patch.status ?? prev[id]?.status ?? fallback.status,
        note: patch.note ?? prev[id]?.note ?? fallback.note,
        name: patch.name ?? prev[id]?.name ?? fallback.name,
        address: patch.address ?? prev[id]?.address ?? fallback.address,
        contact: patch.contact ?? prev[id]?.contact ?? fallback.contact,
      },
    }));
  };

  const handleSave = async (row: IAdminCustomerRow) => {
    const draft = getDraft(row);

    await handleApiResponse(
      postApi({
        url: `admin/customers/${row.id}`,
        method: 'PATCH',
        data: {
          status: draft.status,
          note: draft.note,
          name: draft.name,
          address: draft.address,
          contact: draft.contact,
        },
      }),
      async () => {
        messageApi.open({ type: 'success', content: 'Đã cập nhật khách hàng' });
        await refetch();
      },
      (next: boolean) => {
        setSavingMap((prev) => ({ ...prev, [row.id]: next }));
      },
      messageApi,
    );
  };

  const handleDelete = async (row: IAdminCustomerRow) => {
    await handleApiResponse(
      deleteApi({
        url: `admin/customers/${row.id}`,
        data: null,
      }),
      async () => {
        messageApi.open({ type: 'success', content: 'Đã xóa khách hàng' });
        await refetch();
      },
      (next: boolean) => {
        setDeletingMap((prev) => ({ ...prev, [row.id]: next }));
      },
      messageApi,
    );
  };

  return (
    <div className='space-y-4'>
      <AdminPageHeader
        eyebrow='Customers'
        title='Quản lý khách hàng đăng ký tư vấn'
        description='Theo dõi toàn bộ dữ liệu đăng ký từ website (điện thoại hoặc email), cập nhật trạng thái xử lý và lưu ghi chú làm việc cho đội ngũ admin.'
        badges={['Lead Management', 'Footer Signup', 'Status Tracking']}
      />

      {pageState || (
        <>
          <AdminStatGrid
            items={[
              { label: 'Tổng đăng ký', value: stats.total },
              { label: 'Mới', value: stats.newCount },
              { label: 'Đã liên hệ', value: stats.contactedCount },
              { label: 'Đã xử lý', value: stats.closedCount },
            ]}
          />

          <AdminDataTable
            title='Danh sách khách hàng'
            description='Cập nhật trạng thái và ghi chú ngay trên từng dòng dữ liệu.'
            rows={rows}
            emptyMessage='Chưa có dữ liệu khách hàng đăng ký.'
            columns={[
              {
                key: 'name',
                title: 'Khách hàng',
                render: (row) => {
                  const draft = getDraft(row);
                  return (
                    <Input
                      value={draft.name}
                      placeholder='Tên khách hàng'
                      onChange={(event) => setDraft(row.id, { name: event.target.value }, {
                        status: row.status,
                        note: row.note || '',
                        name: row.name || '',
                        address: row.address || '',
                        contact: row.contact || '',
                      })}
                    />
                  );
                },
              },
              {
                key: 'contact',
                title: 'Thông tin liên hệ',
                render: (row) => (
                  <div>
                    <Input
                      value={getDraft(row).contact}
                      placeholder='Email hoặc số điện thoại'
                      onChange={(event) => setDraft(row.id, { contact: event.target.value }, {
                        status: row.status,
                        note: row.note || '',
                        name: row.name || '',
                        address: row.address || '',
                        contact: row.contact || '',
                      })}
                    />
                    <div className='mt-1 text-xs uppercase tracking-[0.12em] text-bela-neutral-3'>
                      {getDraft(row).contact.includes('@') ? 'Email' : 'Phone'}
                    </div>
                  </div>
                ),
              },
              {
                key: 'source',
                title: 'Nguồn',
                render: (row) => row.source,
              },
              {
                key: 'address',
                title: 'Địa chỉ',
                render: (row) => {
                  const draft = getDraft(row);
                  return (
                    <Input
                      value={draft.address}
                      placeholder='Địa chỉ'
                      onChange={(event) => setDraft(row.id, { address: event.target.value }, {
                        status: row.status,
                        note: row.note || '',
                        name: row.name || '',
                        address: row.address || '',
                        contact: row.contact || '',
                      })}
                    />
                  );
                },
              },
              {
                key: 'timeline',
                title: 'Thời gian',
                render: (row) => (
                  <div className='space-y-1'>
                    <div>Đầu tiên: {dayjs(row.first_request_at).format('HH:mm DD/MM/YYYY')}</div>
                    <div>Gần nhất: {dayjs(row.last_request_at).format('HH:mm DD/MM/YYYY')}</div>
                    <div className='text-xs text-bela-neutral-3'>Số lần: {row.request_count}</div>
                  </div>
                ),
              },
              {
                key: 'status',
                title: 'Trạng thái',
                render: (row) => {
                  const draft = getDraft(row);
                  return (
                    <div className='space-y-2'>
                      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[draft.status]}`}>
                        {statusLabel[draft.status]}
                      </div>
                      <Select
                        value={draft.status}
                        options={STATUS_OPTIONS}
                        className='w-full min-w-[160px]'
                        onChange={(value) => setDraft(row.id, { status: value }, {
                          status: row.status,
                          note: row.note || '',
                          name: row.name || '',
                          address: row.address || '',
                          contact: row.contact || '',
                        })}
                      />
                    </div>
                  );
                },
              },
              {
                key: 'note',
                title: 'Ghi chú xử lý',
                render: (row) => {
                  const draft = getDraft(row);
                  return (
                    <Input.TextArea
                      value={draft.note}
                      rows={3}
                      placeholder='Nhập ghi chú chăm sóc khách hàng...'
                      onChange={(event) => setDraft(row.id, { note: event.target.value }, {
                        status: row.status,
                        note: row.note || '',
                        name: row.name || '',
                        address: row.address || '',
                        contact: row.contact || '',
                      })}
                    />
                  );
                },
              },
              {
                key: 'actions',
                title: 'Hành động',
                render: (row) => (
                  <Space>
                    <Button
                      type='primary'
                      loading={Boolean(savingMap[row.id])}
                      onClick={() => handleSave(row)}
                    >
                      Lưu
                    </Button>
                    <Popconfirm
                      title='Xóa khách hàng này?'
                      okText='Xóa'
                      cancelText='Hủy'
                      onConfirm={() => handleDelete(row)}
                    >
                      <Button
                        danger
                        loading={Boolean(deletingMap[row.id])}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </>
      )}
      {contextHolder}
    </div>
  );
};

export default AdminSupportRequestManager;
