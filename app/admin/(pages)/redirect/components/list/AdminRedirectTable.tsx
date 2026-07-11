'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table, Tag } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation } from "@/services/api/common";
import { REDIRECT } from "@/constants/route";
import AdminRedirectCreateUpdate from "../AdminRedirectCreateUpdate";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { ACTION_DELETE, ACTION_UPDATE } from "@/constants/action";
import { Redirect } from "@/interfaces/redirect";
import useWindowSize from "@/hooks/useWindowSize";

interface ActionProps {
    mappedData: Redirect[];
    refetch: any;
    isFetching: any;
}

const AdminRedirectTable = (props: ActionProps) => {
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
                url: REDIRECT + '/' + currentRecord.current?.key,
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
                    handleConfirm('Xác nhận xóa redirect', handleOnDeleteOk);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk]
    );

    const columns = useMemo(() => [
        {
            title: 'Từ link',
            key: 'url_from',
        },
        {
            title: 'Đến slug',
            key: 'slug',
        },
        {
            title: 'Đến link',
            key: 'url_to',
        },
        {
            title: 'Trạng thái',
            key: 'status',
        },
        ...getActionColumn(['', ACTION_UPDATE, ACTION_DELETE], handleOnChangeSelect, 'REDIRECT'),
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
                {...getUpdateDrawerProps('800px')}
                onClose={() => setOpenEdit(false)}
            >
                <AdminRedirectCreateUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    redirect_id={currentRecord.current?.key}
                />
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminRedirectTable