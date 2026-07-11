'use client'
import { useEffect, useMemo, useState } from 'react';
import { useGetDataQuery } from '@/services/api/common';
import { toQueryString } from '@/utils/apiUtils';
import { NATION } from '@/constants/route';
import AdminNationTable from './list/AdminNationTable';
import AdminNationFilter from './list/AdminNationFilter';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { addKeyForList } from '@/utils/helper';
import AdminDisplayOrder from '@/components/admin/organisms/displayOrder/AdminDisplayOrder';
import { NATION_SLUG } from '@/constants/SlugPermalink';

const AdminNationList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<any>({});
  const [mappedData, setMappedData] = useState<any>([]);

  const { data, isFetching, refetch } =
    useGetDataQuery(`${NATION}${toQueryString(param)}`, { refetchOnMountOrArgChange: true, });

  useEffect(() => {
    if (data?.data != null) {
      setMappedData(addKeyForList(data?.data, 'nation_id'));
    }
  }, [data?.data])

  return (
    <>
      <div className='mb-2 flex justify-between'>
        <h3>Danh sách quốc gia</h3>
        <AdminDisplayOrder type={NATION_SLUG} />
      </div>
      <AdminNationFilter setParam={setParam} setPage={setPage} />
      <AdminNationTable
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

export default AdminNationList