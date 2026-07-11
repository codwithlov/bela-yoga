'use client'
import { IS_ACTIVE, NOT_ACTIVE } from '@/constants/ui';
import { useDeleteTopicMutation, useGetAdminTopicsQuery } from '@/services/api/topics';
import { Drawer, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import AdminTopicCreateUpdate from './AdminTopicCreateUpdate';
import { ACTION_DELETE, ACTION_DELETE_DRAFT, ACTION_MARKET, ACTION_RESTORE, ACTION_UPDATE } from '@/constants/action';
import { IAdminTopicSummary } from '@/interfaces/topic';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import AdminTopicMarket from './AdminTopicMarket';
import { toQueryString } from '@/utils/apiUtils';
import AdminTopicFilter from './list/AdminTopicFilter';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { getActiveColumn, getAnchorColumn, keywordsColumn, slugColumn } from '@/constants/tableColumns';
import useGetActionColumn from '@/hooks/useGetActionColumn';
import useWindowSize from '@/hooks/useWindowSize';
import { getSlug, getUpdateDrawerProps, handleApiRequest } from '@/utils/helper';
import { TOPIC } from '@/constants/route';
import { usePostDataMutation } from '@/services/api/common';
import { useSearchParams } from 'next/navigation';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import AdminDeleteDraft from '@/components/admin/organisms/AdminDeleteDraft';

const AdminTopicList = () => {
    const searchParams = useSearchParams();
    const searchId = searchParams?.get('id');
    const { handleConfirm, confirmModal } = useConfirm();
    const [deleteTopic] = useDeleteTopicMutation();
    const [postApi] = usePostDataMutation();

    const [page, setPage] = useState(1);
    const initParam = { method: 'paginate', is_admin_topic: true, limit: 10, sort_by: 'topic_id:desc' };
    const [param, setParam] = useState(initParam);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [subTitle, setSubTitle] = useState<any>('');

    const { data, isFetching, refetch } = useGetAdminTopicsQuery(toQueryString(param),
        { refetchOnMountOrArgChange: true, }
    );
    // Modal Define hook
    const [openCreateUpdateComponent, setOpenCreateUpdateComponent] = useState(!!searchId);
    const [topicSelected, setTopicSelected] = useState<any>({ topic_id: searchId });
    const [mappedData, setMappedData] = useState<any>([]);
    const [openMarketModal, setOpenMarketModal] = useState<boolean>(false);

    const windowSize = useWindowSize();

    useEffect(() => {
        if (data?.data != null) {
            const mappedData = data?.data.map((item: any) => ({
                key: item.topic_id,
                name: item.name,
                slug: getSlug(item),
                is_active: item.is_active == 1 ? IS_ACTIVE : NOT_ACTIVE,
                ...item
            }));
            setMappedData(mappedData);
        }
    }, [data]);

    const restore = useCallback(async (id: number) => {
        const body = {
            url: TOPIC + '/restore',
            data: { id },
        }
        await handleApiRequest(postApi(body), refetch, setSpinning);
    }, [postApi, refetch]);

    const handleOnChangeSelect = useCallback((selectValue: any, data: any) => {
        setTopicSelected(data);
        switch (selectValue) {
            case ACTION_UPDATE:
                setOpenCreateUpdateComponent(true);
                break;
            case ACTION_DELETE:
            case ACTION_DELETE_DRAFT:
                handleConfirm(
                    'Xác nhận xóa chủ đề ' + data.name,
                    () => handleOnDeleteOk(data)
                );
                break;
            case ACTION_MARKET:
                setOpenMarketModal(true);
                break;
            case ACTION_RESTORE:
                restore(data.topic_id);
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getActionColumn = useGetActionColumn();
    const columns: TableColumnsType<IAdminTopicSummary> = useMemo(() => [
        keywordsColumn,
        {
            title: 'Chủ đề',
            dataIndex: 'name',
            key: 'name',
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
        getAnchorColumn() as any,
        getActiveColumn(),
        ...getActionColumn(['', ACTION_UPDATE, ACTION_MARKET, ACTION_DELETE], handleOnChangeSelect, 'TOPIC'),
    ], [getActionColumn, handleOnChangeSelect]);

    const handleOnDeleteOk = async (record: any) => {
        setSpinning(true);
        await deleteTopic({ ...record })
            .unwrap()
            .then((payload: any) => {
                if (payload?.success) {
                    setSpinning(false);
                    showSuccessToastr('Xóa chủ đề thành công');
                }
            })
            .catch((error: any) => {
                if (error?.status) {
                    setSpinning(false);
                    showErrorToastr(error?.data.message);
                }
            })
            .finally(() => {
            })

        refetch();
    }

    const closeEditModal = () => {
        handleConfirm(
            'Xác nhận đóng',
            () => setOpenCreateUpdateComponent(false),
            'Đóng'
        );
    }

    return (
        <>
            <section>
                <AdminLoading isLoading={spinning}></AdminLoading>
                <div className='flex justify-between mb-1'>
                    <h3>{`Danh sách chủ đề ${subTitle}`}</h3>
                    <div className='flex gap-2'>
                        <AdminDeleteDraft draftList={data?.draftList || []} reloadDataList={refetch} type='TOPIC' />
                        <ShowCreateDrawer title='Thêm mới chủ đề (Bản nháp sẽ được lưu khi slug được nhập)' code='TOPIC_CREATE' width='1000px' destroyOnHidden>
                            {(closeModal, open) => (
                                <AdminTopicCreateUpdate
                                    reloadDataList={refetch}
                                    closeModal={closeModal}
                                    open={open}
                                />
                            )}
                        </ShowCreateDrawer>
                    </div>
                </div>
                <AdminTopicFilter
                    setParam={setParam}
                    setPage={setPage} initParam={initParam}
                    setSubTitle={setSubTitle}
                    draftCount={data?.draftCount}
                />

                <Table
                    loading={isFetching}
                    columns={columns}
                    dataSource={mappedData}
                    pagination={false}
                    scroll={{ y: ((windowSize?.height || 800) - 280) }}
                />

                <CTPagination
                    setPage={setPage}
                    setParam={setParam}
                    pagination={data?.pagination}
                    page={page}
                />
            </section>
            <AdminTopicMarket
                isOpen={openMarketModal}
                setClose={() => setOpenMarketModal(false)}
                data={topicSelected}
            />
            <Drawer
                title="Cập nhật chủ đề"
                open={openCreateUpdateComponent}
                {...getUpdateDrawerProps(1000)}
                onClose={closeEditModal}
            >
                <AdminTopicCreateUpdate
                    topicId={topicSelected?.topic_id}
                    closeModal={() => setOpenCreateUpdateComponent(false)}
                    reloadDataList={refetch}
                    open={openCreateUpdateComponent}
                />
                {confirmModal}
            </Drawer>
            {confirmModal}
        </>
    );
};

export default AdminTopicList;
