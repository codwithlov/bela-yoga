'use client';
import { useEffect, useState } from 'react';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { AUTHOR } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import { IAuthor } from '@/interfaces/user';
import AdminAuthorCreateUpdate from './AdminAuthorCreateUpdate';
import AdminAuthorFilter from './list/AdminAuthorFilter';
import AdminAuthorTable from './list/AdminAuthorTable';
import { authorRoles } from './AuthorFields';

const AdminUserList = () => {
  const [page, setPage] = useState(1);
  const [param, setParam] = useState<object>({});
  const [mappedData, setMappedData] = useState<IAuthor[]>([]);

  const { data, isFetching, refetch } = useGetDataQuery(
    `${AUTHOR}${toQueryString(param)}`,
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data?.data) {
      setMappedData(
        data.data.map((item: IAuthor) => ({
          ...item,
          key: item.id,
          slug: 'author/' + item.author_slug,
          role_author: (item.role_author ? authorRoles[item.role_author as keyof typeof authorRoles] : '') || '',
        }))
      );
    }
  }, [data?.data]);

  return (
    <>
      <div className="flex justify-between mb-1">
        <h3>Danh sách Tác giả</h3>
        <ShowCreateDrawer
          title="Thêm mới tác giả"
          width="450px"
          code="AUTHOR_CREATE"
        >
          {(closeModal) => (
            <AdminAuthorCreateUpdate
              reloadDataList={refetch}
              closeModal={closeModal}
            />
          )}
        </ShowCreateDrawer>
      </div>
      <AdminAuthorFilter setParam={setParam} setPage={setPage} />
      <AdminAuthorTable
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
  );
};

export default AdminUserList;
