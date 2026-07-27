'use client'
import { FROM_LIST } from "@/constants/ui";
import { Select, Table } from "antd";
import { useState } from "react";

interface Props {
    dataSource: any;
    columns: any;
}

const ListingTable = (props: Props) => {
    const { dataSource, columns } = props;
    const [filteredData, setFilteredData] = useState(dataSource);
    const [selectedPoint, setSelectedPoint] = useState(null);

    const handleFilterChange = (value: any) => {
        setSelectedPoint(value);
        if (value) {
            setFilteredData(dataSource.filter((item: any) => item.departure_point === value));
        } else {
            setFilteredData(dataSource);
        }
    };

    return (
        <div className={`${dataSource.length > 10 ? 'mb-6' : 'mb-12'} text-bela-secondary-1 ant-table input-focus`}>
            <h2 className="text-sm lg:text-xl font-semibold text-center mb-3">
                Lịch khởi hành
                <a href={'/' + dataSource?.[0]?.market_slug} target="_blank" className="hover:text-bela-secondary-2">
                    {` ${dataSource?.[0]?.tour_name || ''} - ${dataSource?.[0]?.day_number || ''}N${dataSource?.[0]?.night_number || ''}D`}
                </a>
            </h2>
            <Select
                placeholder="Điểm khởi hành"
                allowClear
                onChange={handleFilterChange}
                value={selectedPoint}
                style={{ width: 160 }}
                options={FROM_LIST}
                className="!mb-2"
            />
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={dataSource.length > 10 ? { showSizeChanger: false } : false}
                locale={{ emptyText: 'Không có tour' }}
                onRow={(record) => {
                    return {
                        onClick: () => { window.open('/' + record.market_slug + '?series_code=' + record.series_code, '_blank'); },
                    };
                }}
            />
        </div>
    );
};

export default ListingTable