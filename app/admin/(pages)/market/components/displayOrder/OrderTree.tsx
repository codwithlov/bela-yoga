import React, { useEffect, useState } from 'react';
import { Tree, Button, Select } from 'antd';
import { usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { showSuccessToastr } from '@/utils/toastr';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { useGetMarketSummaryBySearchQuery } from '@/services/api/markets';
import { MARKET } from '@/constants/route';
import { onDropSingleLayer } from '@/utils/antdTree';

const OrderTree: React.FC<any> = ({ slugOptions }) => {
    const [gData, setGData] = useState<any[]>([]);
    const [slugValue, setSlugValue] = useState<any>(null);
    const [spinning, setSpinning] = useState(false);
    const { data: marketList, isFetching, refetch } = useGetMarketSummaryBySearchQuery(
        `?slug_permalink=${slugValue}&limit=300&page=1`,
        { skip: !slugValue }
    );
    const [postApi] = usePostDataMutation();

    useEffect(() => {
        if (isFetching) return;
        if (marketList?.data) {
            setGData(marketList.data.map((i) => ({
                title: i.tour_name,
                key: i.market_id,
            })));
        } else {
            setGData([]);
        }
    }, [isFetching, marketList]);

    const handleOnSubmit = async () => {
        if (!slugValue) { return; }
        const postData = {
            url: MARKET + '/display-order',
            data: {
                slug: slugValue,
                market_ids: gData.map(i => i.key).join(','),
            },
        };
        await handleApiResponse(
            postApi(postData),
            (payload: any) => {
                showSuccessToastr(payload?.message);
            },
            setSpinning,
        );
        refetch();
    };

    const handleSlugChange = (value: string) => {
        setSlugValue(value);
    };

    return (
        <>
            <AdminLoading isLoading={spinning || isFetching} />
            <div className="mb-4 flex gap-2 justify-between">
                <Select
                    placeholder="Chọn slug"
                    value={slugValue}
                    onChange={handleSlugChange}
                    className="!w-2/3"
                    options={slugOptions.map((option: any) => ({
                        value: option.label,
                        label: option.label,
                    }))}
                    showSearch
                />
                <Button type="primary" onClick={handleOnSubmit}>
                    Cập nhật
                </Button>
            </div>

            <Tree
                draggable
                onDrop={(info) => onDropSingleLayer(info, gData, setGData)}
                treeData={gData}
                fieldNames={{ key: 'key', title: 'title' }}
            />
        </>
    );
};

export default OrderTree;
