'use client'
import { useMemo, useState } from 'react';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { VOUCHER } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminCustomerTable from './list/AdminCustomerTable';
import AdminCustomerFilter from './list/AdminCustomerFilter';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import AdminCustomerCreateUpdate from './AdminCustomerCreateUpdate';

const AdminCustomerList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<object>({});
  const { data, isFetching, refetch } = useGetDataQuery(
    `${VOUCHER}/get-customer-list${toQueryString(param)}`,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const mappedData = useMemo(() => {
    return data?.data?.map((item: any) => ({
      ...item,
      key: item.id,
      voucher_name: item.voucher?.name,
      created_at: formatDateTime(item.created_at, 'HH:mm - DD/MM/YYYY'),
    }))
  }, [data?.data]);

  return (
    <>
      <div className='flex justify-between mb-2 -mt-2'>
        <h3>Danh sách khách hàng</h3>
        <ShowCreateDrawer title='Tạo mới khách hàng' width='600px' code="VOUCHER_CUSTOMER" destroyOnHidden>
          {(closeModal) => (
            <AdminCustomerCreateUpdate
              reloadDataList={refetch}
              closeModal={closeModal}
            />
          )}
        </ShowCreateDrawer>
      </div>
      <AdminCustomerFilter
        setParam={setParam}
        setPage={setPage}
        voucherOptions={data?.voucherOptions}
      />
      <AdminCustomerTable
        mappedData={mappedData}
        refetch={refetch}
        isFetching={isFetching}
      />
      <CTPagination
        setPage={setPage}
        setParam={setParam}
        pagination={data?.pagination}
        page={page}
      />
    </>
  )
}

export default AdminCustomerList