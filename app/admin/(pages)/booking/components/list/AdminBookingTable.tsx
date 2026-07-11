'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Select, Table } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { formatAllPriceAndDateKeyArray, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation, usePostDataMutation } from "@/services/api/common";
import { BOOKING } from "@/constants/route";
import { ACTION_DELETE, ACTION_RESTORE } from "@/constants/action";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { formatDateTime } from "@/utils/formatDate";
import useWindowSize from "@/hooks/useWindowSize";
import { getCustomerStatus } from "@/constants/tableColumns";

interface ActionProps {
    mappedData: any;
    refetch: any;
    isFetching: any;
    customerStatusOptions: any;
}

const AdminBookingTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching, customerStatusOptions } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const currentRecord = useRef<any>(null);
    const windowSize = useWindowSize();

    const [deleteApi] = useDeleteMutation();
    const [postApi] = usePostDataMutation();

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: BOOKING + '/' + currentRecord.current?.id,
            }
            await handleApiRequest(deleteApi(body), refetch, setSpinning);
        },
        [deleteApi, refetch]
    );

    const restore = useCallback(async (id: number) => {
        const body = {
            url: BOOKING + '/restore',
            data: { id },
        }
        await handleApiRequest(postApi(body), refetch, setSpinning);
    }, [postApi, refetch]);

    const handleOnChangeSelect = useCallback(
        (selectValue: string, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_DELETE:
                    handleConfirm('Xác nhận xóa yêu cầu booking', handleOnDeleteOk);
                    break;
                case ACTION_RESTORE:
                    restore(record.id);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk, restore]
    );

    const changeStatus = useCallback(async (id: number, customer_status_id: number) => {
        const body = {
            url: BOOKING + '/change-status',
            data: { id, customer_status_id },
        }
        await handleApiRequest(postApi(body), refetch, setSpinning);
    }, [postApi, refetch]);

    const getActionColumn = useGetActionColumn();
    const columns = useMemo(() => [
        {
            title: 'Mã tour',
            key: 'series_code',
            width: 300,
        },
        {
            title: 'Họ và tên',
            key: 'full_name',
            width: 180,
        },
        {
            title: 'Số điện thoại',
            key: 'phone',
            width: 150,
        },
        {
            title: 'Số lượng',
            key: 'number',
            render: (_: any, record: any) => `ADL:${record.adl_number}, CHD:${record.chd_number}, INF:${record.inf_number}`,
            width: 180,
        },
        getCustomerStatus(customerStatusOptions, changeStatus),
        {
            title: 'Giá ADL',
            key: 'price_adl',
        },
        {
            title: 'Giá CHD',
            key: 'price_chd',
        },
        {
            title: 'Giá INF',
            key: 'price_inf',
        },
        {
            title: 'Thời điểm đặt',
            key: 'created_at',
            render: (value: any) => formatDateTime(value, 'HH:mm DD/MM'),
        },
        ...getActionColumn(['', ACTION_DELETE], handleOnChangeSelect, 'BOOKING', 'right'),

    ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' })
    ), [changeStatus, customerStatusOptions, getActionColumn, handleOnChangeSelect]);

    const dataSource = useMemo(() => formatAllPriceAndDateKeyArray(mappedData, 'id'), [mappedData]);

    return (
        <>
            <AdminLoading isLoading={spinning} />
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={isFetching}
                scroll={{ x: columns.length * 160, y: ((windowSize?.height || 800) - 280) }}
            />
            {confirmModal}
        </>
    )
}

export default AdminBookingTable