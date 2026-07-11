'use client'
import { useEffect, useState } from 'react';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import AdminDestinationCreateUpdate from './AdminDestinationCreateUpdate';
import AdminDestinationTable from './list/AdminDestinationTable';
import AdminDestinationFilter from './list/AdminDestinationFilter';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { addKeyForList } from '@/utils/helper';
import { useGetDataQuery } from '@/services/api/common';
import { DESTINATION } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminDeleteDraft from '@/components/admin/organisms/AdminDeleteDraft';

const AdminDestinationList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<object>({});
  const [mappedData, setMappedData] = useState<any>([]);
  const [subTitle, setSubTitle] = useState<any>('');

  const { data, isFetching, refetch } =
    useGetDataQuery(`${DESTINATION}${toQueryString(param)}`, { refetchOnMountOrArgChange: true, });

  useEffect(() => {
    if (data?.data != null) {
      setMappedData(addKeyForList(data?.data, 'id'));
    }
  }, [data?.data])

  return (
    <>
      <div className='flex justify-between mb-1'>
        <h3>{`Danh sách điểm đến ${subTitle}`}</h3>
        <div className='flex gap-2'>
          <AdminDeleteDraft draftList={data?.draftList} reloadDataList={refetch} type='DESTINATION' />
          <ShowCreateDrawer title='Thêm mới điểm đến (Bản nháp sẽ được lưu khi slug được nhập)' code='DESTINATION_CREATE' destroyOnHidden>
            {(closeModal, open) => (
              <AdminDestinationCreateUpdate
                reloadDataList={refetch}
                closeModal={closeModal}
                open={open}
              />
            )}
          </ShowCreateDrawer>
        </div>

      </div >
      <AdminDestinationFilter
        nationsProp={data?.nations}
        setParam={setParam}
        setPage={setPage}
        setSubTitle={setSubTitle}
        draftCount={data?.draftCount}
      />
      <AdminDestinationTable
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

export default AdminDestinationList