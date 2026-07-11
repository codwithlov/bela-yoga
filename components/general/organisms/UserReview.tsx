'use client'
import { Button, Form, Input, List, Skeleton, Upload } from 'antd';
import Image from 'next/image'
import { Image as AntdImage, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { Loading } from '@/components/guest/Loading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { COMMENT } from '@/constants/route';
import { formatDate } from '@/utils/formatDate';
import { toQueryString } from '@/utils/apiUtils';
import Avatar from '../molecules/Avartar';
import useIsLogin from '@/hooks/useIsLogin';
import { clickClassButton, getBase64 } from '@/utils/helper';
import { ratings, responseMessages } from '@/constants/ui';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import Rating from '@/components/guest/atoms/Rating';

type Params = {
    marketId: number,
    fromAdmin?: boolean,
    CommentActions?: any,
}

const RatingBar = ({ label, value, numberOfRating }: { label: string, value: number, numberOfRating: number }) => (
    <div className="flex items-center mb-[3px]">
        <p className="text-xs lg:text-sm w-[7rem]">{label}</p>
        <div className="relative h-[5px] bg-sgt-neutral-5 rounded w-full lg:w-[40%]">
            <div
                className="bg-gradient-to-r from-sgt-primary-2 to-sgt-primary-1 h-[5px] rounded transition-all ease-in-out duration-700 w-0"
                style={{ width: `${(value / numberOfRating) * 100}%` }}
            />
        </div>
        <p className="text-sm font-normal ml-4 w-[1.7rem]">{value}</p>
    </div>
);

const UserReview: React.FC<Params> = ({ marketId, fromAdmin, CommentActions }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [rating, setRating] = useState(5);
    const [uploadedImages, setUploadedImages] = useState<any>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);
    const [form] = Form.useForm();
    const [storeUpdateApi] = usePostDataMutation();
    const [isLogin] = useIsLogin();

    const userInfo = useGetUserInfo(true);

    const params = { entity_type: 'market', entity_id: marketId }
    const prefix = fromAdmin ? COMMENT : 'comment'
    const { data, isFetching, refetch, isSuccess } =
        useGetDataQuery(
            `${prefix}${toQueryString(params)}`,
            { refetchOnMountOrArgChange: true, skip: !marketId }
        );

    const firstLoad = useRef(true);
    useEffect(() => {
        if (isSuccess && isLogin) {
            if (firstLoad.current) {
                firstLoad.current = false
            } else {
                refetch();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin])

    const averageRating = Number(data?.rating?.averageRating) || 0;
    const numberOfRating = Number(data?.rating?.numberOfRating) || 0;
    const handleUpload = async ({ fileList }: { fileList: any }) => {
        fileList.map(async (item: any) => {
            if (!item.url && !item.preview) {
                item.preview = await getBase64(item.originFileObj);
            }
            return item;
        })
        setUploadedImages(fileList);
    };

    const handleRemove = (file: any) => {
        setUploadedImages((fileUploadList: any) => fileUploadList.filter((f: any) => f.uid !== file.uid));
        return true;
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleToggle = () => {
        setShowAll((prev) => {
            const newShowAll = !prev;
            if (!newShowAll && targetRef.current) {
                targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return newShowAll;
        });
    };

    const onFinish = async (value: any) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            uploadedImages?.forEach((file: any) => {
                formData.append('file[]', file.originFileObj);
            });
            formData.append('entity_id', marketId.toString());
            formData.append('entity_type', 'market');
            formData.append('content', value.content || '');
            formData.append('rating', rating.toString());
            const postData = {
                url: 'comment',
                data: formData,
                isFormData: true,
            }
            const payload = await storeUpdateApi(postData).unwrap();
            if (payload?.success) {

                messageApi.open({
                    type: 'success',
                    content: responseMessages.store_comment_success,
                });

                form.resetFields();
                setUploadedImages([]);
                setRating(5);
                refetch();
            }
        } catch (error: any) {
            refetch();
            if (error?.data?.message) {
                messageApi.open({
                    type: 'error',
                    content: responseMessages[error?.data?.message],
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    const cardClass = ' detail_content_card flex-1 lg:!px-[1.75rem] !py-3 !text-sgt-secondary-1';
    const avatarClass = " mr-2 lg:mr-7 ";

    return (
        <section className='text-sgt-secondary-1 flex flex-col mb-10'>
            {contextHolder}
            <Loading isLoading={isLoading} />
            {!fromAdmin &&
                <h2 className="text-[1.125rem] font-semibold lg:text-h3 pb-3">
                    Đánh giá
                </h2>
            }
            <div className='flex flex-row gap-4 lg:gap-8 mb-5'>
                <div className="flex flex-col items-center">
                    <div className="w-[4.5rem] lg:w-[5.125rem] aspect-1/1 bg-sgt-primary-4 rounded-full flex items-center justify-center">
                        <div className="w-[3.5rem] lg:w-16 aspect-1/1 bg-sgt-primary-2 rounded-full flex items-center justify-center">
                            <span className='font-bold'>{averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                    <Rating rating={averageRating.toFixed(0)} className='mt-1' />
                    <p className="text-sm lg:text-base font-semibold mt-1">
                        {ratings.find(rating => rating.value === (Number(averageRating.toFixed(0))))?.label}
                    </p>
                    <p className="text-2xs lg:text-xs max-md:leading-none">{numberOfRating} đánh giá</p>
                </div>

                <div className={cardClass + 'text-sgt-neutral-1 !mb-0'}>
                    {ratings.map((rating) => (
                        <RatingBar key={rating.value} label={rating.label} value={data?.rating?.starCounts?.[rating.value]} numberOfRating={numberOfRating} />
                    ))}
                </div>
            </div>
            {!fromAdmin && data?.canComment && isLogin &&
                <div className={cardClass}>
                    <div className='flex flex-row'>
                        <Avatar className={avatarClass} src={userInfo?.avatar} />
                        <div className="flex-1">
                            <div className="flex mb-3 justify-center">
                                {[...Array(5)].map((_, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setRating(index + 1)}
                                        className='w-1/5 lg:w-[15%] items-center flex flex-col cursor-pointer group transition-all duration-300 hover:font-bold'
                                    >
                                        <div
                                            className={`w-[1.125rem] lg:w-6 aspect-1/1 cursor-pointer transition-all duration-300 group-hover:bg-sgt-primary-2 ${index < rating ? 'bg-sgt-primary-2' : 'bg-gray-300'}`}
                                            style={{
                                                mask: 'url("/assets/icons/star.svg")',
                                                maskSize: 'contain',
                                                maskRepeat: 'no-repeat'
                                            }}
                                        />
                                        <p className={`text-2xs lg:text-xs mt-1 ${(index + 1) === rating ? ' font-bold' : ' '}`}>
                                            {ratings.find(rating => rating.value === (index + 1))?.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Form form={form} onFinish={onFinish} className='flex flex-row items-center'>
                                <div className="flex-1 relative" >
                                    <Form.Item name="content" className="flex-1 !mb-0 input-focus">
                                        <Input.TextArea
                                            placeholder="Hãy để lại cảm nhận về chuyến đi..."
                                            autoSize
                                            className='!pr-8 max-md:!text-xs max-md:!pt-[7px]'
                                        />
                                    </Form.Item>
                                    <div className='absolute top-[0.4375rem] right-[1px]'>
                                        <Upload
                                            showUploadList={false}
                                            onChange={handleUpload}
                                            className='cursor-pointer'
                                            multiple
                                            fileList={uploadedImages}
                                            beforeUpload={(file) => {
                                                const fileType = file.type;
                                                const maxFileSize = 4 * 1024 * 1024;
                                                const typeAllowUload = ['image/png', 'image/jpeg', 'image/webp'];
                                                if (!typeAllowUload.includes(fileType)) {
                                                    messageApi.open({
                                                        type: 'error',
                                                        content: `${file.name} không đúng định dạng hình ảnh`,
                                                    });
                                                    return Upload.LIST_IGNORE;
                                                }
                                                if (file.size > maxFileSize) {
                                                    messageApi.open({
                                                        type: 'error',
                                                        content: `${file.name} vượt quá kích thước tối đa 4MB`,
                                                    });
                                                    return Upload.LIST_IGNORE;
                                                }
                                                return true;
                                            }}
                                        >
                                            <div className='!px-[0.4rem] !border-l'>
                                                <Image
                                                    src="/assets/icons/upload-image.svg"
                                                    alt="upload-image"
                                                    width={0}
                                                    height={0}
                                                    style={{ width: "1.125rem", height: "1.125rem" }}
                                                />
                                            </div>
                                        </Upload>
                                    </div>
                                </div>
                                <Form.Item className="!mb-0">
                                    <Button type="primary" htmlType="submit" className="ml-1 lg:ml-4 lg:mr-1 !bg-sgt-neutral-5 !text-sgt-secondary-1 !shadow-none">
                                        Gửi
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Upload
                                className={uploadedImages.length > 0 ? '!pt-2' : ''}
                                listType="picture-card"
                                fileList={uploadedImages}
                                onRemove={handleRemove}
                                onPreview={handlePreview}
                            />
                        </div>
                    </div>
                </div >
            }
            {
                !isLogin && !fromAdmin &&
                <button
                    className='mb-5 hidden lg:flex w-1/2 lg:w-1/5 self-center justify-center items-center py-2.5  rounded-md bg-gradient-to-t from-sgt-primary-1 to-sgt-primary-2 transition-all duration-300 hover:shadow-sgt-primary'
                    onClick={() => clickClassButton('sgt-login-btn')}
                >
                    <p className='text-button text-sgt-neutral-1'>Để lại đánh giá</p>
                </button>
            }
            <div ref={targetRef} />
            <List
                pagination={(fromAdmin && data?.comments?.length > 0) ? { align: 'center', pageSize: 5 } : false}
                itemLayout="vertical"
                dataSource={isFetching ? [1, 2, 3, 4, 5] : ((showAll || fromAdmin) ? (data?.comments || []) : (data?.comments || []).slice(0, 5))}
                locale={{ emptyText: 'Chưa có đánh giá' }}
                renderItem={(item: any, index: any) => (
                    <List.Item key={index} className={cardClass}>
                        <Skeleton loading={isFetching} active avatar>
                            <div className="flex">
                                <Avatar src={item.avatar_image} className={avatarClass} />
                                <div className="flex-1">
                                    <p className="text-xs lg:text-lg font-semibold leading-none max-md:mb-1">{item.full_name}</p>
                                    <p className="text-2xs lg:text-xs font-normal leading-none mb-1">{formatDate(item.publish_date)}</p>
                                    <div className='flex items-center mb-[6px] lg:mb-2 -ml-[2px]'>
                                        <Rating rating={item.rating} small />
                                        <p className="text-2xs ml-1 mr-[6px] font-light text-sgt-neutral-3">|</p>
                                        <p className="text-2xs lg:text-xs mt-[1px] font-normal text-sgt-neutral-3">
                                            {ratings.find(rating => rating.value === (Number(item.rating)))?.label}
                                        </p>
                                    </div>

                                    <p className="text-2xs lg:text-sm leading-4 lg:leading-5 font-normal lg:mb-2 text-sgt-neutral-1 whitespace-pre-line">
                                        {item.content}
                                    </p>
                                    <div className={`grid grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3 ${item.images?.length > 0 ? 'lg:mb-2 mt-[10px]' : ''}`}>
                                        {(item.images || []).map((image: string, index: number) => (
                                            <div className='w-full aspect-3/2' key={index}>
                                                <Image
                                                    src={image}
                                                    alt={`Image ${index + 1}`}
                                                    priority={true}
                                                    sizes='100vw'
                                                    width={0}
                                                    height={0}
                                                    className='w-full h-full object-cover rounded-md'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {
                                fromAdmin && !isFetching &&
                                <CommentActions item={item} refetch={refetch} />
                            }
                        </Skeleton>
                    </List.Item>
                )}
            />
            {(data?.comments?.length || 0) > 5 && !fromAdmin &&
                <button
                    className="rounded-md mt-4 self-center py-2 px-6 text-[0.1.625rem] font-semibold text-sgt-neutral-1 border border-sgt-primary-1"
                    onClick={handleToggle}
                >
                    {!showAll ? `Xem thêm (${data?.comments?.length - 5})` : 'Thu gọn'}
                </button>
            }
            {
                previewImage && (
                    <AntdImage
                        alt='previewImage'
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible: any) => setPreviewOpen(visible),
                            afterOpenChange: (visible: any) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )
            }
            <div className='hidden-refetch-comment-btn' onClick={() => refetch()}></div>
        </section >
    );
}

export default UserReview;



