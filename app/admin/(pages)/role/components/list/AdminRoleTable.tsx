'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table, Tag } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import AdminRoleCreateUpdate from "../AdminRoleCreateUpdate";
import ActionTable from "@/components/admin/molecules/ActionTable";
import { getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation } from "@/services/api/common";
import { ROLE } from "@/constants/route";
import { ACTION_DELETE, ACTION_UPDATE } from "@/constants/action";
import useGetActionColumn from "@/hooks/useGetActionColumn";

interface ActionProps {
    mappedData: any;
    refetch: any;
    isFetching: any;
}

const AdminRoleTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const currentRecord = useRef<any>(null);

    const [deleteApi] = useDeleteMutation();

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: ROLE + '/' + currentRecord.current?.key,
            }
            await handleApiRequest(deleteApi(body), refetch, setSpinning);
        },
        [deleteApi, refetch]
    );
    const handleOnChangeSelect = useCallback(
        (selectValue: string, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_UPDATE:
                    setOpenEdit(true);
                    break;
                case ACTION_DELETE:
                    handleConfirm('Xác nhận xóa vai trò ' + record?.name, handleOnDeleteOk);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk]
    );
    const getActionColumn = useGetActionColumn();
    const columns = useMemo(() => [
        {
            title: 'Tên vai trò',
            key: 'name',
        },
        {
            title: 'Danh sách được truy cập',
            key: 'accessList',
            render: (value: string[]) => (
                <>
                    {
                        value.map((item, index) => (
                            <Tag key={index}>
                                {item}
                            </Tag>
                        ))
                    }
                </>
            )
        },
        ...getActionColumn(['', ACTION_UPDATE, ACTION_DELETE], handleOnChangeSelect, 'ROLE'),

    ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' })
    ), [getActionColumn, handleOnChangeSelect]);

    return (
        <>
            <AdminLoading isLoading={spinning}></AdminLoading>
            <Table
                columns={columns}
                dataSource={mappedData}
                pagination={false}
                loading={isFetching}
            />
            <Drawer
                title="Chỉnh sửa vai trò"
                open={openEdit}
                {...getUpdateDrawerProps('800px')}
                onClose={() => setOpenEdit(false)}
            >
                <AdminRoleCreateUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    role_id={currentRecord.current?.key}
                />
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminRoleTable