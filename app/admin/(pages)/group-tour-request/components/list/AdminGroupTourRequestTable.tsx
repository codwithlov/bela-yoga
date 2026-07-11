'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { formatAllPriceAndDateKeyArray, getColumns, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation, usePostDataMutation } from "@/services/api/common";
import { GROUP_TOUR_REQUEST } from "@/constants/route";
import { ACTION_DELETE, ACTION_RESTORE } from "@/constants/action";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { formatDateTime } from "@/utils/formatDate";
import useWindowSize from "@/hooks/useWindowSize";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setColumnsOptions, setSelectedColumns } from "@/store/selectColumnSlice";
import { getCustomerStatus } from "@/constants/tableColumns";

interface ActionProps {
    mappedData: any;
    refetch: any;
    isFetching: any;
    customerStatusOptions: any;
}

const AdminGroupTourRequestTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching, customerStatusOptions } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const currentRecord = useRef<any>(null);
    const windowSize = useWindowSize();

    const dispatch = useAppDispatch();
    const selectedColumns = useAppSelector((state) => state.selectColumn.selectedColumns);

    const [deleteApi] = useDeleteMutation();
    const [postApi] = usePostDataMutation();

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: GROUP_TOUR_REQUEST + '/' + currentRecord.current?.id,
            }
            await handleApiRequest(deleteApi(body), refetch, setSpinning);
        }, [deleteApi, refetch]);

    const restore = useCallback(async (id: number) => {
        const body = {
            url: GROUP_TOUR_REQUEST + '/restore',
            data: { id },
        }
        await handleApiRequest(postApi(body), refetch, setSpinning);
    }, [postApi, refetch]);

    const handleOnChangeSelect = useCallback(
        (selectValue: string, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_DELETE:
                    handleConfirm('Xác nhận xóa yêu cầu hỗ trợ này', handleOnDeleteOk);
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
            url: GROUP_TOUR_REQUEST + '/change-status',
            data: { id, customer_status_id },
        }
        await handleApiRequest(postApi(body), refetch, setSpinning);
    }, [postApi, refetch]);

    const getActionColumn = useGetActionColumn();
    const columnsOptions = useMemo(() => [
        {
            title: 'Yêu cầu lúc',
            key: 'created_at',
            render: (value: any) => formatDateTime(value, 'HH:mm DD/MM'),
        },
        getCustomerStatus(customerStatusOptions, changeStatus),
        {
            title: 'Tên cty',
            key: 'company_name',
        },
        {
            title: 'SĐT cty',
            key: 'company_phone',
        },
        {
            title: 'Email cty',
            key: 'company_email',
        },
        {
            title: 'Tên ng đại diện',
            key: 'representative_name',
        },
        {
            title: 'Email ng đại diện',
            key: 'representative_email',
        },
        {
            title: 'SĐT ng đại diện',
            key: 'representative_phone',
        },
        {
            title: 'Điểm đến',
            key: 'destinations',
        },
        {
            title: 'Số người',
            key: 'number_of_person',
        },
        {
            title: 'Chi phí cho 1 ng',
            key: 'amount_per_person',
        },
        {
            title: 'Khách sạn',
            key: 'hotel_rating',
        },
        {
            title: 'Nội dung',
            key: 'note',
        },
        {
            title: 'Ngày bay',
            key: 'flight_date',
        },
        {
            title: 'Ngày về',
            key: 'flight_date_back',
        },
        ...getActionColumn(['', ACTION_DELETE], handleOnChangeSelect, 'GROUP_TOUR_REQUEST', 'right'),

    ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' })
    ), [changeStatus, customerStatusOptions, getActionColumn, handleOnChangeSelect]);

    useEffect(() => {
        dispatch(setColumnsOptions(columnsOptions.map(i => ({ title: i.title, key: i.key }))));
    }, [columnsOptions, dispatch]);

    useEffect(() => {
        const storedColumns = JSON.parse(localStorage.getItem('selectedColumns') || '{}')?.groupTour;
        const selectedColumns = storedColumns || Array.from(new Set([...columnsOptions.map(i => i.key), 'action']));
        dispatch(setSelectedColumns(selectedColumns));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = getColumns(columnsOptions, selectedColumns);

    const dataSource = useMemo(() => formatAllPriceAndDateKeyArray(mappedData, 'id'), [mappedData]);

    return (
        <>
            <AdminLoading isLoading={spinning} />
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={isFetching}
                scroll={{ x: columns.length * 200, y: ((windowSize?.height || 800) - 280) }}
            />
            {confirmModal}
        </>
    )
}

export default AdminGroupTourRequestTable