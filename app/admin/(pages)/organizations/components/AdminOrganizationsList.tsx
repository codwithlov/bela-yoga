'use client';

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import { useGetAdminOrganizationsQuery } from '@/services/api/admin';

const AdminOrganizationsList = () => {
    const { data, isLoading, isFetching, error } = useGetAdminOrganizationsQuery();
    const organizations = data?.data?.organizations || [];

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải danh sách tổ chức SPORTVERSE...' />;
    }

    if (error) {
        return <AdminPageState message='Không thể tải dữ liệu tổ chức từ CMS. Vui lòng đăng nhập lại hoặc kiểm tra API admin.' />;
    }

    return (
        <div className='space-y-4'>
            <AdminPageHeader
                eyebrow='Organizations'
                title='Danh sách tổ chức trên SPORTVERSE'
                description='Màn hình này đọc trực tiếp từ CMS admin API để hiển thị các tổ chức, manager và chỉ số vận hành cơ bản.'
            />

            <AdminDataTable
                title='Organizations'
                description='Source: GET /api/public/v1/admin/organizations'
                rows={organizations}
                emptyMessage='Chưa có tổ chức nào trong hệ thống.'
                columns={[
                    {
                        key: 'name',
                        title: 'Tổ chức',
                        render: (row) => (
                            <div>
                                <div className='font-semibold text-bela-secondary-2'>{row.name}</div>
                                <div className='mt-1 text-xs text-bela-neutral-3'>{row.slug}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'manager',
                        title: 'Manager',
                        render: (row) => (
                            <div>
                                <div>{row.manager_name || 'Chưa gán'}</div>
                                <div className='mt-1 text-xs text-bela-neutral-3'>{row.manager_email || '—'}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'status',
                        title: 'Trạng thái',
                        render: (row) => <span className='rounded-full bg-bela-bg-primary px-3 py-1 text-xs font-semibold text-bela-primary-1'>{row.status}</span>,
                    },
                    {
                        key: 'counts',
                        title: 'Quy mô',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.users_count} users</div>
                                <div>{row.venues_count} venues</div>
                                <div>{row.teams_count} teams</div>
                                <div>{row.bookings_count} bookings</div>
                            </div>
                        ),
                    },
                    {
                        key: 'address',
                        title: 'Địa chỉ',
                        render: (row) => row.address || 'Chưa cập nhật',
                    },
                ]}
            />
        </div>
    );
};

export default AdminOrganizationsList;
