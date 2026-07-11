import { AdminLoading } from "@/components/admin/atoms/Loading";
import { TOUR } from "@/constants/route";
import { useLazyGetDataQuery } from "@/services/api/common";
import { showErrorToastr } from "@/utils/toastr";
import { Button } from "antd";
import React, { useState } from "react";

type Props = {
    setFormValue: any;
    marketId: any;
};

const AutoFillTourForm = ({ setFormValue, marketId }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [fetchData] = useLazyGetDataQuery();

    const handleSearchTour = async () => {
        setLoading(true);
        try {
            const response = await fetchData(`${TOUR}/get-auto-fill-data-by-market/${marketId}`).unwrap();
            if (response.tour) {
                setFormValue(response.tour);
            } else {
                showErrorToastr('Không tồn tại tour nào thuộc thị trường này!');
            }
        } catch (error) {
            showErrorToastr('server_error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminLoading isLoading={loading} />
            <Button onClick={handleSearchTour} type='primary' disabled={!marketId} className="mt-3">
                Tự động điền
            </Button>
        </>

    );
};

export default AutoFillTourForm;