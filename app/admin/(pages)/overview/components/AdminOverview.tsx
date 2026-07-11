'use client';

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import AdminStatGrid from '@/components/admin/sportverse/AdminStatGrid';
import { useGetAdminOverviewQuery } from '@/services/api/admin';

const AdminOverview = () => {
    const { data, isLoading, isFetching, error } = useGetAdminOverviewQuery();
    const overview = data?.data;

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải tổng quan SPORTVERSE admin...' />;
    }

    if (error || !overview) {
        return <AdminPageState message='Không thể tải tổng quan admin từ CMS. Vui lòng kiểm tra phiên đăng nhập hoặc admin API.' />;
    }

    const metrics = overview.metrics;

    return (
        <div className='space-y-4'>
            <AdminPageHeader
                eyebrow='Overview'
                title='Tổng quan vận hành SPORTVERSE'
                description='Màn hình overview đã chuyển sang dùng admin API thật từ CMS để hiển thị các chỉ số vận hành, booking gần đây và snapshot tổ chức.'
                badges={overview.scope.workspace_organization ? [`Workspace: ${overview.scope.workspace_organization.name}`] : []}
            />

            <AdminStatGrid
                items={[
                    { label: 'Organizations', value: metrics.organizations_count },
                    { label: 'Venues', value: metrics.venues_count },
                    { label: 'Bookings', value: metrics.bookings_count, hint: `${metrics.pending_bookings_count} pending · ${metrics.confirmed_bookings_count} confirmed` },
                    { label: 'Doanh thu tháng', value: `${metrics.monthly_revenue} ${metrics.currency}` },
                    { label: 'Users', value: metrics.users_count },
                    { label: 'Roles', value: metrics.roles_count },
                    { label: 'Matches', value: metrics.matches_count },
                ]}
            />

            <div className='grid gap-4 xl:grid-cols-2'>
                <AdminDataTable
                    title='Recent bookings'
                    description='Các booking mới nhất trong phạm vi quản trị hiện tại.'
                    rows={overview.recent_bookings}
                    emptyMessage='Chưa có booking nào.'
                    columns={[
                        {
                            key: 'booking',
                            title: 'Booking',
                            render: (row) => (
                                <div>
                                    <div className='font-semibold text-sgt-secondary-2'>#{row.id}</div>
                                    <div className='mt-1 text-xs text-sgt-neutral-3'>{row.organization_name || '—'} · {row.venue_name || '—'}</div>
                                </div>
                            ),
                        },
                        {
                            key: 'user',
                            title: 'Người đặt',
                            render: (row) => (
                                <div>
                                    <div>{row.user_name || '—'}</div>
                                    <div className='mt-1 text-xs text-sgt-neutral-3'>{row.user_email || row.team_name || '—'}</div>
                                </div>
                            ),
                        },
                        {
                            key: 'schedule',
                            title: 'Lịch',
                            render: (row) => (
                                <div className='text-xs'>
                                    <div>{row.starts_at ? new Date(row.starts_at).toLocaleString('vi-VN') : '—'}</div>
                                    <div className='mt-1 text-sgt-neutral-3'>{row.ends_at ? new Date(row.ends_at).toLocaleString('vi-VN') : '—'}</div>
                                </div>
                            ),
                        },
                    ]}
                />

                <AdminDataTable
                    title='Organization snapshot'
                    description='Các tổ chức tiêu biểu trong phạm vi đang quản trị.'
                    rows={overview.organizations}
                    emptyMessage='Chưa có tổ chức nào.'
                    columns={[
                        {
                            key: 'organization',
                            title: 'Tổ chức',
                            render: (row) => (
                                <div>
                                    <div className='font-semibold text-sgt-secondary-2'>{row.name}</div>
                                    <div className='mt-1 text-xs text-sgt-neutral-3'>{row.slug}</div>
                                </div>
                            ),
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            render: (row) => row.status,
                        },
                        {
                            key: 'counts',
                            title: 'Quy mô',
                            render: (row) => (
                                <div className='space-y-1 text-xs'>
                                    <div>{row.users_count} users</div>
                                    <div>{row.venues_count} venues</div>
                                    <div>{row.teams_count} teams</div>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default AdminOverview;
