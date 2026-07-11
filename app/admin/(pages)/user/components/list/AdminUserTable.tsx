'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table, Tag } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation } from "@/services/api/common";
import { USER } from "@/constants/route";
import AdminUserCreateUpdate from "../AdminUserCreateUpdate";
import { getActiveColumn } from "@/constants/tableColumns";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { ACTION_DELETE, ACTION_UPDATE } from "@/constants/action";
import { IUser } from "@/interfaces/user";
import useWindowSize from "@/hooks/useWindowSize";

interface ActionProps {
    mappedData: IUser[];
    refetch: any;
    isFetching: any;
}

const AdminUserTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const getActionColumn = useGetActionColumn();
    const windowSize = useWindowSize();
    const currentRecord = useRef<any>(null);

    const [deleteApi] = useDeleteMutation();

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: USER + '/' + currentRecord.current?.key,
            }
            await handleApiRequest(deleteApi(body), refetch, setSpinning);
        },
        [deleteApi, refetch]
    );
    const handleOnChangeSelect = useCallback(
        (selectValue: any, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_UPDATE:
                    setOpenEdit(true);
                    break;
                case ACTION_DELETE:
                    handleConfirm('Xác nhận xóa người dùng ' + record?.full_name || '', handleOnDeleteOk);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk]
    );

    const columns = useMemo(() => [
        {
            title: 'Họ và tên',
            key: 'full_name',
        },
        {
            title: 'Email',
            key: 'email',
            width: 300,
        },
        {
            title: 'Số điện thoại',
            key: 'phone',
        },
        {
            title: 'Vai trò',
            key: 'roles',
            render: (value: any) => (
                <>
                    {(!value || value.length === 0) ?
                        <Tag>khách</Tag> :
                        (value).map((item: any, index: any) => (
                            <Tag key={index}>
                                {item}
                            </Tag>
                        ))
                    }
                </>
            ),
        },
        { ...getActiveColumn(), title: 'Kích hoạt' },
        ...getActionColumn(['', ACTION_UPDATE, ACTION_DELETE], handleOnChangeSelect, 'USER'),
    ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' })
    ), [getActionColumn, handleOnChangeSelect]);

    return (
        <>
            <AdminLoading isLoading={spinning} />
            <Table
                columns={columns}
                dataSource={mappedData}
                pagination={false}
                loading={isFetching}
                scroll={{ y: ((windowSize?.height || 800) - 280) }}
            />
            <Drawer
                title="Chỉnh sửa nguời dùng"
                open={openEdit}
                {...getUpdateDrawerProps('450px')}
                onClose={() => setOpenEdit(false)}
            >
                <AdminUserCreateUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    user_id={currentRecord.current?.key}
                />
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminUserTable