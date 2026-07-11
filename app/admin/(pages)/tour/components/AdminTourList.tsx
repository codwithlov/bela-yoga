'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDeleteMutation, useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { toQueryString } from '@/utils/apiUtils';
import AdminTourFilter from './list/AdminTourFilter';
import CTPagination from '@/components/admin/molecules/CTPagination';
import dayjs from 'dayjs';
import { formatAllPriceAndDateKey, getColumns, getUpdateDrawerProps, handleApiRequest, handleApiResponse } from '@/utils/helper';
import { Checkbox, Drawer, Table } from 'antd';
import HistoryDrawer from '@/components/admin/organisms/HistoryDrawer';
import { getTourColumnsOptions } from '@/constants/tableColumns';
import { TOUR } from '@/constants/route';
import { ACTION_DELETE, ACTION_HISTORY, ACTION_UPDATE } from '@/constants/action';
import useGetActionColumn from '@/hooks/useGetActionColumn';
import { IListingSummary } from '@/interfaces/listing';
import { Loading } from '@/components/guest/Loading';
import { showSuccessToastr } from '@/utils/toastr';
import { IApiResponse } from '@/interfaces/apiResponse';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { stringPriceToNumber } from '@/utils/formatPrice';
import useCheckPermission from '@/hooks/useCheckPermission';
import useWindowSize from '@/hooks/useWindowSize';
import { SEAT_ADL, SEAT_CHD, SEAT_INF } from '@/constants/listing';
import AdminTourCreateUpdate from './AdminTourCreateUpdate';
import { useSearchParams } from 'next/navigation';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';

interface CheckedLists {
    adl: string[];
    chd: string[];
    inf: string[];
}

const AdminTourList: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const searchParams = useSearchParams();
    const updateId = searchParams?.get('updateId');

    const initParam = { from_date: dayjs().format('YYYY-MM-DD') };
    const [param, setParam] = useState(initParam);
    const [mappedData, setMappedData] = useState<IListingSummary[]>([]);
    const [openEdit, setOpenEdit] = useState<boolean>(!!updateId);
    const [openHistory, setOpenHistory] = useState<boolean>(false);
    const [checkedLists, setCheckedLists] = useState<CheckedLists>({ adl: [], chd: [], inf: [] });
    const [spinning, setSpinning] = useState<boolean>(false);
    const [storeUpdateApi] = usePostDataMutation();
    const { handleConfirm, confirmModal } = useConfirm();
    const checkPermission = useCheckPermission();
    const canUpdate = checkPermission('TOUR_UPDATE');
    const currentRecord = useRef<any>({ tour_id: updateId });
    const windowSize = useWindowSize();

    const { data, isFetching, refetch, isSuccess } =
        useGetDataQuery(`${TOUR}${toQueryString(param)}`, { refetchOnMountOrArgChange: true });
    const [deleteApi] = useDeleteMutation();

    useEffect(() => {
        if (data?.data && isSuccess) {
            const formatData = data.data.map((item: IListingSummary) => {
                let temp = { ...item };
                temp = formatAllPriceAndDateKey(temp, 'tour_id');
                return temp;
            });
            setMappedData(formatData);
        }
    }, [data?.data, isSuccess]);

    const handleOnDeleteOk = useCallback(
        async () => {
            const body = {
                url: TOUR + '/' + currentRecord.current?.tour_id,
            }
            await handleApiRequest(deleteApi(body), refetch, setSpinning);
        },
        [deleteApi, refetch]
    );

    const handleOnChangeSelect = useCallback(
        (selectValue: string, record: IListingSummary) => {
            currentRecord.current = record;
            switch (selectValue) {
                case ACTION_UPDATE:
                    setOpenEdit(true);
                    break;
                case ACTION_HISTORY:
                    setOpenHistory(true);
                    break;
                case ACTION_DELETE:
                    handleConfirm('Xác nhận xóa ' + currentRecord.current?.series_code, handleOnDeleteOk);
                    break;
            }
        }, [handleConfirm, handleOnDeleteOk]);

    const checkPricePushSale = (record: IListingSummary, type: string) => {
        if (record.is_push_sale !== 1) return true;
        return stringPriceToNumber(record[`tic_price_${type}_off`]) >= stringPriceToNumber(record[`push_sale_price_${type}_off`])
    }
    const checkableIds = useMemo(
        () => {
            const types = [SEAT_ADL, SEAT_CHD, SEAT_INF];
            return types.reduce((acc, type) => {
                acc[type] = mappedData
                    .filter((r) => (
                        r[`tic_price_${type}_off`] !== r[`price_${type}_off`]
                        && checkPricePushSale(r, type)
                        && r.type !== 'sgt'
                    ))
                    .map((r) => r.tour_id);
                return acc;
            }, {} as Record<string, string[]>);
        },
        [mappedData]
    );

    const onConvertClicked = async (data?: any) => {
        const postData = {
            url: `${TOUR}/change-to-tic-price`,
            data: data ? data : checkedLists,
        };

        await handleApiResponse(
            storeUpdateApi(postData),
            (payload: IApiResponse) => {
                if (!data) {
                    showSuccessToastr(payload?.message)
                }
                setCheckedLists((prevState) => {
                    return {
                        adl: prevState['adl'].filter(i => !postData.data['adl']?.includes(i)),
                        chd: prevState['chd'].filter(i => !postData.data['chd']?.includes(i)),
                        inf: prevState['inf'].filter(i => !postData.data['inf']?.includes(i)),
                    };
                });
                refetch();
            },
            setSpinning,
        );
    }

    const toggleCheckAll = (type: keyof CheckedLists) => {
        setCheckedLists((prevState) => ({
            ...prevState,
            [type]: prevState[type].length > 0 ? [] : checkableIds[type]
        }));
    };

    const toggleCheck = (type: keyof CheckedLists, recordId: string) => {
        setCheckedLists((prevState) => {
            const isChecked = prevState[type].includes(recordId);
            const updatedList = isChecked
                ? prevState[type].filter((id) => id !== recordId)
                : [...prevState[type], recordId];

            return { ...prevState, [type]: updatedList };
        });
    };

    const getActionColumn = useGetActionColumn();
    const columnsOptions = useMemo(() => [
        {
            title: 'Nguồn',
            key: 'type',
            width: 100,
            render: (value: string) => (<div className='text-base font-normal'>{value.toLocaleUpperCase()}</div>)
        },
        {
            title: 'Mã tour',
            key: 'series_code',
            width: 150,
            render: (value: string) => (<div className='text-xs'>{value}</div>)
        },
        { title: 'Tuyến tour', key: 'tour_name', align: 'center', width: 270 },
        ...getTourColumnsOptions(
            false,
            (['adl', 'chd', 'inf'] as const).map((type) => ({
                key: `price_${type}_off`,
                dataIndex: `price_${type}_off`,
                align: 'center',
                columnName: `Giá ${type.toUpperCase()} bán`,
                title: () => (
                    <>
                        {`Giá ${type.toUpperCase()} bán`}
                        {!!checkableIds[type].length && canUpdate &&
                            <Checkbox className="!ml-2" checked={!!checkedLists[type].length} onChange={() => toggleCheckAll(type)} />
                        }
                    </>
                ),
                render: (value: number, record: IListingSummary) => (
                    <div className="flex items-center justify-center gap-2">
                        <div>
                            <p>{value}</p>
                            {record.type !== 'sgt' &&
                                <p className="text-gray-400 text-2xs leading-none mt-0.5">{record[`tic_price_${type}_off` as keyof IListingSummary]}
                                </p>
                            }
                        </div>
                        {record[`tic_price_${type}_off` as keyof IListingSummary] !== value && record.type !== 'sgt' &&
                            checkPricePushSale(record, type) &&
                            canUpdate && (
                                <div className="flex flex-col items-center">
                                    <Checkbox checked={checkedLists[type].includes(record.tour_id)} onChange={() => toggleCheck(type, record.tour_id)} />
                                    <p className="cursor-pointer hover:text-blue-500 mt-1" onClick={() => onConvertClicked({ [type]: [record.tour_id] })}>Đổi</p>
                                </div>
                            )}
                    </div>
                ),
            }))),
        ...getActionColumn(['', ACTION_UPDATE, ACTION_HISTORY], handleOnChangeSelect, 'TOUR', 'right'),
    ].map((item) => ({ ...item, dataIndex: item.key })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getActionColumn, handleOnChangeSelect]);

    const [selectedColumns, setSelectedColumns] = useState<string[]>(
        [
            'type', 'series_code', 'tour_name',
            'price_adl_off', 'push_sale_price_adl_off',
            'is_push_sale', 'flight_date', 'action'
        ]
    );

    useEffect(() => {
        const storedColumns = JSON.parse(localStorage.getItem('selectedColumns') || '{}')?.tour;
        if (storedColumns) {
            setSelectedColumns(storedColumns);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = getColumns(columnsOptions, selectedColumns);
    return (
        <>
            <Loading isLoading={spinning} />
            <div className='flex justify-between mb-2'>
                <h3>Danh sách tour</h3>
                <ShowCreateDrawer title='Thêm tour (Có thể tự động điền sau khi chọn tuyến tour)' width='90%' code='TOUR_CREATE'>
                    {(closeDrawer) => (
                        <AdminTourCreateUpdate closeModal={closeDrawer} reloadDataList={refetch} />
                    )}
                </ShowCreateDrawer>
            </div>
            <AdminTourFilter
                setParam={setParam}
                setPage={setPage}
                marketsProp={data?.markets}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                columnsOptions={columnsOptions}
                initParam={initParam}
                onConvertClicked={() => handleConfirm('Xác nhận đổi các giá đã chọn!', onConvertClicked, 'Xác nhận')}
            />
            <Table
                columns={columns}
                dataSource={mappedData}
                pagination={false}
                loading={isFetching}
                scroll={{ x: columns.length * 160, y: ((windowSize?.height || 800) - 290) }}
            />
            <CTPagination
                setPage={setPage}
                setParam={setParam}
                pagination={data?.pagination}
                page={page}
            />
            <Drawer
                title={"Chỉnh sửa tour " + (currentRecord.current?.series_code || '')}
                open={openEdit}
                {...getUpdateDrawerProps()}
                onClose={() => setOpenEdit(false)}
                width='90%'
            >
                <AdminTourCreateUpdate
                    reloadDataList={refetch}
                    closeModal={() => setOpenEdit(false)}
                    tour_id={currentRecord.current?.tour_id}
                />
            </Drawer>
            <HistoryDrawer
                title={"Lịch sử chỉnh sửa tour " + currentRecord.current?.series_code}
                openHistory={openHistory}
                setOpenHistory={setOpenHistory}
                id={currentRecord.current?.tour_id}
                type="tour"
            />
            {confirmModal}
        </>
    );
};

export default AdminTourList;
