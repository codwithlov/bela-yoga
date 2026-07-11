'use client';

import React, { useState } from 'react';
import { Button, Modal, List, Checkbox } from 'antd';
import useCheckPermission from '@/hooks/useCheckPermission';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import { handleApiRequest } from '@/utils/helper';
import { useDeleteMutation } from '@/services/api/common';
import { formatDate } from '@/utils/formatDate';
import { AdminLoading } from '@/components/admin/atoms/Loading';

type Props = {
    draftList: { id: number; title: string; created_at: string }[];
    reloadDataList: () => void;
    type: 'POST' | 'TOPIC' | 'DESTINATION';
};

const AdminDeleteDraft: React.FC<Props> = ({ draftList, reloadDataList, type }) => {
    const [open, setOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [spinning, setSpinning] = useState(false);
    const checkPermission = useCheckPermission();
    const { handleConfirm, confirmModal } = useConfirm();
    const [deleteApi] = useDeleteMutation();

    if (!checkPermission('POST_DELETE_DRAFT')) {
        return null;
    }

    const toggleSelection = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        const body = {
            url: 'others/delete-multiple-draft',
            data: { ids: selectedIds, type }
        };
        await handleApiRequest(deleteApi(body), reloadDataList, setSpinning);
        setSelectedIds([]);
    };

    const convertedDraftList = (draftList || []).map(item => ({
        value: item.id,
        label: `${item.title || []} (${formatDate(item.created_at)})`
    }));

    const isAllChecked = selectedIds.length === convertedDraftList.length;
    const hasAnyChecked = selectedIds.length > 0;

    const handleCheckAll = () => {
        if (isAllChecked || hasAnyChecked) {
            setSelectedIds([]);
        } else {
            setSelectedIds(convertedDraftList.map(item => item.value));
        }
    };

    if (!draftList || draftList.length === 0) {
        return <></>
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Xóa nháp</Button>
            <AdminLoading isLoading={spinning} />

            <Modal
                title="Xóa nhiều bản nháp"
                open={open}
                width={700}
                onCancel={() => setOpen(false)}
                cancelButtonProps={{ className: '!hidden' }}
                okText="Xóa"
                onOk={() => {
                    handleConfirm(`Xác nhận xóa ${selectedIds.length} bài nháp`, () => handleDelete());
                }}
                okButtonProps={{ disabled: selectedIds.length === 0 }}
            >
                <div className="mb-2 flex justify-end">
                    <Button type="default" onClick={handleCheckAll}>
                        {isAllChecked || hasAnyChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </Button>
                </div>

                <List
                    bordered
                    dataSource={convertedDraftList}
                    className="max-h-[450px] overflow-y-auto custom-scrollbar"
                    renderItem={item => (
                        <List.Item>
                            <Checkbox
                                checked={selectedIds.includes(item.value)}
                                onChange={() => toggleSelection(item.value)}
                            >
                                {item.label}
                            </Checkbox>
                        </List.Item>
                    )}
                />
            </Modal>
            {confirmModal}
        </>
    );
};

export default AdminDeleteDraft;
