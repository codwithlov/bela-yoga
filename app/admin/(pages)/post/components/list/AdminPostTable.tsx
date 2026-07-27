'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Drawer, Table } from "antd";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import AdminPostCreateUpdate from "../AdminPostCreateUpdate";
import { addKeyForList, getColumns, getUpdateDrawerProps, handleApiRequest, handleSortTable } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation, usePostDataMutation } from "@/services/api/common";
import { POST } from "@/constants/route";
import { ACTION_DELETE, ACTION_DELETE_DRAFT, ACTION_RESTORE, ACTION_UPDATE } from "@/constants/action";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { getActiveColumn, getAnchorColumn, keywordsColumn, slugColumn } from "@/constants/tableColumns";
import { formatDate, formatDateTime, isBeforeNow } from "@/utils/formatDate";
import { useSearchParams } from "next/navigation";
import { IPost } from "@/interfaces/article";
import useWindowSize from "@/hooks/useWindowSize";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setColumnsOptions, setSelectedColumns } from "@/store/selectColumnSlice";

interface ActionProps {
    mappedData: any;
    refetch: any;
    isFetching: any;
    setSortBy: any
}

const AdminPostTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching, setSortBy } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const searchParams = useSearchParams();
    const postId = searchParams?.get('id');
    const windowSize = useWindowSize();
    const dispatch = useAppDispatch();
    const selectedColumns = useAppSelector((state) => state.selectColumn.selectedColumns);

    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(!!postId);
    const currentRecord = useRef<any>({ id: postId });

    const [deleteApi] = useDeleteMutation();
    const [postApi] = usePostDataMutation();

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: POST + '/' + currentRecord.current?.id,
            }
            await handleApiRequest(deleteApi(body), refetch, setSpinning);
        },
        [deleteApi, refetch]
    );

    const restore = useCallback(async (id: number) => {
        const body = {
            url: POST + '/restore',
            data: { id },
        }
        await handleApiRequest(postApi(body), refetch, setSpinning);
    }, [postApi, refetch]);

    const handleOnChangeSelect = useCallback(
        (selectValue: string, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_UPDATE:
                    setOpenEdit(true);
                    break;
                case ACTION_DELETE:
                case ACTION_DELETE_DRAFT:
                    handleConfirm('Xác nhận xóa bài đăng ' + record?.meta_title, handleOnDeleteOk);
                    break;
                case ACTION_RESTORE:
                    restore(record.id);
                    break;
            }
        },
        [handleConfirm, handleOnDeleteOk, restore]
    );

    const getPostStatus = (post: any) => {
        if (post.status === 'draft') return 'Bản nháp';
        if (post.deleted === 1) return <span className="rounded border border-bela-third-2 px-2 py-0.5">Đã xóa</span>;
        if (isBeforeNow(post?.publish_date)) return 'Lên lịch';
        return 'Xuất bản';
    }

    const getActionColumn = useGetActionColumn();
    const columnsOptions = useMemo(() => [
        keywordsColumn,
        {
            title: 'Tiêu đề',
            key: 'meta_title',
            width: 250,
        },
        {
            title: 'Loại bài đăng',
            key: 'type',
            render: (_: any, record: IPost) => record.post_type?.title,
            width: 110,
        },
        slugColumn,
        {
            title: 'Link đi',
            key: 'outgoing_link_count',
            width: 100,
            align: 'center',
            sorter: true,
        },
        {
            title: 'Link đến',
            key: 'incoming_link_count',
            width: 100,
            align: 'center',
            sorter: true,
        },
        getAnchorColumn(),
        {
            title: 'Ngày đăng',
            key: 'publish_date',
            render: (value: any) => formatDate(value),
            width: 120,
            align: 'center',
            sorter: true,
        },
        {
            title: 'Trạng thái',
            key: 'post_status',
            render: (_: any, record: any) => getPostStatus(record),
            align: 'center',
            minWidth: 100,
        },
        {
            title: 'Tác giả',
            key: 'author_name',
            minWidth: 100,
        },
        {
            title: 'Chỉnh sửa',
            key: 'update_user_name',
            minWidth: 100,
        },
        {
            title: 'Chỉnh sửa lúc',
            align: 'center',
            key: 'updated_at',
            render: (value: any, record: any) => formatDateTime(record.updated_at, 'HH:mm - DD/MM/YYYY'),
            minWidth: 120,
        },
        // {
        //     title: 'Bài viết',
        //     key: 'description',
        //     render: (description: any, record: any) => (
        //         <ShowHtmlContentDrawer
        //             htmlContent={description}
        //             title={record.meta_title}
        //         />
        //     ),
        //     width: 100,
        //     align: 'center',
        // },
        getActiveColumn(),
        ...getActionColumn(['', ACTION_UPDATE, ACTION_DELETE], handleOnChangeSelect, 'POST', 'right'),

    ].map((item: any) => ({ ...item, dataIndex: item.key })
    ), [getActionColumn, handleOnChangeSelect]);

    useEffect(() => {
        dispatch(setColumnsOptions(columnsOptions.map(i => ({ title: i.title, key: i.key }))));
    }, [columnsOptions, dispatch]);

    useEffect(() => {
        const storedColumns = JSON.parse(localStorage.getItem('selectedColumns') || '{}')?.post;
        const selectedColumns = storedColumns || Array.from(new Set([...columnsOptions.map(i => i.key), 'action']));
        dispatch(setSelectedColumns(selectedColumns));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = getColumns(columnsOptions, selectedColumns);

    const dataSource = useMemo(() => addKeyForList(mappedData, 'id'), [mappedData]);

    return (
        <>
            <AdminLoading isLoading={spinning} />
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={isFetching}
                scroll={{ x: columns.length * 130, y: ((windowSize?.height || 800) - 280) }}
                onChange={(pagination: any, filters: any, sorter: any) => { handleSortTable(sorter, setSortBy) }}
            />
            <Drawer
                title="Chỉnh sửa bài đăng"
                open={openEdit}
                {...getUpdateDrawerProps('90%')}
                onClose={() => handleConfirm('Xác nhận đóng', () => setOpenEdit(false), 'Đóng')}
            >
                <AdminPostCreateUpdate
                    reloadDataList={refetch}
                    open={openEdit}
                    post_id={currentRecord.current?.id}
                />
                {confirmModal}
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminPostTable