'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table } from "antd";
import useWindowSize from "@/hooks/useWindowSize";
import { ICustomer } from "@/interfaces/voucher";
import { useDeleteMutation } from "@/services/api/common";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { VOUCHER } from "@/constants/route";
import { ACTION_DELETE, ACTION_UPDATE } from "@/constants/action";
import AdminCustomerCreateUpdate from "../AdminCustomerCreateUpdate";
import { AdminLoading } from "@/components/admin/atoms/Loading";

interface ActionProps {
    mappedData: ICustomer[];
    refetch: any;
    isFetching: any;
}

const AdminCustomerTable = (props: ActionProps) => {
    const { mappedData, isFetching, refetch } = props;
    const windowSize = useWindowSize();
    const [deleteApi] = useDeleteMutation();
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const getActionColumn = useGetActionColumn();
    const currentRecord = useRef<any>(null);

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: VOUCHER + '/' + currentRecord.current?.id + '/destroy-fake-result',
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
                    handleConfirm('Xác nhận xóa', handleOnDeleteOk);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk]
    );

    const columns = useMemo(() => [
        {
            title: 'Voucher',
            key: 'voucher_name',
        },
        {
            title: 'Giá trị',
            key: 'voucher_value',
        },
        {
            title: 'Tên',
            key: 'name',
        },
        {
            title: 'SDT',
            key: 'phone',
        },
        {
            title: 'Thời điểm',
            key: 'created_at'
        },
        {
            title: 'Nguồn',
            key: 'type',
            render: (value: string) => (value === 'FAKE' ? 'Tự tạo' : 'Khách hàng'),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: any, record: any) => {
                if (record.type !== 'FAKE') return <></>;
                return getActionColumn(['', ACTION_UPDATE, ACTION_DELETE], handleOnChangeSelect, 'VOUCHER_CUSTOMER')[0].render(_, record);
            },
            align: 'center',
            width: 125,
        },
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
                scroll={{ y: ((windowSize?.height || 800) - 300) }}
            />
            <Drawer
                title="Chỉnh sửa voucher"
                open={openEdit}
                {...getUpdateDrawerProps('600px')}
                onClose={() => setOpenEdit(false)}
            >
                <AdminCustomerCreateUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    result_id={currentRecord.current?.id}
                />
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminCustomerTable