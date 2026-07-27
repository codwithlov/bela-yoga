'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { addHeadingIdsForContent, extractHeadings, parseContent } from '@/utils/htmlUtils';
import HtmlSections from '../molecules/HtmlSections';

type TabContent = {
    key: string;
    label: string;
    content: string;
    showSummary?: boolean;
    showSection?: boolean;
};

type Props = {
    btnText?: string;
    htmlContent?: string;
    width?: number | string;
    multiple?: boolean;
    tabContents?: TabContent[];
    title?: string;
    articleMenu?: any;
};

type Heading = {
    tagName: string;
    text: string | null;
    id: string;
};

const HtmlContent: React.FC<Props> = ({
    htmlContent = '',
    multiple = false,
    tabContents = [],
    articleMenu,
}) => {
    const drawerContainerRef = useRef<HTMLDivElement>(null);
    const textSizes = ['xl', 'lg', 'base', 'sm', 'xs', 'xs', 'xs'];
    const weights = ['medium', 'normal', 'light', 'extralight', 'extralight', 'extralight'];

    // Component to render a menu of headings for easy navigation
    const HeadingMenu = ({ content }: { content: string }) => {
        const [headings, setHeadings] = useState<Heading[]>([]);
        const [activeHeading, setActiveHeading] = useState<number>(0);
        const menuHeight = 110;

        useEffect(() => {
            setHeadings(extractHeadings(content));
        }, [content]);

        useEffect(() => {
            const handleScroll = () => {
                const drawer = drawerContainerRef.current;
                if (drawer) {
                    let visibleHeading: number | null = null;
                    for (let index = 0; index < headings.length; index++) {
                        const targetElement = document.getElementById(headings[index].id);
                        if (targetElement) {
                            const rect = targetElement.getBoundingClientRect();
                            const elementTop = rect.top + drawer.scrollTop - menuHeight;

                            if (elementTop <= drawer.scrollTop) {
                                visibleHeading = index;
                            } else {
                                break;
                            }
                        }
                    }
                    if (visibleHeading !== null) {
                        setActiveHeading(visibleHeading);
                    }
                }
            };

            const drawer = drawerContainerRef.current;
            handleScroll();
            drawer?.addEventListener('scroll', handleScroll);

            return () => {
                drawer?.removeEventListener('scroll', handleScroll);
            };
        }, [headings]);

        const handleScrollToHeading = (e: React.MouseEvent, headingId: string) => {
            e.preventDefault();
            const targetElement = document.getElementById(headingId);

            if (targetElement && drawerContainerRef.current) {
                const drawer = drawerContainerRef.current;
                const elementRect = targetElement.getBoundingClientRect();
                const offsetTop = elementRect.top + drawer.scrollTop - menuHeight + 5;

                drawer.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        };

        const getHeadingClass = (tagName: string) => {
            const headingNumber = parseInt(tagName[1]) - 1;
            const marginStyle = { marginLeft: `${headingNumber * 10}px` };
            return { marginStyle, className: `text-${textSizes[headingNumber]} font-${weights[headingNumber]}` };
        };

        return (
            headings.length === 0 ?
                null :
                <div>
                    <div className="w-64" />
                    <nav className="w-64 p-1 fixed overflow-y-auto custom-scrollbar" style={{ height: `calc(100vh - 120px)` }}>
                        {headings.map((heading, index) => (
                            <li key={index}>
                                <p
                                    style={getHeadingClass(heading.tagName).marginStyle}
                                    className={
                                        'whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:text-bela-primary-1' +
                                        ` ${getHeadingClass(heading.tagName).className} ${activeHeading === index ? 'text-bela-primary-1' : ''}`
                                    }
                                    onClick={(e) => handleScrollToHeading(e, heading.id)}
                                >
                                    {heading.text}
                                </p>
                            </li>
                        ))}
                    </nav>
                </div>
        );
    };

    const ContentContainer: React.FC<{ content?: any, showSummary?: any, children: React.ReactNode }> = ({ children, showSummary, content }) => {
        return (
            <div className="flex-1 justify-center bg-bela-bg-primary mb-2 flex pb-2">
                {showSummary && <HeadingMenu content={content} />}
                {articleMenu && articleMenu}
                <div className="w-[800px] p-2 bg-white overflow-hidden" style={{ minHeight: `calc(100vh - 120px)` }}>
                    {children}
                </div>
            </div>
        );
    };

    // Component to render the content inside the drawer
    const ChildrenContent = ({ content, showSummary }: { content: string; showSummary?: any }) => {
        return (
            <ContentContainer showSummary={showSummary} content={content}>
                <div dangerouslySetInnerHTML={{ __html: content || '' }} className='ck-content text-bela-neutral-1' />
            </ContentContainer>
        );
    };

    // Create tabs for the drawer based on the provided tabContents
    const tabItems = tabContents.map(({ key, label, content, showSummary, showSection }: TabContent) => {
        const editedContent = addHeadingIdsForContent(content);
        const sections = showSection ? parseContent(content) : [];

        let children;
        if (showSection) {
            children =
                <ContentContainer>
                    {sections.length === 0 ? null :
                        <HtmlSections sections={sections} />
                    }
                </ContentContainer>;
        } else {
            children = <ChildrenContent content={editedContent} showSummary={showSummary} />;
        }

        return {
            key,
            label,
            children,
        };
    });

    return (
        <div ref={drawerContainerRef} className="h-full overflow-auto">
            {!multiple ?
                <ChildrenContent content={htmlContent} />
                :
                <Tabs items={tabItems} centered className='stick-tabs' />
            }
        </div>
    );
};

export default HtmlContent;