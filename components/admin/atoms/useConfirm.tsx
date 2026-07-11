'use client';
import React, { useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';

type UseConfirmProps = {
    open: boolean;
    title: string;
    icon: React.ReactNode;
    okText: string;
    okType: 'default' | 'primary' | 'danger';
    cancelText: string;
    onOk: () => void;
    onCancel: () => void;
};

export const useConfirm = () => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [okText, setOkText] = useState('');
    const [onOkCallback, setOnOkCallback] = useState<() => void>(() => () => { });

    const handleConfirm = (content: any, onOk: any, okText?: any) => {
        setContent(content);
        setOkText(okText || '');
        setOnOkCallback(() => onOk);
        setOpen(true);
    };

    const handleOk = () => {
        onOkCallback();
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const modalProps: UseConfirmProps = {
        open,
        title: 'Xác nhận!',
        icon: <ExclamationCircleFilled />,
        okText: okText || 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: handleOk,
        onCancel: handleCancel,
    };

    const confirmModal = <Modal {...modalProps}><p>{content}</p></Modal>

    return {
        handleConfirm,
        confirmModal,
    };
};