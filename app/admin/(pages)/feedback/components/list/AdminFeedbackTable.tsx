'use client'
import { useRef, useState } from "react";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import { getUpdateDrawerProps, handleApiRequest } from "@/utils/helper";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import { useDeleteMutation } from "@/services/api/common";
import { FEEDBACK } from "@/constants/route";
import { IFeedback } from "@/interfaces/feedback";
import FeedbackItem from "@/components/guest/organisms/FeedbackItem";
import { Drawer, Space, Popover, Button } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminFeedbackCreateUpdate from "../AdminFeedbackCreateUpdate";

interface ActionProps {
    mappedData: IFeedback[];
    refetch: any;
    isFetching: any;
}

const AdminFeedbackTable = (props: ActionProps) => {
    const { mappedData, refetch, isFetching } = props;
    const { handleConfirm, confirmModal } = useConfirm();
    const [spinning, setSpinning] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const currentRecord = useRef<any>(null);

    const [deleteApi] = useDeleteMutation();

    const handleOnDeleteOk = async (id: number) => {
        const body = {
            url: FEEDBACK + '/' + id,
        }
        await handleApiRequest(deleteApi(body), refetch, setSpinning);
    };

    const handleEdit = (record: IFeedback) => {
        currentRecord.current = record;
        setOpenEdit(true);
    }

    return (
        <>
            <AdminLoading isLoading={spinning || isFetching} />
            <div className="grid grid-cols-12 gap-3">
                {
                    mappedData?.length ?
                        mappedData.map((item, index) => (
                            <div key={index} className='col-span-3 aspect-square relative group'>
                                <Popover
                                    content={
                                        <Space>
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEdit(item)}
                                            />
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleConfirm('Xác nhận xóa', () => handleOnDeleteOk(item.id))}
                                            />
                                        </Space>
                                    }
                                    trigger="hover"
                                    placement="topRight"
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        <span className="block p-1 bg-white rounded-lg cursor-pointer">
                                            •••
                                        </span>
                                    </div>
                                </Popover>
                                <FeedbackItem item={item} canShowDetail />
                            </div>
                        )) :
                        <div className='col-span-12 h-96 pt-10 flex flex-row justify-center'>
                            {!isFetching &&
                                <p className="text-2xl leading-tight">Không có dữ liệu</p>
                            }
                        </div>
                }
            </div>
            <Drawer
                title="Chỉnh sửa feedback"
                open={openEdit}
                {...getUpdateDrawerProps('600px')}
                onClose={() => setOpenEdit(false)}
            >
                <AdminFeedbackCreateUpdate
                    reloadDataList={refetch}
                    closeModal={(() => setOpenEdit(false))}
                    feedbackId={currentRecord.current?.id}
                />
                {confirmModal}
            </Drawer>
            {confirmModal}
        </>
    )
}

export default AdminFeedbackTable;
