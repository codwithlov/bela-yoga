'use client'
import { useEffect, useState } from 'react';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { TAG } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminTagCreateUpdate from './AdminTagCreateUpdate';
import AdminTagFilter from './list/AdminTagFilter';
import AdminTagTable from './list/AdminTagTable';
import { Tag } from '@/interfaces/tag';
import AdminTagType from './AdminTagType';

const AdminTagList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<object>({});
  const [mappedData, setMappedData] = useState([]);
  const { data, isFetching, refetch } = useGetDataQuery(
    `${TAG}${toQueryString(param)}`,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setMappedData(data?.data.map((item: Tag) => ({
      ...item,
      ...item.tagslug,
      key: item.id,
    })));
  }, [data?.data])

  return (
    <>
      <div className='flex justify-between mb-1'>
        <h3>Danh sách tag</h3>
        <div className='flex gap-2'>
          <AdminTagType tagTypes={data?.tagTypes} reloadDataList={refetch} />
          <ShowCreateDrawer title='Thêm mới tag' width='1000px' code="TAG_CREATE">
            {(closeModal) => (
              <AdminTagCreateUpdate
                reloadDataList={refetch}
                closeModal={closeModal}
              />
            )}
          </ShowCreateDrawer>
        </div>

      </div>
      <AdminTagFilter
        setParam={setParam}
        setPage={setPage}
        tagTypes={data?.tagTypes}
      />
      <AdminTagTable
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

export default AdminTagList