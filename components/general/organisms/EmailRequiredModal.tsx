'use client'
import React from 'react'
import { Form, Modal } from 'antd';
import { validateMessages } from '@/utils/validateRule';
import EmailInput from '../molecules/input/EmailInput';
import SubmitButton from '../molecules/SubmitButton';

type Params = {
    emailrequiredDrawer: boolean,
    setEmailRequiredDrawer: any,
    onFinish: any,
}

const EmailRequiredModal: React.FC<Params> = ({ onFinish, setEmailRequiredDrawer, emailrequiredDrawer }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            open={emailrequiredDrawer}
            onCancel={() => setEmailRequiredDrawer(false)}
            centered
            cancelButtonProps={{ className: "!hidden" }}
            okButtonProps={{ className: "!hidden" }}
            closable={false}
            styles={{
                mask: {
                    backgroundColor: '#A7A7A7',
                    opacity: 0.7,
                },
                content: {
                    borderRadius: 25,
                    padding: '40px 58px',
                    marginTop: 50,
                }
            }}
            maskTransitionName=""
            footer={null}
            width={460}
            destroyOnHidden
        >
            <Form
                form={form}
                className='!mt-4 flex flex-col w-full'
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <p className='text-sm font-medium leading-[1.3125rem] text-bela-neutral-4 text-center mb-5'>
                    Tài khoản Facebook của bạn chưa có Email
                    <br />
                    Để hoàn tất đăng nhập vui lòng
                    <br />
                    Cung cấp email để liên kết tài khoản Facebook của bạn với Website của chúng tôi!.
                </p>
                <EmailInput />
                <SubmitButton text='Liên kết' />
            </Form>
        </Modal>
    );
}

export default EmailRequiredModal;
