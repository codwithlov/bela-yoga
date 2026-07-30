'use client';
import React, { useEffect, useState } from 'react';
import { handleApiResponse } from '@/utils/helper';
import { usePostDataMutation } from '@/services/api/common';
import { message } from 'antd';
import dynamic from 'next/dynamic';

const FooterCss = dynamic(() => import('@/components/non-critical/FooterCss'), { ssr: false });

const FooterField = () => {
    const [isClient, setIsClient] = useState(false);
    const [field, setField] = useState('');
    const [loading, setLoading] = useState(false);
    const [postApi] = usePostDataMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField(e.target.value);
    };

    const handleSubmit = async () => {
        const contact = field.trim();
        if (!contact) {
            return;
        }
        const postData = {
            url: 'support-request',
            data: { contact: contact.replace(/\s+/g, ''), source: 'Footer' },
        };
        await handleApiResponse(
            postApi(postData),
            (payload: any) => {
                messageApi.open({
                    type: 'success',
                    content: 'Đăng ký thành công',
                });
                setField('');
            },
            setLoading,
            messageApi,
        );
    };


    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && <FooterCss />}
            < div className='col-span-12 lg:col-span-6 flex flex-row flex-wrap justify-center items-center gap-3' >
                <input
                    className='email_input'
                    placeholder='Nhập số điện thoại hoặc email của bạn'
                    value={field}
                    onChange={handleFieldChange}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='text-button px-7 py-2.5 rounded-md bg-gradient-to-t from-bela-primary-1 to-bela-primary-2 transition-all duration-300 hover:shadow-bela-primary'
                >
                    {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                </button>
                {contextHolder}
            </div >
        </>
    );
};

export default FooterField;
