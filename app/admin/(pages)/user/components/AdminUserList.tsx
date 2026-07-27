'use client'

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable'
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader'
import AdminPageState from '@/components/admin/sportverse/AdminPageState'
import { useGetAdminUsersQuery } from '@/services/api/admin'

const AdminUserList = () => {
  const { data, isLoading, isFetching, error } = useGetAdminUsersQuery()
  const users = data?.data?.users || []

  if (isLoading || isFetching) {
    return <AdminPageState message='Đang tải danh sách người dùng...' />
  }

  if (error) {
    return <AdminPageState message='Không thể tải danh sách người dùng từ CMS admin API.' />
  }

  return (
    <div className='space-y-4'>
      <AdminPageHeader
        eyebrow='Users'
        title='Người dùng thuộc hệ SPORTVERSE'
        description='Màn hình user đã chuyển sang dữ liệu CMS thật để xem tổ chức, role và số lượng permission hiện có.'
      />

      <AdminDataTable
        title='Users'
        description='Source: GET /api/public/v1/admin/users'
        rows={users}
        emptyMessage='Chưa có user nào.'
        columns={[
          {
            key: 'name',
            title: 'Người dùng',
            render: (row) => (
              <div>
                <div className='font-semibold text-bela-secondary-2'>{row.name}</div>
                <div className='mt-1 text-xs text-bela-neutral-3'>{row.email}</div>
              </div>
            ),
          },
          {
            key: 'organization',
            title: 'Tổ chức',
            render: (row) => row.organization_name || 'Không gắn tổ chức',
          },
          {
            key: 'role',
            title: 'Vai trò',
            render: (row) => (
              <div className='space-y-1 text-xs'>
                <div>{row.role_name || (row.is_super_admin ? 'Super admin' : '—')}</div>
                <div className='text-bela-neutral-3'>{row.role_code || '—'}</div>
              </div>
            ),
          },
          {
            key: 'permission',
            title: 'Permission',
            render: (row) => `${row.permission_codes_count} quyền`,
          },
        ]}
      />
    </div>
  )
}

export default AdminUserList