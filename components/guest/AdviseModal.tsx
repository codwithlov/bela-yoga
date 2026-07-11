'use client'
import { message, Modal } from 'antd'
import React from 'react'
import useWindowSize from '@/hooks/useWindowSize';
import SupportRequestForm from '@/app/(guest)/guestShared/forms/SupportRequestForm';

const AdviseModal = ({ openModal, closeModal, source }: { openModal: any, closeModal: any, source: string }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const windowSize = useWindowSize();

    return (
        <>
            <Modal
                centered
                open={!!openModal}
                onCancel={closeModal}
                cancelButtonProps={{ className: "!hidden" }}
                okButtonProps={{ className: "!hidden" }}
                closable={false}
                styles={{
                    content: {
                        borderRadius: 20,
                        padding: windowSize?.width as number < 1024 ? '30px' : '40px',
                    }
                }}
                footer={null}
                width={600}
            >
                <p className='lg:hidden text-lg font-semibold mb-6 text-center'>
                    THÔNG TIN KHÁCH HÀNG
                </p>
                <SupportRequestForm
                    closeModal={closeModal}
                    messageApi={messageApi}
                    source={source}
                />
            </Modal >
            {contextHolder}
        </>
    )
}

export default AdviseModal
