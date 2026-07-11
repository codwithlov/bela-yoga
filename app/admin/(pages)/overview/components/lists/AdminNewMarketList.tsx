'use client';
import { useMemo, useState } from 'react';
import { Table } from 'antd';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { MARKET } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import { addKeyForList } from '@/utils/helper';
import { formatDate, getPastDate } from '@/utils/formatDate';
import DateFilterSelect from './DateFilterSelect';

const AdminNewMarketList = () => {
    const [page, setPage] = useState(1);
    const [param, setParam] = useState<any>({ created_at: getPastDate(1) });

    const { data: postsData, isFetching } = useGetDataQuery(
        `${MARKET}/getNewMarketList${toQueryString(param)}`,
        { refetchOnMountOrArgChange: true }
    );

    const dataSource = useMemo(() => addKeyForList(postsData?.data, 'id'), [postsData]);

    const columns = useMemo(() => [
        {
            title: 'Tên tuyến tour',
            key: 'tour_name',
            render: (value: any, record: any) => <a href={`/admin/market?updateId=${record.market_id}`} target='_blank'>
                <div className="w-full h-full cursor-pointer">
                    {value}
                </div>
            </a>,
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
                <h4 className='font-semibold'>Danh sách tuyến tour mới</h4>
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
            />
        </>
    );
};

export default AdminNewMarketList;
