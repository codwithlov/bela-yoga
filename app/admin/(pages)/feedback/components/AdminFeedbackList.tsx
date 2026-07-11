'use client'
import { useState } from 'react';
import CTPagination from '@/components/admin/molecules/CTPagination';
import { useGetDataQuery } from '@/services/api/common';
import { FEEDBACK } from '@/constants/route';
import { toQueryString } from '@/utils/apiUtils';
import AdminFeedbackFilter from './list/AdminFeedbackFilter';
import AdminFeedbackTable from './list/AdminFeedbackTable';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import AdminFeedbackCreateUpdate from './AdminFeedbackCreateUpdate';

const AdminFeedbackList = () => {
    const [page, setPage] = useState(1);
    const [param, setParam] = useState<any>({});

    const { data: feedbackData, isFetching, refetch } =
        useGetDataQuery(`${FEEDBACK}${toQueryString(param)}`, { refetchOnMountOrArgChange: true, });
    return (
        <section className='pb-2'>
            <div className='flex justify-between mb-1'>
                <h3>Danh sách feedback</h3>
                <ShowCreateDrawer title='Thêm mới feedback' width='600px' code="FEEDBACK_CREATE" destroyOnHidden>
                    {(closeModal, open) => (
                        <AdminFeedbackCreateUpdate
                            reloadDataList={refetch}
                            closeModal={closeModal}
                        />
                    )}
                </ShowCreateDrawer>
            </div>
            <AdminFeedbackFilter
                setParam={setParam}
                setPage={setPage}
                tagList={feedbackData?.data?.tagList}
            />
            <AdminFeedbackTable
                mappedData={feedbackData?.data?.feedbackList}
                refetch={refetch}
                isFetching={isFetching}
            />
            <CTPagination
                setPage={setPage}
                setParam={setParam}
                pagination={feedbackData?.data?.pagination}
                page={page}
            />
        </section>
    )
}

export default AdminFeedbackList