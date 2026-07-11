'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation } from "@/services/api/common";
import { TAG } from "@/constants/route";
import AdminTagCreateUpdate from "../AdminTagCreateUpdate";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { ACTION_DELETE, ACTION_SLUG, ACTION_UPDATE } from "@/constants/action";
import { Tag } from "@/interfaces/tag";
import useWindowSize from "@/hooks/useWindowSize";
import { getActiveColumn, slugColumn } from "@/constants/tableColumns";
import { SlugPermalink } from "@/interfaces/slugPermalink";
import LinkList from "@/components/admin/organisms/LinkList";
import AdminTagSlugMannager from "../AdminTagSlugMannager";

interface ActionProps {
    mappedData: Tag[];
    refetch: any;
    isFetching: any;
}

const AdminTagTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openEditSlug, setOpenEditSlug] = useState(false);
    const getActionColumn = useGetActionColumn();
    const windowSize = useWindowSize();
    const currentRecord = useRef<any>(null);

    const [deleteApi] = useDeleteMutation();

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: TAG + '/' + currentRecord.current?.key,
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
                case ACTION_SLUG:
                    setOpenEditSlug(true);
                    break;
                case ACTION_DELETE:
                    handleConfirm('Xác nhận xóa tag ' + record.name, handleOnDeleteOk);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk]
    );

    const columns = useMemo(() => [
        {
            title: 'Tên',
            key: 'name',
        },
        {
            title: 'Loại tag',
            key: 'tag_type',
            render: (_: any, record: any) => record.tag_types?.title,
        },
        slugColumn,
        {
            title: 'Link',
            key: 'link',
            width: 100,
            render: (_: any, record: any) => {
                const anchorList = (record.slug_permalinks || []).filter((i: SlugPermalink) => i.meta_title).map((i: SlugPermalink) => ({
                    text: i.meta_title,
                    href: process.env.NEXT_PUBLIC_WEB_URL + i.slug,
                }));
                return <LinkList anchorList={anchorList} title='Danh sách' />
            },
            align: 'center',
        },
        getActiveColumn(),
        ...getActionColumn(['', ACTION_UPDATE, ACTION_DELETE, ACTION_SLUG], handleOnChangeSelect, 'TAG'),
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
                title="Chỉnh sửa tag"
                open={openEdit}
                {...getUpdateDrawerProps('1000px')}
                onClose={() => setOpenEdit(false)}
            >
                <AdminTagCreateUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    tag_id={currentRecord.current?.key}
                />
            </Drawer>
            <Drawer
                title="Quản lý tag/bài viết"
                open={openEditSlug}
                {...getUpdateDrawerProps('800px')}
                onClose={() => setOpenEditSlug(false)}
            >
                <AdminTagSlugMannager
                    reloadDataList={refetch}
                    closeModal={() => setOpenEditSlug(false)}
                    tag_id={currentRecord.current?.key}
                />
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminTagTable