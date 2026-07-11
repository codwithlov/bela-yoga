'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { PHONE } from '@/constants/link'
import ControllerInput from '@/components/general/atoms/ControllerInput';
import { useForm } from 'react-hook-form';
import { handleApiResponse } from '@/utils/helper';
import { usePostDataMutation } from '@/services/api/common';
import { message } from 'antd';
import { responseMessages } from '@/constants/ui';
import { controlerRule } from '@/utils/validateRule';
import { Loading } from '@/components/guest/Loading';

const SupportForm = ({ source }: { source: string }) => {
    const inputClasses = 'bg-sgt-neutral-5 text-sgt-neutral-3 text-body-2 rounded-md w-full p-2 focus:outline-none text-center';
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [postApi] = usePostDataMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        const postData = {
            url: 'support-request',
            data: { ...data, source },
        };
        await handleApiResponse(
            postApi(postData),
            (payload: any) => {
                messageApi.open({
                    type: 'success',
                    content: responseMessages[payload?.message],
                });
                reset();
            },
            setLoading,
            messageApi,
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-sgt-neutral-7 rounded-sgt-10 pt-8 pb-5 px-4 flex flex-col items-center mb-10'>
            {loading && <Loading isLoading={loading} />}
            <p className='text-sub-1 text-sgt-secondary-1'>Liên hệ càng sớm - Giá càng rẻ</p>
            <a className='mt-4 flex gap-2 items-center justify-center' href={`tel:${PHONE.trim()}`}>
                <Image
                    src="/assets/images/journey-diary/red-phone.png"
                    alt="red-phone"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px]"
                />
                <p className='text-sgt-secondary-1 text-[1.375rem] font-bold leading-none'>
                    {PHONE}
                </p>
            </a>
            <p className='mt-4 text-body-2 text-center'>
                Hoặc để lại số điện thoại, chúng tôi sẽ gọi lại cho bạn sau ít phút !
            </p>
            <div className='mt-2 flex gap-4'>
                <ControllerInput
                    control={control}
                    errors={errors}
                    name="phone"
                    placeholder="Số điện thoại"
                    required
                    maxLength={11}
                    rules={controlerRule.phone}
                    className={inputClasses}
                />
                <ControllerInput
                    control={control}
                    errors={errors}
                    name="note"
                    placeholder="Tour cần tư vấn"
                    required
                    maxLength={50}
                    className={inputClasses}
                />
            </div>
            <button className='mt-2 bg-sgt-primary-1 rounded-md p-2 text-center w-full'>
                <p className='text-body-2'>Gửi ngay</p>
            </button>
            {contextHolder}
        </form>
    )
}

export default SupportForm
