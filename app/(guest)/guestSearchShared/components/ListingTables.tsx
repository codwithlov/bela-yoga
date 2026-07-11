'use client'
import { useCallback, useMemo } from "react";
import { Table } from "antd";
import { addKeyForList, formatAllPriceAndDateKeyArray, isEmpty } from "@/utils/helper";
import { SEAT_ADL, SEAT_CHD, SEAT_INF } from "@/constants/listing";
import useWindowSize from "@/hooks/useWindowSize";
import ListingTable from "./ListingTable";
import dayjs from 'dayjs';
import Image from "next/image";

interface Props {
    tourTableData: any;
}

const ListingTables = (props: Props) => {
    const { tourTableData } = props;
    const windowSize = useWindowSize();

    const getPrice = useCallback((tour: any, type: string) => {
        return tour?.is_push_sale === 1
            ? tour?.[`push_sale_price_${type}_off`]
            : tour?.[`price_${type}_off`];
    }, []);

    const columns = useMemo(() => {
        const isMobile = (windowSize?.width || 1000) < 640;
        return [
            {
                title: 'Khởi hành',
                key: 'flight_date',
                align: 'center',
                render: (_: any, record: any) => {
                    const flightDate = dayjs(record.flight_date, 'DD/MM/YYYY', true);
                    const dayOfWeek = flightDate.day();
                    const dayName = dayOfWeek === 0 ? 'CN' : 'T' + (dayOfWeek + 1)
                    const className = dayOfWeek === 6 ? 'text-blue-500' : dayOfWeek === 0 ? 'text-red-500' : ''
                    if (isMobile) {
                        return <>
                            <p className={className}>{dayName}</p>
                            <p className={className}>{record.flight_date}</p>
                        </>
                    }
                    return <p className={className}>
                        {`${dayName} ${record.flight_date}`}
                    </p>;
                }
            },
            {
                title: 'Chuyến bay',
                key: 'flight',
                render: (_: any, record: any) => {
                    if (isMobile) {
                        return (
                            <div className="flex flex-col items-center gap-1">
                                <Image
                                    key={record.carrier_logo}
                                    src={`${record.carrier_logo ?? '/assets/icons/plane.svg'}`}
                                    alt={record.carrier_name}
                                    width={0}
                                    height={0}
                                    // priority={true}
                                    loading="lazy"
                                    sizes='100vw'
                                    className='w-auto max-w-20 h-[15px] object-contain'
                                />
                                {`${record.from || ''} - ${record.to || ''} | ${record.takeoff_time || ''} - ${record.arrive_time || ''}`}
                            </div>
                        );
                    }
                    return (
                        <div className="flex items-center gap-2 pl-2">
                            <Image
                                key={record.carrier_logo}
                                src={`${record.carrier_logo ?? '/assets/icons/plane.svg'}`}
                                alt={record.carrier_name}
                                width={0}
                                height={0}
                                priority={true}
                                sizes='100vw'
                                className='w-auto max-w-20 h-[20px] object-contain'
                            />
                            {`${record.shcb || ''} ${record.from || ''} - ${record.to || ''} | ${record.takeoff_time || ''} - ${record.arrive_time || ''}`}
                        </div>
                    );
                },
                align: isMobile ? 'center' : undefined,
            },
            {
                title: 'Người lớn',
                key: 'adl',
                render: (_: any, record: any) => getPrice(record, SEAT_ADL),
                align: 'end',
            },
            ...(isMobile
                ? []
                : [
                    {
                        title: 'Trẻ em',
                        key: 'adl',
                        render: (_: any, record: any) => getPrice(record, SEAT_CHD),
                        align: 'end',
                    },
                    {
                        title: 'Trẻ nhỏ',
                        key: 'adl',
                        render: (_: any, record: any) => getPrice(record, SEAT_INF),
                        align: 'end',
                    },
                ]),
        ].map((item: any) => ({ ...item, dataIndex: item.key }));
    }, [getPrice, windowSize.width]);

    return (
        <div className="mt-4 max-xl:px-4">
            {Object.entries(tourTableData).map(([key, data]) => {
                if (isEmpty(data)) return <></>
                const dataSource = formatAllPriceAndDateKeyArray(addKeyForList(data));
                return (
                    <ListingTable key={key} dataSource={dataSource} columns={columns} />
                );
            })}
        </div>
    );
};

export default ListingTables