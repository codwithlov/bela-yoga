import { Checkbox, Popover, Select } from "antd"
import { ColumnType } from "antd/es/table";
import React from "react"
import { commonCkeditorTabFields, marketCkeditorTabFields } from "./ui";
import LinkList from "@/components/admin/organisms/LinkList";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getSeoScoreColor } from "@/utils/post";
import { getAnchorList } from "@/utils/htmlUtils";

export const pushSaleColumn: ColumnType<any> = {
    key: 'is_push_sale',
    title: 'Push sale',
    render: (value: any) => (
        <Checkbox checked={value} disabled />
    ),
    align: 'center',
    width: 95,
}

export const getActiveColumn = (sorter: boolean = false): ColumnType<any> => ({
    key: 'is_active',
    dataIndex: 'is_active',
    title: 'Hiển thị',
    render: (value: any) => <Checkbox checked={value} disabled />,
    align: 'center',
    width: 95,
    sorter,
});

export const keywordsColumn: ColumnType<any> = {
    title: 'Từ khóa',
    key: 'keywords',
    render: (value: any, record: any) => {
        const colorClass = getSeoScoreColor(record.seo_score, record.index, value);

        return (
            <div className="flex items-center space-x-1.5">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${colorClass}`} />
                <span>{value || ''}</span>
            </div>
        );
    },
    dataIndex: 'keywords',
};

export const slugColumn: ColumnType<any> = {
    key: 'slug',
    title: 'Slug',
    dataIndex: 'slug',
    render: (value: any, record: any) => {
        return record.deleted === 1 ? value :
            <a href={`/${value}?admin=true`} target='_blank'>
                <div className="w-full h-full cursor-pointer">
                    {value}
                </div>
            </a>
    },
    minWidth: 250,
}

export const getAnchorColumn = (isMarket = false,) => {
    const fields = isMarket ? marketCkeditorTabFields : commonCkeditorTabFields;
    return {
        title: 'Anchor',
        key: 'anchor',
        width: 80,
        render: (_: any, record: any) => {
            record = isMarket ? record.main_post : record;
            const anchorList = getAnchorList(fields.map((field) => (record?.[field.key] || '')).join(' '));
            return <LinkList anchorList={anchorList} title='Anchor Links' />
        },
        align: 'center',
    }
}

export const getTourColumnsOptions = (isHistory?: boolean, listColumns?: any) => [
    {
        key: 'flight_date',
        title: 'Ngày đi',
        render: (_: any, record: any) => (
            <div dangerouslySetInnerHTML={{ __html: `${record.flight_date}<br />${record.shcb} (${record.takeoff_time} - ${record.arrive_time})` }} />
        ),
        width: 190,
    },
    {
        key: 'flight_date_back',
        title: 'Ngày về',
        render: (_: any, record: any) => (
            <div dangerouslySetInnerHTML={{ __html: `${record.flight_date_back}<br />${record.shcb_back} (${record.takeoff_time_back} - ${record.arrive_time_back})` }} />
        ),
        width: 190,
    },
    { key: 'price_adl', title: 'Giá ADL' },
    { key: 'price_chd', title: 'Giá CHD' },
    { key: 'price_inf', title: 'Giá INF' },
    ...(isHistory ? [
        { key: 'price_adl_off', title: 'Giá ADL bán' },
        { key: 'price_chd_off', title: 'Giá CHD bán' },
        { key: 'price_inf_off', title: 'Giá INF bán' },]
        : listColumns),
    pushSaleColumn,
    { key: 'push_sale_price_adl_off', title: 'Giá ADL push sale' },
    { key: 'push_sale_price_chd_off', title: 'Giá CHD push sale' },
    { key: 'push_sale_price_inf_off', title: 'Giá INF push sale' },
    { key: 'remaining_seats', title: 'Số chỗ trống' },
    { key: 'total_seat', title: 'Tổng số chỗ' },
    { key: 'from', title: 'Từ' },
    { key: 'to', title: 'Đến' },
    getActiveColumn(),
].map((item: any) => ({ ...item, dataIndex: item.key, align: 'center' }))

export const marketColumnsOptions = [
    keywordsColumn,
    { key: 'nations', title: 'Quốc gia' },
    { key: 'destinations', title: 'Điểm đến' },
    { key: 'market_name', title: 'Thị trường', },
    { key: 'tour_name', title: 'Tên tuyến tour', width: 300, },
    slugColumn,
    { key: 'day_night_number', title: 'Số ngày/đêm' },
    { key: 'min_flight_date', title: 'Ngày đi sớm nhất' },
    { key: 'max_flight_date', title: 'Ngày đi muộn nhất' },

    {
        key: 'display_price',
        title: (
            <>

                <span> Giá hiển thị</span>
                <Popover
                    content={
                        <div className="w-60">
                            Giá hiển thị sẽ được sử dụng khi tuyến tour không có ngày khởi hành
                        </div>
                    }
                    placement="bottom"
                    className="cursor-pointer">
                    <QuestionCircleOutlined className="pl-1" />
                </Popover>

            </>
        ),
    },
    { key: 'min_price_adl', title: 'Giá ADL thấp nhất' },
    { key: 'min_price_adl_off', title: 'Giá ADL bán thấp nhất' },
    { key: 'max_price_adl', title: 'Giá ADL cao nhất' },
    { key: 'max_price_adl_off', title: 'Giá ADL bán cao nhất' },
].map((item: any) => ({ ...item, dataIndex: item.key }))


export const getCustomerStatus = (customerStatusOptions: any, changeStatus: any) => {
    return {
        title: 'Trạng thái',
        key: 'customer_status_id',
        render: (value: number, record: any) => (
            <Select
                options={customerStatusOptions}
                value={value}
                className="w-full"
                onChange={(v) => changeStatus(record.id, v)}
                placeholder='Không có'
                popupMatchSelectWidth={false}
            />
        ),
        width: 150,
    }
}
