'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { addKeyForList, getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation } from "@/services/api/common";
import { VOUCHER } from "@/constants/route";
import AdminVoucherCreateUpdate from "../AdminVoucherCreateUpdate";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { ACTION_DELETE, ACTION_SLUG, ACTION_UPDATE } from "@/constants/action";
import useWindowSize from "@/hooks/useWindowSize";
import { getActiveColumn } from "@/constants/tableColumns";
import { IVoucher } from "@/interfaces/voucher";
import Image from "next/image";
import { DEFAULT_VOUCHER } from "@/constants/ui";

interface ActionProps {
    mappedData: IVoucher[];
    refetch: any;
    isFetching: any;
}

const AdminVoucherTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const getActionColumn = useGetActionColumn();
    const windowSize = useWindowSize();
    const currentRecord = useRef<any>(null);

    const [deleteApi] = useDeleteMutation();

    const dataSource = useMemo(() => addKeyForList(mappedData), [mappedData]);

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
                    handleConfirm('Xác nhận xóa voucher ' + record.name, handleOnDeleteOk);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk]
    );

    const columns = useMemo(() => [
        {
            title: 'Hình ảnh',
            key: 'image_url',
            render: (value: any) => (
                <Image
                    src={value || DEFAULT_VOUCHER}
                    alt="voucher"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '150px', height: 'auto' }}
                    className='mb-1 justify-self-center'
                    priority
                />)
        },
        {
            title: 'Mã',
            key: 'code',
        },
        {
            title: 'Tên',
            key: 'name',
        },
        getActiveColumn(),
        ...getActionColumn(['', ACTION_UPDATE, ACTION_DELETE], handleOnChangeSelect, 'VOUCHER'),
    ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' })
    ), [getActionColumn, handleOnChangeSelect]);

    return (
        <>
            <AdminLoading isLoading={spinning} />
            <Table
                columns={columns}
                dataSource={dataSource}
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
                <AdminVoucherCreateUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    voucher_id={currentRecord.current?.id}
                />
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminVoucherTable