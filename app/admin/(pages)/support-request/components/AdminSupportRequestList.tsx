'use client'
import { useState } from 'react';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { SUPPORT_REQUEST } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminSupportRequestFilter from './list/AdminSupportRequestFilter';
import AdminSupportRequestTable from './list/AdminSupportRequestTable';
import CustomerStatus from '@/components/admin/organisms/customerStatus/CustomerStatus';

const AdminSupportRequestList = () => {
    const [page, setPage] = useState(1);
    const [param, setParam] = useState<any>({});

    const { data: supportRequestData, isFetching, refetch } =
        useGetDataQuery(`${SUPPORT_REQUEST}${toQueryString(param)}`, { refetchOnMountOrArgChange: true, });
    const customerStatusOptions = supportRequestData?.data?.customerStatusOptions;
    return (
        <>
            <div className='flex justify-between mb-1'>
                <h3>Danh sách yêu cầu tư vấn</h3>
                <CustomerStatus
                    customerStatusOptions={customerStatusOptions}
                    reloadDataList={refetch}
                    type='SUPPORT_REQUEST'
                />
            </div>
            <AdminSupportRequestFilter
                setParam={setParam}
                setPage={setPage}
                customerStatusOptions={customerStatusOptions}
            />
            <AdminSupportRequestTable
                mappedData={supportRequestData?.data?.supportRequestList}
                refetch={refetch}
                isFetching={isFetching}
                customerStatusOptions={customerStatusOptions}
            />
            <CTPagination
                setPage={setPage}
                setParam={setParam}
                pagination={supportRequestData?.data?.pagination}
                page={page}
            />
        </>
    )
}

export default AdminSupportRequestList