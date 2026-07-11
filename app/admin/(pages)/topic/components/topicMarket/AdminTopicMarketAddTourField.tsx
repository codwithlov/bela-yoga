import { AdminLoading } from "@/components/admin/atoms/Loading";
import { TOUR } from "@/constants/route";
import { useLazyGetDataQuery } from "@/services/api/common";
import { showErrorToastr } from "@/utils/toastr";
import { Button, Input } from "antd";
import React, { useState } from "react";

type Props = {
    addTour: any;
};

const AdminTopicMarketAddTourField = ({ addTour }: Props) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [fetchMarketIdByCode] = useLazyGetDataQuery();

    const handleSearchTour = async () => {
        if (!inputValue) return;

        setLoading(true);
        try {
            const response = await fetchMarketIdByCode(`${TOUR}/get-tour-info-by-code/${inputValue.trim()}`).unwrap();
            if (response.market_id) {
                addTour(response.market_id, response.tour_id);
            } else {
                showErrorToastr('Tour không tồn tại hoặc đã qua ngày khởi hành');
            }
        } catch (error) {
            showErrorToastr('server_error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className='flex gap-3'>
                {loading && <AdminLoading isLoading={true} />}
                <Input
                    className='!w-1/3'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='Nhập mã tour...'
                />
                <Button htmlType="button" onClick={handleSearchTour}>
                    Thêm tour
                </Button>

            </div>
            <p className="text-red-500 font-medium">*Chỉ được sử dụng khi tuyến tour chưa nằm trong danh sách thị trường</p>
        </div>
    );
};

export default AdminTopicMarketAddTourField;
