'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table } from "antd";
import AdminNationUpdate from "../AdminNationUpdate";
import UploadPictureModal from "@/components/admin/organisms/UploadPictureModal";
import { getUpdateDrawerProps } from "@/utils/helper";
import { getActiveColumn, getAnchorColumn, keywordsColumn, slugColumn } from "@/constants/tableColumns";
import { ACTION_IMAGE, ACTION_UPDATE } from "@/constants/action";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { useSearchParams } from "next/navigation";
import { useConfirm } from "@/components/admin/atoms/useConfirm";

interface ActionProps {
    mappedData: any;
    refetch: any;
    isFetching: any;
}

const AdminNationTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const searchParams = useSearchParams();
    const nationId = searchParams?.get('id');

    const [openImageModal, setOpenImageModal] = useState(false);
    const [openEdit, setOpenEdit] = useState(!!nationId);
    const currentRecord = useRef<any>({ nation_id: nationId });
    const { handleConfirm, confirmModal } = useConfirm();

    const handleOnChangeSelect = useCallback(
        (selectValue: any, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_UPDATE:
                    setOpenEdit(true);
                    break;
                case ACTION_IMAGE:
                    setOpenImageModal(true);
                    break;
            }
        },
        []
    );
    const getActionColumn = useGetActionColumn();
    const columns = useMemo(() => [
        keywordsColumn,
        { title: 'Mã', key: 'nation_code', },
        { title: 'Quốc gia', key: 'nation_name', },
        slugColumn,
        { title: 'Tổng tour', key: 'total_tour', width: 110, },
        {
            title: 'Link đi',
            key: 'outgoing_link_count',
            dataIndex: 'outgoing_link_count',
            width: 100,
            align: 'center',
        },
        {
            title: 'Link đến',
            key: 'incoming_link_count',
            dataIndex: 'incoming_link_count',
            width: 100,
            align: 'center',
        },
        getAnchorColumn(),
        getActiveColumn(),
        // {
        //     title: 'Bài viết',
        //     key: 'article',
        //     render: (_: any, record: any) => (
        //         <ShowHtmlContentDrawer
        //             tabContents={getTabContents(record)}
        //             multiple
        //             title={"Bài viết " + record.nation_name || ''}
        //         />
        //     ),
        // },
        ...getActionColumn(['', ACTION_UPDATE, ACTION_IMAGE], handleOnChangeSelect, 'NATION'),
    ].map((item: any) => ({ ...item, dataIndex: item.key })
    ), [getActionColumn, handleOnChangeSelect]);

    return (
        <>
            <Table
                columns={columns}
                dataSource={mappedData}
                pagination={false}
                loading={isFetching}
            />
            <Drawer
                title={"Chỉnh sửa " + (currentRecord.current?.nation_name || 'quốc gia')}
                open={openEdit}
                {...getUpdateDrawerProps()}
                onClose={() => handleConfirm('Xác nhận đóng', () => setOpenEdit(false), 'Đóng')}
            >
                <AdminNationUpdate
                    reloadDataList={refetch}
                    nation_id={currentRecord.current?.nation_id}
                />
                {confirmModal}
            </Drawer>
            <UploadPictureModal
                openImageModal={openImageModal}
                setOpenImageModal={setOpenImageModal}
                type="nation"
                id={currentRecord.current?.nation_id}
                refetchList={refetch}
            />
        </>
    )
}

export default AdminNationTable