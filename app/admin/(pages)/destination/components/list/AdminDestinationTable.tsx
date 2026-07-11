'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { useDeleteDestinationMutation } from "@/services/api/destinations";
import { showErrorToastr, showSuccessToastr } from "@/utils/toastr";
import AdminDestinationCreateUpdate from "../AdminDestinationCreateUpdate";
import UploadPictureModal from "@/components/admin/organisms/UploadPictureModal";
import { getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { getActiveColumn, getAnchorColumn, keywordsColumn, slugColumn } from "@/constants/tableColumns";
import { ACTION_DELETE, ACTION_DELETE_DRAFT, ACTION_IMAGE, ACTION_RESTORE, ACTION_UPDATE } from "@/constants/action";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { DESTINATION } from "@/constants/route";
import { usePostDataMutation } from "@/services/api/common";
import { useSearchParams } from "next/navigation";

interface ActionProps {
    mappedData: any;
    refetch: any;
    isFetching: any;
}

const AdminDestinationTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const searchParams = useSearchParams();
    const destinationId = searchParams?.get('id');
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(!!destinationId);
    const [openImageModal, setOpenImageModal] = useState(false);
    const currentRecord = useRef<any>({ id: destinationId });

    const [deleteDestination] = useDeleteDestinationMutation();
    const [postApi] = usePostDataMutation();

    const handleOnDeleteOk = useCallback(
        async () => {
            setSpinning(true);
            try {
                const payload = await deleteDestination({ id: currentRecord.current?.id }).unwrap();
                if (payload?.success) {
                    showSuccessToastr(`Xóa điểm đến ${currentRecord.current?.destination_name} thành công`);
                }
            } catch (error: any) {
                if (error?.status) {
                    showErrorToastr(error?.data.message);
                }
            } finally {
                setSpinning(false);
                refetch();
            }
        },
        [deleteDestination, refetch]
    );

    const restore = useCallback(async (id: number) => {
        const body = {
            url: DESTINATION + '/restore',
            data: { id },
        }
        await handleApiRequest(postApi(body), refetch, setSpinning);
    }, [postApi, refetch]);

    const handleOnChangeSelect = useCallback(
        (selectValue: any, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_UPDATE:
                    setOpenEdit(true);
                    break;
                case ACTION_DELETE:
                case ACTION_DELETE_DRAFT:
                    handleConfirm('Xác nhận xóa ' + record?.destination_name, handleOnDeleteOk);
                    break;
                case ACTION_IMAGE:
                    setOpenImageModal(true);
                    break;
                case ACTION_RESTORE:
                    restore(record.id);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk, restore]
    );
    const getActionColumn = useGetActionColumn();
    const columns = useMemo(() => [
        keywordsColumn,
        {
            title: 'Quốc gia',
            key: 'nation_name',
        },
        {
            title: 'Tên điểm đến',
            key: 'destination_name',
        },
        slugColumn,
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
        getActiveColumn(),
        // {
        //     title: 'Bài viết',
        //     key: 'article',
        //     render: (_: any, record: any) => (
        //         <ShowHtmlContentDrawer
        //             tabContents={getTabContents(record)}
        //             multiple
        //             title={"Bài viết " + record.destination_name || ''}
        //         />
        //     ),
        //     width: 100,
        // },
        ...getActionColumn(['', ACTION_UPDATE, ACTION_IMAGE, ACTION_DELETE], handleOnChangeSelect, 'DESTINATION'),
    ].map((item: any) => ({ ...item, dataIndex: item.key })
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
                title="Chỉnh sửa điểm đến"
                open={openEdit}
                {...getUpdateDrawerProps()}
                onClose={() => handleConfirm('Xác nhận đóng', () => setOpenEdit(false), 'Đóng')}
            >
                <AdminDestinationCreateUpdate
                    reloadDataList={refetch}
                    open={openEdit}
                    closeModal={() => setOpenEdit(false)}
                    destination_id={currentRecord.current?.id}
                />
                {confirmModal}
            </Drawer >
            <UploadPictureModal
                openImageModal={openImageModal}
                setOpenImageModal={setOpenImageModal}
                type="destination"
                id={currentRecord.current?.id}
                refetchList={refetch}
            />
            {confirmModal}
        </>
    )
}

export default AdminDestinationTable