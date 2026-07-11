'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Drawer, Table } from 'antd';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { getUpdateDrawerProps, handleApiRequest } from '@/utils/helper';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { useDeleteMutation } from '@/services/api/common';
import { AUTHOR } from '@/constants/route';
import { getActiveColumn, slugColumn } from '@/constants/tableColumns';
import useGetActionColumn from '@/hooks/useGetActionColumn';
import { ACTION_DELETE, ACTION_UPDATE } from '@/constants/action';
import { IAuthor } from '@/interfaces/user';
import useWindowSize from '@/hooks/useWindowSize';
import AdminAuthorCreateUpdate from '../AdminAuthorCreateUpdate';
interface ActionProps {
  mappedData: IAuthor[];
  refetch: any;
  isFetching: any;
}

const AdminAuthorTable = (props: ActionProps) => {
  const { mappedData, refetch, isFetching } = props;
  const { handleConfirm, confirmModal } = useConfirm();
  const [spinning, setSpinning] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const getActionColumn = useGetActionColumn();
  const windowSize = useWindowSize();
  const currentRecord = useRef<any>(null);

  const [deleteApi] = useDeleteMutation();

  const handleOnDeleteOk = useCallback(async () => {
    const body = {
      url: AUTHOR + '/' + currentRecord.current?.key,
    };
    await handleApiRequest(deleteApi(body), refetch, setSpinning);
  }, [deleteApi, refetch]);
  const handleOnChangeSelect = useCallback(
    (selectValue: any, record: any) => {
      currentRecord.current = record;
      switch (selectValue) {
        case ACTION_UPDATE:
          setOpenEdit(true);
          break;
        case ACTION_DELETE:
          handleConfirm(
            'Xác nhận xóa tác giả ' + record?.display_name || '',
            handleOnDeleteOk
          );
          break;
      }
    },
    [handleConfirm, handleOnDeleteOk]
  );

  const columns = useMemo(
    () =>
      [
        {
          title: 'Tên hiển thị',
          key: 'display_name',
        },
        {
          title: 'Nick name',
          key: 'nickname',
          width: 300,
        },
        slugColumn,
        {
          title: 'Vai trò',
          key: 'role_author',
          width: 100,
        },
        { ...getActiveColumn(), title: 'Kích hoạt' },
        ...getActionColumn(
          ['', ACTION_UPDATE, ACTION_DELETE],
          handleOnChangeSelect,
          'USER'
        ),
      ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' })),
    [getActionColumn, handleOnChangeSelect]
  );

  return (
    <>
      <AdminLoading isLoading={spinning} />
      <Table
        columns={columns}
        dataSource={mappedData}
        pagination={false}
        loading={isFetching}
        scroll={{ y: (windowSize?.height || 800) - 280 }}
      />
      <Drawer
        title="Chỉnh sửa tác giả"
        open={openEdit}
        {...getUpdateDrawerProps('500px')}
        onClose={() => setOpenEdit(false)}
      >
        <AdminAuthorCreateUpdate
          reloadDataList={refetch}
          closeModal={() => setOpenEdit(false)}
          author_id={currentRecord.current?.key}
        />
      </Drawer>
      {confirmModal}
    </>
  );
};

export default AdminAuthorTable;
