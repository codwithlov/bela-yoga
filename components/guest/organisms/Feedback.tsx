'use client';
import React from 'react';
import SubTitle from '@/components/guest/SubTitle';
import CustomSlider from './CustomSlider';
import FeedbackItem from './FeedbackItem';
import { ShowMoreBtn } from '../atoms/ShowMoreBtn';
import { useRouter } from 'next/navigation';
import { IFeedback } from '@/interfaces/feedback';

type FeedbackProps = {
    feedbacks: IFeedback[];
    tagId: number;
};

const Feedback = ({ feedbacks, tagId }: FeedbackProps) => {
    const router = useRouter();
    const title = 'Phản hồi từ khách hàng';
    const filterFeedbacks = feedbacks.filter(i => !!i.images?.length);
    if (filterFeedbacks.length < 3) return null;

    return (
        <section className="max-xl:px-4">
            <div className="pb-16 mb-1 max-sm:pb-0">
                <SubTitle title={title} />
                <div className='flex flex-row justify-center pt-5 max-sm:px-4'>
                    <p className='lg:w-4/5 mx-0 text-body-2 max-sm:text-cap-1 text-sgt-secondary-1 text-center'>SPORTVERSE liên tục hoàn thiện trải nghiệm booking và kết nối cộng đồng dựa trên phản hồi thực tế từ người chơi, đội bóng và đơn vị vận hành sân.</p>
                </div>
                <CustomSlider items={filterFeedbacks}>
                    {(item, index) => (
                        <FeedbackItem item={item} canShowDetail />
                    )}
                </CustomSlider>
                <ShowMoreBtn href={'/danh-gia-khach-hang?tagId=' + tagId} showArrow className='flex justify-center' />
            </div>
        </section>
    );
};

export default Feedback;
