'use client';
import React from 'react';
import SupportRequestForm from '../../guestShared/forms/SupportRequestForm';
import { message } from 'antd';

const SearchAdviseForm = ({ }: {}) => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <div className='bg-white rounded-bela-10 px-5 py-2 shadow-md'>
            <p className='text-h3 text-bela-secondary-1 self-start mt-2 mb-6'>Đăng ký tư vấn</p>
            <SupportRequestForm
                messageApi={messageApi}
                source='Trang tìm kiếm'
                closeModal={() => { }}
                showTitle={false}
            />
            {contextHolder}
        </div>
    );
};

export default SearchAdviseForm;
