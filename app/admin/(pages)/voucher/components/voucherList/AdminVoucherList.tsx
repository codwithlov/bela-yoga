'use client'
import { useEffect, useState } from 'react';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { VOUCHER } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminVoucherTable from './list/AdminVoucherTable';
import AdminVoucherFilter from './list/AdminVoucherFilter';
import AdminVoucherCreateUpdate from './AdminVoucherCreateUpdate';

const AdminVoucherList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<object>({}); 
  const { data, isFetching, refetch } = useGetDataQuery(
    `${VOUCHER}${toQueryString(param)}`,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <>
      <div className='flex justify-between mb-1 -mt-2'>
        <h3>Danh sách voucher</h3>
        <div className='flex gap-2'>
          <ShowCreateDrawer title='Thêm mới voucher' width='600px' code="VOUCHER_CREATE" destroyOnHidden>
            {(closeModal) => (
              <AdminVoucherCreateUpdate
                reloadDataList={refetch}
                closeModal={closeModal}
              />
            )}
          </ShowCreateDrawer>
        </div>

      </div>
      <AdminVoucherFilter
        setParam={setParam}
        setPage={setPage}
        voucherTypes={data?.voucherTypes}
      />
      <AdminVoucherTable
        mappedData={data?.data}
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

export default AdminVoucherList