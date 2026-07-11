'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ControllerInput from '@/components/general/atoms/ControllerInput';
import { usePostDataMutation } from '@/services/api/common';
import { handleApiResponse } from '@/utils/helper';
import { controlerRule } from '@/utils/validateRule';
import { responseMessages } from '@/constants/ui';
import { Loading } from '@/components/guest/Loading';

type SupportRequestFormProps = {
    closeModal: () => void;
    messageApi: any;
    source: string;
    showTitle?: boolean;
};

const inputClassName = 'mt-1 font-medium text-sm lg:text-base rounded-xl w-full py-3 px-4 border border-sgt-neutral-4 bg-white focus:outline-none focus:border-sgt-primary-1 placeholder:text-sgt-neutral-3 placeholder:font-normal placeholder:text-xs lg:placeholder:text-sm';

export default function SupportRequestForm({ closeModal, messageApi, source, showTitle = true }: SupportRequestFormProps) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [postApi] = usePostDataMutation();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        const postData = {
            url: 'support-request',
            data: {
                ...data,
                source,
            },
        };

        await handleApiResponse(
            postApi(postData),
            (payload: any) => {
                messageApi?.open?.({
                    type: 'success',
                    content: responseMessages[payload?.message] || responseMessages.support_request_success,
                });
                reset();
                closeModal();
            },
            setLoading,
            messageApi,
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='relative flex flex-col gap-4'>
            {loading && <Loading isLoading={loading} />}

            {showTitle && (
                <div className='space-y-2'>
                    <p className='text-2xl font-semibold text-sgt-secondary-1'>Đăng ký tư vấn</p>
                    <p className='text-sm leading-6 text-sgt-neutral-3'>
                        Để lại thông tin để đội ngũ hỗ trợ liên hệ nhanh cho bạn về lịch sân, booking hoặc nhu cầu liên quan.
                    </p>
                </div>
            )}

            <ControllerInput
                control={control}
                errors={errors}
                name='name'
                label='Họ và tên'
                placeholder='Nhập họ và tên'
                required
                maxLength={100}
                className={inputClassName}
            />

            <ControllerInput
                control={control}
                errors={errors}
                name='phone'
                label='Số điện thoại'
                placeholder='Nhập số điện thoại'
                required
                maxLength={11}
                rules={controlerRule.phone}
                className={inputClassName}
            />

            <ControllerInput
                control={control}
                errors={errors}
                name='note'
                label='Nội dung cần tư vấn'
                placeholder='Mô tả nhu cầu của bạn'
                required
                maxLength={250}
                isTextArea
                rows={4}
                className={inputClassName}
                defaultValue={source ? `Nguồn quan tâm: ${source}` : ''}
            />

            <button type='submit' className='rounded-xl bg-gradient-to-r from-sgt-primary-1 to-sgt-primary-2 px-5 py-3 text-sm font-semibold text-white shadow-sgt-primary transition hover:-translate-y-0.5'>
                Gửi yêu cầu tư vấn
            </button>
        </form>
    );
}
