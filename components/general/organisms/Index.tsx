'use client';
import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { extractHeadings } from '@/utils/htmlUtils';

const Index = ({ content }: { content: string }) => {
    const [isClient, setIsClient] = useState(false);
    const [activeKey, setActiveKey] = useState<string[]>(['1']);

    useEffect(() => {
        setActiveKey([]);
        setTimeout(() => {
            setIsClient(true);
        }, 0);
    }, []);

    const headings = extractHeadings(content);

    const handleScrollToHeading = (e: React.MouseEvent, headingId: string) => {
        e.preventDefault();
        const targetElement = document.getElementById(headingId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - (document.querySelector('#nav')?.scrollHeight || 100);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    };

    if (headings.length === 0) {
        return null;
    }

    const items = [
        {
            key: '1',
            label: 'Mục lục',
            children: (
                <nav>
                    <ul>
                        {headings.map((heading, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer ${index !== 0 ? 'mt-1' : ''} ${heading.tagName === 'h3' ? 'ml-4' : heading.tagName === 'h4' ? 'ml-8' : ''}`}
                            >
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => handleScrollToHeading(e, heading.id)}
                                    className='text-sgt-neutral-1 hover:text-sgt-primary-1'
                                >
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            ),
        },
    ];

    return (
        <div className='content-index mt-4 select-none'>

            <Collapse
                activeKey={activeKey}
                onChange={() => setActiveKey(activeKey.length === 0 ? ['1'] : [])}
                expandIconPosition="end"
                className={`!bg-white rounded-md ${isClient ? '' : 'hidden'}`}
                items={items}
            />
        </div>
    );
};

export default Index;
