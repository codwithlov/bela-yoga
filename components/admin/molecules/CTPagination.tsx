'use client';
import { Pagination } from "antd";
import { useEffect, useState } from "react";

interface PaginationProps {
    total: number;
    per_page: number;
    from: number;
    to: number;
}

interface ActionProps {
    setPage?: (page: number) => void;
    setParam: (params: (prev: any) => any) => void;
    pagination: PaginationProps;
    page: number;
    placement?: 'start' | 'end' | 'center';
    notScroll?: boolean;
}

const CTPagination: React.FC<ActionProps> = ({ setPage, setParam, pagination, page, placement = 'start', notScroll }) => {

    const [rangeFrom, setRangeFrom] = useState<number>(0);
    const [rangeTo, setRangeTo] = useState<number>(0);

    useEffect(() => {
        setRangeFrom(pagination?.from);
        setRangeTo(pagination?.to);
    }, [pagination]);

    const handlePageChange = (newPage: number) => {
        if (setPage) {
            setPage(newPage);
        }
        setParam((prevParam: any) => ({
            ...prevParam,
            page: newPage,
        }));
        if (!notScroll) {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    };

    return (
        <div className={`!mt-4 flex justify-${placement} items-center`}>
            <Pagination
                className=''
                onChange={handlePageChange}
                responsive
                showSizeChanger={false}
                total={pagination?.total}
                current={page}
                hideOnSinglePage
                pageSize={pagination?.per_page}
            // showTotal={(total: number, range) => `Đang xem ${range[0]} - ${range[1]} / ${total}`}
            />
            <div className="ml-2"> Đang xem {rangeFrom} - {rangeTo} / {pagination?.total ?? 0}</div>
        </div>
    );
}

export default CTPagination;
