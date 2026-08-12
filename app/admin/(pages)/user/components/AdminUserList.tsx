'use client'

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable'
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader'
import AdminPageState from '@/components/admin/sportverse/AdminPageState'
import { IAdminUserRow } from '@/interfaces/admin'
import { useCreateAdminUserMutation, useGetAdminRolesQuery, useGetAdminUsersQuery, useUpdateAdminUserMutation } from '@/services/api/admin'
import { Button, Form, Input, Modal, Select, Space, Tag, message } from 'antd'
import { useMemo, useState } from 'react'

type UserRoleCode = 'organization_admin' | 'member'

const resolveErrorMessage = (error: any) => {
  return error?.data?.message || error?.error || 'Có lỗi xảy ra, vui lòng thử lại.'
}

const roleCodeToUserRole = (roleCode: UserRoleCode): 'ADMIN' | 'USER' => (roleCode === 'member' ? 'USER' : 'ADMIN')

const AdminUserList = () => {
  const { data, isLoading, isFetching, error, refetch } = useGetAdminUsersQuery()
  const { data: roleData } = useGetAdminRolesQuery()
  const [createAdminUser, { isLoading: isCreating }] = useCreateAdminUserMutation()
  const [updateAdminUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation()

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IAdminUserRow | null>(null)

  const [createForm] = Form.useForm()
  const [permissionForm] = Form.useForm()

  const users = data?.data?.users || []
  const roles = roleData?.data?.roles || []

  const roleOptions = useMemo(() => {
    const mapped = roles
      .map((item) => {
        if (item.code === 'organization_admin') {
          return { value: 'organization_admin', label: item.name || 'Organization Admin' }
        }
        if (item.code === 'member') {
          return { value: 'member', label: item.name || 'Member' }
        }
        return null
      })
      .filter(Boolean) as Array<{ value: UserRoleCode; label: string }>

    if (mapped.length > 0) return mapped

    return [
      { value: 'organization_admin', label: 'Organization Admin' },
      { value: 'member', label: 'Member' },
    ]
  }, [roles])

  const openPermissionModal = (row: IAdminUserRow) => {
    if (!row?.is_editable) {
      message.warning('User demo chỉ để xem, không thể chỉnh quyền.')
      return
    }

    const nextRoleCode = (row.role_code === 'member' ? 'member' : 'organization_admin') as UserRoleCode
    setSelectedUser(row)
    permissionForm.setFieldsValue({ role_code: nextRoleCode })
    setPermissionModalOpen(true)
  }

  const handleCreateUser = async () => {
    try {
      const values = await createForm.validateFields()
      await createAdminUser({
        username: values.email,
        fullName: values.name,
        phone: values.phone || '',
        password: values.password,
        role: roleCodeToUserRole(values.role_code),
      }).unwrap()

      message.success('Đã thêm người dùng mới.')
      setCreateModalOpen(false)
      createForm.resetFields()
      refetch()
    } catch (error: any) {
      if (error?.errorFields) return
      message.error(resolveErrorMessage(error))
    }
  }

  const handleUpdatePermission = async () => {
    if (!selectedUser) return

    try {
      const values = await permissionForm.validateFields()
      await updateAdminUser({
        userId: String(selectedUser.id),
        role: roleCodeToUserRole(values.role_code),
      }).unwrap()

      message.success('Đã cập nhật quyền user.')
      setPermissionModalOpen(false)
      setSelectedUser(null)
      permissionForm.resetFields()
      refetch()
    } catch (error: any) {
      if (error?.errorFields) return
      message.error(resolveErrorMessage(error))
    }
  }

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
        description='Quản lý người dùng, thêm tài khoản mới và điều chỉnh quyền truy cập theo vai trò.'
      />

      <div>
        <Button type='primary' onClick={() => setCreateModalOpen(true)}>
          Thêm người dùng
        </Button>
      </div>

      <AdminDataTable
        title='Users'
        description='Source: GET/POST/PATCH /api/public/v1/admin/users'
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
                <div>
                  <Tag color={row.role_code === 'member' ? 'default' : 'processing'}>
                    {row.role_name || (row.is_super_admin ? 'Super admin' : '—')}
                  </Tag>
                </div>
                <div className='text-bela-neutral-3'>{row.role_code || '—'}</div>
              </div>
            ),
          },
          {
            key: 'permission',
            title: 'Permission',
            render: (row) => `${row.permission_codes_count} quyền`,
          },
          {
            key: 'action',
            title: 'Thao tác',
            render: (row) => (
              <Button size='small' onClick={() => openPermissionModal(row)} disabled={!row.is_editable}>
                Chỉnh quyền
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title='Thêm người dùng'
        open={createModalOpen}
        okText='Tạo user'
        cancelText='Huỷ'
        confirmLoading={isCreating}
        onOk={handleCreateUser}
        onCancel={() => {
          setCreateModalOpen(false)
          createForm.resetFields()
        }}
      >
        <Form form={createForm} layout='vertical'>
          <Form.Item name='name' label='Họ và tên' rules={[{ required: true, message: 'Vui lòng nhập họ và tên.' }]}>
            <Input placeholder='Ví dụ: Nguyễn Văn A' maxLength={120} />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email đăng nhập'
            rules={[
              { required: true, message: 'Vui lòng nhập email.' },
              { type: 'email', message: 'Email không hợp lệ.' },
            ]}
          >
            <Input placeholder='user@domain.com' />
          </Form.Item>
          <Form.Item name='phone' label='Số điện thoại'>
            <Input placeholder='090xxxxxxx' maxLength={20} />
          </Form.Item>
          <Form.Item
            name='password'
            label='Mật khẩu'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu.' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự.' },
            ]}
          >
            <Input.Password placeholder='Tối thiểu 6 ký tự' maxLength={64} />
          </Form.Item>
          <Form.Item
            name='role_code'
            label='Vai trò'
            initialValue='member'
            rules={[{ required: true, message: 'Vui lòng chọn vai trò.' }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Điều chỉnh quyền user'
        open={permissionModalOpen}
        okText='Lưu thay đổi'
        cancelText='Huỷ'
        confirmLoading={isUpdating}
        onOk={handleUpdatePermission}
        onCancel={() => {
          setPermissionModalOpen(false)
          setSelectedUser(null)
          permissionForm.resetFields()
        }}
      >
        <Space direction='vertical' className='w-full' size={12}>
          <div className='rounded-lg border border-bela-gray-2 bg-bela-bg-primary p-3 text-sm text-bela-neutral-3'>
            <div>
              User: <span className='font-semibold text-bela-secondary-2'>{selectedUser?.name || '—'}</span>
            </div>
            <div>Email: {selectedUser?.email || '—'}</div>
          </div>

          <Form form={permissionForm} layout='vertical'>
            <Form.Item name='role_code' label='Vai trò' rules={[{ required: true, message: 'Vui lòng chọn vai trò.' }]}>
              <Select options={roleOptions} />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </div>
  )
}

export default AdminUserList