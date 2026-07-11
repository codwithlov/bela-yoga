'use client'
import { useEffect, useState } from 'react';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { SLUG } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminSlugFilter from './list/AdminSlugFilter';
import AdminSlugTable from './list/AdminSlugTable';
import { SlugPermalink } from '@/interfaces/slugPermalink';

const AdminSlugList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<object>({});
  const [mappedData, setMappedData] = useState<SlugPermalink[]>([]);

  const { data, isFetching, refetch } =
    useGetDataQuery(`${SLUG}${toQueryString(param)}`, { refetchOnMountOrArgChange: true, });

  useEffect(() => {
    if (data) {
      setMappedData(
        data.data.map((item: SlugPermalink) => ({
          ...item,
          key: item.id,
          entity_type: data?.slug_entities?.find((entity: any) => entity.type === item.entity_type)?.type_name,
          entity_name: data?.postTypes.find((v: any) => v.value == item.entity_name)?.label || item.entity_name
        }))
      );
    }
  }, [data]);

  return (
    <>
      <div className='flex justify-between mb-2'>
        <h3>Danh sách slug</h3>
      </div>
      <AdminSlugFilter
        setParam={setParam}
        setPage={setPage}
        slugEntities={data?.slug_entities}
      />
      <AdminSlugTable
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

export default AdminSlugList