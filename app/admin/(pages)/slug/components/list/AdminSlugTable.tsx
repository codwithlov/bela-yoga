'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { Drawer, Table } from "antd";
import { getUpdateDrawerProps } from "@/utils/helper";
import AdminSlugUpdate from "../AdminSlugUpdate";
import useGetActionColumn from "@/hooks/useGetActionColumn";
import { ACTION_UPDATE } from "@/constants/action";
import { SlugPermalink } from "@/interfaces/slugPermalink";

interface ActionProps {
    mappedData: SlugPermalink[];
    refetch: any;
    isFetching: any;
}

const AdminSlugTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const [openEdit, setOpenEdit] = useState(false);
    const getActionColumn = useGetActionColumn();

    const currentRecord = useRef({} as SlugPermalink);

    const handleOnChangeSelect = useCallback(
        (selectValue: any, record: any) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_UPDATE:
                    setOpenEdit(true);
                    break;
            }
        },
        []
    );

    const columns = useMemo(() => [
        {
            title: 'Slug',
            key: 'slug',
        },
        {
            title: 'Loại slug',
            key: 'entity_type',
            width: 120,
        },
        {
            title: 'Tên',
            key: 'entity_name',
        },
        ...getActionColumn(['', ACTION_UPDATE], handleOnChangeSelect, 'SLUG'),
    ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' })
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
                title={"Chỉnh sửa slug " + currentRecord.current?.entity_name}
                open={openEdit}
                {...getUpdateDrawerProps('600px')}
                onClose={() => setOpenEdit(false)}
            >
                <AdminSlugUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    slug_id={currentRecord.current?.id}
                />
            </Drawer>
        </>
    )
}

export default AdminSlugTable