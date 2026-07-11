import React, { useEffect, useState } from 'react';
import { Tree, Button } from 'antd';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { showSuccessToastr } from '@/utils/toastr';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { onDropSingleLayer } from '@/utils/antdTree';

//type could be desstination or any thing in the future
const OrderTree: React.FC<any> = ({ type }) => {
    const [gData, setGData] = useState<any[]>([]);
    const [spinning, setSpinning] = useState(false);
    const { data: dataList, isFetching, refetch } = useGetDataQuery(
        `nation/famous-list?method=paginate&limit=100`,
    );
    const [postApi] = usePostDataMutation();

    useEffect(() => {
        if (isFetching) return;
        if (dataList?.data) {
            setGData(dataList.data.map((i: any) => ({
                title: i.nation_name,
                key: i.nation_id,
            })));
        } else {
            setGData([]);
        }
    }, [isFetching, dataList]);

    const handleOnSubmit = async () => {
        if (gData.length === 0) { return; }
        const postData = {
            url: '/update-display-order',
            data: {
                type: type,
                page: 'home',
                ids: gData.map(i => i.key).join(','),
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

    return (
        <>
            <AdminLoading isLoading={spinning || isFetching} />
            <Button type="primary" className='mb-3' onClick={handleOnSubmit}>
                Cập nhật
            </Button>

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
