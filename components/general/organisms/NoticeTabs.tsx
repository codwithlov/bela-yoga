'use client';
import React, { useState } from 'react';

interface NoticeTabsProps {
    tabs: { title: any; content: any }[];
}

const NoticeTabs: React.FC<NoticeTabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    return (
        <div className='bg-white rounded-bela-10 px-5 py-3.5'>
            {/* Tab Buttons */}
            <div className='flex gap-2.5 border-b border-bela-neutral-5 mb-3.5 pb-3.5 '>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`py-2.5 px-4 text-body-1 rounded-md transition-colors duration-200 leading-none hover:bg-bela-primary-light ${activeTab === index ? 'bg-bela-primary-2' : 'bg-bela-neutral-5'}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className='ck-content pr-20 pb-2.5' dangerouslySetInnerHTML={{ __html: tabs[activeTab]?.content || 'Chưa có thông tin' }} />
        </div>
    );
};

export default NoticeTabs;
