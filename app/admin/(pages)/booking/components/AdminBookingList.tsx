'use client'

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable'
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader'
import AdminPageState from '@/components/admin/sportverse/AdminPageState'
import { useGetAdminBookingsQuery } from '@/services/api/admin'

const AdminBookingList = () => {
    const { data, isLoading, isFetching, error } = useGetAdminBookingsQuery()
    const bookings = data?.data?.bookings || []

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải danh sách booking...' />
    }

    if (error) {
        return <AdminPageState message='Không thể tải danh sách booking từ CMS admin API.' />
    }

    return (
        <div className='space-y-4'>
            <AdminPageHeader
                eyebrow='Bookings'
                title='Danh sách booking SPORTVERSE'
                description='Trang booking đã được nối với admin API thật để xem trạng thái, người đặt, khung giờ và tổng tiền.'
            />

            <AdminDataTable
                title='Bookings'
                description='Source: GET /api/public/v1/admin/bookings'
                rows={bookings}
                emptyMessage='Chưa có booking nào trong phạm vi hiện tại.'
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
                        key: 'time',
                        title: 'Thời gian',
                        render: (row) => (
                            <div className='text-xs'>
                                <div>{row.starts_at ? new Date(row.starts_at).toLocaleString('vi-VN') : '—'}</div>
                                <div className='mt-1 text-sgt-neutral-3'>{row.ends_at ? new Date(row.ends_at).toLocaleString('vi-VN') : '—'}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'status',
                        title: 'Trạng thái',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div className='inline-flex rounded-full bg-sgt-bg-primary px-3 py-1 font-semibold text-sgt-primary-1'>{row.status}</div>
                                <div>{row.payment_status}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'amount',
                        title: 'Tổng tiền',
                        render: (row) => `${row.total_amount} ${row.currency || ''}`,
                    },
                ]}
            />
        </div>
    )
}

export default AdminBookingList