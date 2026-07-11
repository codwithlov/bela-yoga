'use client';
import { useMemo, useState } from 'react';
import { Table } from 'antd';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { TOUR } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import { addKeyForList, formatAllPriceAndDateKey, formatAllPriceAndDateKeyArray } from '@/utils/helper';
import { formatDate, getPastDate } from '@/utils/formatDate';
import DateFilterSelect from './DateFilterSelect';

const AdminNewTourList = () => {
    const [page, setPage] = useState(1);
    const [param, setParam] = useState<any>({ created_at: getPastDate(1) });

    const { data: postsData, isFetching } = useGetDataQuery(
        `${TOUR}/${toQueryString(param)}&sort_by=tours.created_at`,
        { refetchOnMountOrArgChange: true }
    );

    const dataSource = useMemo(() => formatAllPriceAndDateKeyArray(postsData?.data, 'tour_id'), [postsData]);

    const columns = useMemo(() => [
        {
            title: 'Mã tour',
            key: 'series_code',
            render: (value: any, record: any) => <a href={`/admin/tour?updateId=${record.tour_id}`} target='_blank'>
                <div className="w-full h-full cursor-pointer">
                    {value}
                </div>
            </a>,
        },
        {
            title: 'Tuyến tour',
            key: 'tour_name',
        },
        {
            title: 'Ngày đi',
            key: 'flight_date',
        },
        {
            title: 'Giá ADL bán',
            key: 'price_adl_off',
        },
        {
            title: 'Ngày Clone',
            key: 'created_at',
            width: 120,
            align: 'center',
            render: (value: any) => formatDate(value),
        },
    ].map((item: any) => ({ ...item, dataIndex: item.key })), []);

    return (
        <>
            <div className="flex justify-between mb-2">
                <h4 className='font-semibold'>Danh sách tour mới</h4>
                <DateFilterSelect setParam={setParam} setPage={setPage} />
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={isFetching}
                scroll={{ y: 400 }}
            />

            <CTPagination
                setPage={setPage}
                setParam={setParam}
                pagination={postsData?.pagination}
                page={page}
                placement="center"
                notScroll={true}
            />
        </>
    );
};

export default AdminNewTourList;
