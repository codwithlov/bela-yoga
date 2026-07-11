'use client';

import AdminDataTable from '@/components/admin/sportverse/AdminDataTable';
import AdminPageHeader from '@/components/admin/sportverse/AdminPageHeader';
import AdminPageState from '@/components/admin/sportverse/AdminPageState';
import { useGetAdminVenuesQuery } from '@/services/api/admin';

const AdminVenuesList = () => {
    const { data, isLoading, isFetching, error } = useGetAdminVenuesQuery();
    const venues = data?.data?.venues || [];

    if (isLoading || isFetching) {
        return <AdminPageState message='Đang tải danh sách sân & venue...' />;
    }

    if (error) {
        return <AdminPageState message='Không thể tải dữ liệu venue từ CMS admin API.' />;
    }

    return (
        <div className='space-y-4'>
            <AdminPageHeader
                eyebrow='Venues'
                title='Sân & venue trong hệ thống SPORTVERSE'
                description='Danh sách venue đang mở cho booking, định dạng sân, giá mặc định và lượt booking liên quan.'
            />

            <AdminDataTable
                title='Venues'
                description='Source: GET /api/public/v1/admin/venues'
                rows={venues}
                emptyMessage='Chưa có venue nào trong phạm vi quản trị hiện tại.'
                columns={[
                    {
                        key: 'name',
                        title: 'Venue',
                        render: (row) => (
                            <div>
                                <div className='font-semibold text-sgt-secondary-2'>{row.name}</div>
                                <div className='mt-1 text-xs text-sgt-neutral-3'>{row.organization_name || 'Không rõ tổ chức'}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'format',
                        title: 'Loại sân',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.sport_type || '—'}</div>
                                <div>{row.field_format || row.venue_type}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'status',
                        title: 'Trạng thái',
                        render: (row) => (
                            <div className='space-y-1'>
                                <div className='rounded-full bg-sgt-bg-primary px-3 py-1 text-xs font-semibold text-sgt-primary-1 inline-flex'>{row.status}</div>
                                <div className='text-xs text-sgt-neutral-3'>{row.is_bookable ? 'Bookable' : 'Tạm khóa'}</div>
                            </div>
                        ),
                    },
                    {
                        key: 'pricing',
                        title: 'Giá mặc định',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.default_price || 'Liên hệ'} {row.currency || ''}</div>
                                <div>{row.default_duration_minutes || '—'} phút</div>
                            </div>
                        ),
                    },
                    {
                        key: 'traffic',
                        title: 'Lượt booking',
                        render: (row) => (
                            <div className='space-y-1 text-xs'>
                                <div>{row.bookings_count} bookings</div>
                                <div>{row.next_booking_at ? new Date(row.next_booking_at).toLocaleString('vi-VN') : 'Chưa có lịch tới'}</div>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default AdminVenuesList;
