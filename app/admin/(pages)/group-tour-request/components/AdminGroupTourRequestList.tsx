'use client'
import { useState } from 'react';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { GROUP_TOUR_REQUEST } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminGroupTourRequestFilter from './list/AdminGroupTourRequestFilter';
import AdminGroupTourRequestTable from './list/AdminGroupTourRequestTable';
import CustomerStatus from '@/components/admin/organisms/customerStatus/CustomerStatus';

const AdminGroupTourRequestList = () => {
    const [page, setPage] = useState(1);
    const [param, setParam] = useState<any>({});

    const { data: groupTourRequestData, isFetching, refetch } =
        useGetDataQuery(`${GROUP_TOUR_REQUEST}${toQueryString(param)}`, { refetchOnMountOrArgChange: true, });
    const customerStatusOptions = groupTourRequestData?.data?.customerStatusOptions;
    return (
        <>
            <div className='flex justify-between mb-1'>
                <h3>Danh sách yêu cầu tư vấn</h3>
                <CustomerStatus
                    customerStatusOptions={customerStatusOptions}
                    reloadDataList={refetch}
                    type='GROUP_TOUR_REQUEST'
                />
            </div>
            <AdminGroupTourRequestFilter
                setParam={setParam}
                setPage={setPage}
                customerStatusOptions={customerStatusOptions}
            />
            <AdminGroupTourRequestTable
                mappedData={groupTourRequestData?.data?.groupTourRequestList}
                refetch={refetch}
                isFetching={isFetching}
                customerStatusOptions={customerStatusOptions}
            />
            <CTPagination
                setPage={setPage}
                setParam={setParam}
                pagination={groupTourRequestData?.data?.pagination}
                page={page}
            />
        </>
    )
}

export default AdminGroupTourRequestList