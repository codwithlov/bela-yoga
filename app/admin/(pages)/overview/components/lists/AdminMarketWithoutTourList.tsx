'use client';
import { useMemo, useState } from 'react';
import { Table } from 'antd';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { MARKET } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import { addKeyForList } from '@/utils/helper';

const AdminMarketWithoutTourList = () => {
    const [page, setPage] = useState(1);
    const [param, setParam] = useState<any>({});

    const { data: postsData, isFetching } = useGetDataQuery(
        `${MARKET}/getMarketWithoutTourList${toQueryString(param)}`,
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
    ].map((item: any) => ({ ...item, dataIndex: item.key })), []);

    return (
        <>
            <h4 className='font-semibold mb-4'>Danh sách tuyến tour hết ngày khởi ngày</h4>
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

export default AdminMarketWithoutTourList;
