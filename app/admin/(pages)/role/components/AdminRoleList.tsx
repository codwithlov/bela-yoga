'use client'

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable'
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader'
import AdminPageState from '@/components/admin/sportverse/AdminPageState'
import { useGetAdminRolesQuery } from '@/services/api/admin'

const AdminRoleList = () => {
  const { data, isLoading, isFetching, error } = useGetAdminRolesQuery()
  const roles = data?.data?.roles || []

  if (isLoading || isFetching) {
    return <AdminPageState message='Đang tải danh sách vai trò...' />
  }

  if (error) {
    return <AdminPageState message='Không thể tải danh sách vai trò từ CMS admin API.' />
  }

  return (
    <div className='space-y-4'>
      <AdminPageHeader
        eyebrow='Roles'
        title='Vai trò tổ chức trên SPORTVERSE'
        description='Trang role đã bỏ contract travel cũ và đọc trực tiếp dữ liệu organization role từ CMS.'
      />

      <AdminDataTable
        title='Roles'
        description='Source: GET /api/public/v1/admin/roles'
        rows={roles}
        emptyMessage='Chưa có role nào.'
        columns={[
          {
            key: 'role',
            title: 'Vai trò',
            render: (row) => (
              <div>
                <div className='font-semibold text-sgt-secondary-2'>{row.name}</div>
                <div className='mt-1 text-xs text-sgt-neutral-3'>{row.code}</div>
              </div>
            ),
          },
          {
            key: 'organization',
            title: 'Tổ chức',
            render: (row) => row.organization_name || '—',
          },
          {
            key: 'permissions',
            title: 'Quyền',
            render: (row) => (
              <div className='space-y-1 text-xs'>
                <div>{row.permissions_count} permission(s)</div>
                <div className='text-sgt-neutral-3'>{row.permissions_preview.join(' · ') || '—'}</div>
              </div>
            ),
          },
          {
            key: 'users',
            title: 'Người dùng',
            render: (row) => (
              <div className='space-y-1 text-xs'>
                <div>{row.users_count} user(s)</div>
                <div>{row.is_system ? 'System role' : 'Custom role'}</div>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

export default AdminRoleList