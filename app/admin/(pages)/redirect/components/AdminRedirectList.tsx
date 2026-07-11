'use client'
import { useEffect, useState } from 'react';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { REDIRECT } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminRedirectCreateUpdate from './AdminRedirectCreateUpdate';
import AdminRedirectFilter from './list/AdminRedirectFilter';
import AdminRedirectTable from './list/AdminRedirectTable';
import { Redirect } from '@/interfaces/redirect';

const AdminRedirectList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<object>({});
  const [mappedData, setMappedData] = useState<Redirect[]>([]);

  const { data, isFetching, refetch } =
    useGetDataQuery(`${REDIRECT}${toQueryString(param)}`, { refetchOnMountOrArgChange: true, });

  useEffect(() => {
    if (data?.data) {
      setMappedData(
        data.data.map((item: Redirect) => ({
          ...item,
          key: item.id,
        }))
      );
    }
  }, [data?.data]);

  return (
    <>
      <div className='flex justify-between mb-1'>
        <h3>Danh sách redirect</h3>
        <ShowCreateDrawer title='Thêm mới redirect' width='800px' code="REDIRECT_CREATE">
          {(closeModal) => (
            <AdminRedirectCreateUpdate
              reloadDataList={refetch}
              closeModal={closeModal}
            />
          )}
        </ShowCreateDrawer>
      </div>
      <AdminRedirectFilter
        setParam={setParam}
        setPage={setPage}
      />
      <AdminRedirectTable
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

export default AdminRedirectList