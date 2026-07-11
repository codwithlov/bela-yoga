'use client';

import { Drawer, Table } from 'antd';
import ColumnSelect from '@/components/admin/molecules/ColumnSelect';
import React, { useEffect, useState } from 'react';
import { useGetDataQuery } from '@/services/api/common';
import { formatAllPriceAndDateKey, getColumns, getUpdateDrawerProps } from '@/utils/helper';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { showErrorToastr } from '@/utils/toastr';
import { marketColumnsOptions, getTourColumnsOptions } from '@/constants/tableColumns';
import { HISTORY } from '@/constants/route';

// Define types for props
interface HistoryDrawerProps {
    id: string;
    type: 'tour' | 'market';
    title: string;
    openHistory: boolean;
    setOpenHistory: (open: boolean) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ id, type, title, openHistory, setOpenHistory }) => {
    return (
        <Drawer
            title={title}
            open={openHistory}
            {...getUpdateDrawerProps('90%')}
            onClose={() => setOpenHistory(false)}
        >
            <HistoryTable id={id} type={type} />
        </Drawer>
    );
};

// Define types for props and state
interface HistoryItem {
    history_id: string;
    [key: string]: any;
}

interface HistoryTableProps {
    id: string;
    type: 'tour' | 'market';
}

const HistoryTable: React.FC<HistoryTableProps> = ({ id, type }) => {
    const options = [
        ...(type === 'tour' ? getTourColumnsOptions(true) : type === 'market' ? marketColumnsOptions : []),
        { key: 'user_name', title: 'Người chỉnh sửa' },
        { key: 'history_updated_at', title: 'Thời điểm chỉnh sửa', fixed: 'right' }
    ].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' }));

    const [mappedData, setMappedData] = useState<HistoryItem[]>([]);
    const { data, isFetching } = useGetDataQuery(`${HISTORY}/${type}/${id}`, {
        refetchOnMountOrArgChange: true,
        skip: !id,
    });

    useEffect(() => {
        if (data) {
            if (data.error) {
                showErrorToastr(data.message);
            } else {
                const formattedData = data.map((item: HistoryItem) => {
                    let temp = { ...item };
                    temp = formatAllPriceAndDateKey(temp, 'history_id');

                    if (type === 'market') {
                        temp.day_night_number = `${temp.day_number}N${temp.night_number}D`;
                    }

                    temp.history_updated_at = formatDateTime(item.updated_at);
                    return temp;
                });
                setMappedData(formattedData.reverse());
            }
        }
    }, [data, type]);

    const defaultHistoryColumn: Record<'tour' | 'market', string[]> = {
        tour: [
            'is_active', 'is_push_sale', 'price_adl_off', 'price_chd_off', 'price_inf_off',
            'push_sale_price_adl_off', 'push_sale_price_chd_off', 'push_sale_price_inf_off',
            'user_name', 'history_updated_at',
        ],
        market: ['destinations', 'market_slug', 'min_price_adl_off', 'is_active', 'history_updated_at', 'nation', 'user_name', 'slug'],
    };

    const [selectedColumns, setSelectedColumns] = useState<string[]>(
        defaultHistoryColumn[type]
    );

    const columns = getColumns(options, selectedColumns);

    return (
        <div className='pb-5'>
            <ColumnSelect
                options={options}
                value={selectedColumns}
                onChange={setSelectedColumns}
            />
            {columns.length > 0 && (
                <Table
                    columns={columns}
                    dataSource={mappedData}
                    loading={isFetching}
                    className='mt-3'
                    pagination={
                        mappedData.length > 10 ? {
                            pageSize: 13,
                            position: ['bottomCenter'],
                        } : false
                    }
                    scroll={{ x: columns.length * 170, y: 650 }}
                />
            )}
        </div>
    );
};

export default HistoryDrawer;