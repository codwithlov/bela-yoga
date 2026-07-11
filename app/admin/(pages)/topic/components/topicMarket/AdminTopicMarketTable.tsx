'use client'
import { ACTION_DELETE, ACTION_UPDATE } from '@/constants/action';
import { IS_PUSH_SALE, NOT_PUSH_SALE, } from '@/constants/ui';
import { Table, TableColumnsType } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatPrice } from '@/utils/formatPrice';
import { formatAllPriceAndDateKey } from '@/utils/helper';
import { MinusCircleTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import useGetActionColumn from '@/hooks/useGetActionColumn';
interface MarketDataType {
    key: React.Key;
    market_name: string;
    day_number: number;
    night_number: number;
    nation_id: number;
    market_id: number;
    tour_name: string;
    total_tour: number;
    is_assigned: boolean;
    tours: any;
    tour_ids: any;
}

const AdminTopicMarketTable = (props: any) => {
    const { loading, handleOnChangeSelect, marketData, handleOnSubmit, topic_id } = props;
    const { handleConfirm, confirmModal } = useConfirm();

    const onDeleteTour = (record: any) => {
        const market = marketData[record.marketIndex];
        const tour_ids = market.tour_ids.filter((id: any) => id !== record.tour_id);
        const data = [
            {
                topic_id,
                market_id: market.market_id,
                tour_ids,
            }
        ];
        handleOnSubmit({}, data);
    }

    const getActionColumn = useGetActionColumn();
    const marketColumns: TableColumnsType<MarketDataType> = [
        {
            title: 'Thị trường',
            dataIndex: 'market_name',
            key: 'market_name'
        },
        {
            title: 'Tên tuyến tour',
            dataIndex: 'tour_name',
            key: 'tour_name'
        },
        {
            title: 'Thời lượng',
            dataIndex: 'day_number/night_number',
            key: 'day_number/night_number',
            render: (text, record) => `${record.day_number}N${record.night_number}D`,
        },
        ...getActionColumn(['', ACTION_UPDATE, ACTION_DELETE], handleOnChangeSelect, 'TOPIC_MARKET'),
    ];

    const tourColumns = [
        {
            title: 'Ngày khởi hành',
            dataIndex: 'flight_date',
            key: 'flight_date'
        },
        {
            title: 'Mã tour',
            dataIndex: 'series_code',
            key: 'series_code'
        },
        {
            title: 'Giá ADL',
            dataIndex: 'price_adl_off',
            key: 'price_adl_off',
            render: (_: any, record: any) => formatPrice(record?.price_adl_off?.toString() as string),
        },
        {
            title: 'Push Sale',
            dataIndex: 'is_push_sale',
            key: 'is_push_sale',
            render: (_: any, record: any) => record?.is_push_sale === 1 ? IS_PUSH_SALE : NOT_PUSH_SALE,
        },
        {
            title: 'Giá ADL Push Sale',
            dataIndex: 'push_sale_price_adl_off',
            key: 'push_sale_price_adl_off',
            render: (_: any, record: any) => formatPrice(record?.push_sale_price_adl_off?.toString() as string),
        },
        {
            title: '',
            dataIndex: ACTION_DELETE,
            key: ACTION_DELETE,
            render: (_: any, record: any) => <DeleteOutlined
                className="!text-red-600"
                onClick={() => handleConfirm(
                    'Xác nhận xóa ' + record?.series_code + ' khỏi thị trường',
                    () => onDeleteTour(record)
                )}
            />,
        },
    ];

    return (
        <div>
            <h3 className='font-medium mb-4'>
                Danh sách thị trường
            </h3>
            <Table
                loading={loading}
                columns={marketColumns}
                dataSource={marketData}
                pagination={{
                    pageSize: 20,
                    position: ['bottomCenter']
                }}
                expandable={{
                    expandedRowRender: (record, index) => {
                        let data = (record.tours || []).map((item: any) => ({
                            ...formatAllPriceAndDateKey(item, 'tour_id'),
                            marketIndex: index,
                        }));
                        return <Table
                            columns={tourColumns}
                            dataSource={data.reverse()}
                            pagination={false}
                        />
                    },
                    rowExpandable: (record) => record.tours?.length > 0,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        record.tours?.length > 0 ?
                            expanded ? (
                                <MinusCircleTwoTone
                                    onClick={e => onExpand(record, e)}
                                    className='select-none align-middle'
                                    style={{ fontSize: '17px' }}
                                />
                            ) : (
                                <PlusCircleTwoTone
                                    onClick={e => onExpand(record, e)}
                                    className='select-none align-middle'
                                    style={{ fontSize: '17px' }}
                                />
                            )
                            : null
                }}
            />
            {confirmModal}
        </div>
    );
};

export default AdminTopicMarketTable;
