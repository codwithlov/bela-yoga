'use client';
import React, { useEffect, useRef, useState } from 'react';

interface ArticalSectionsProps {
    sections: { title: string; content: any }[];
    isMainSection?: boolean;
}

const ArticalSections: React.FC<ArticalSectionsProps> = ({ sections, isMainSection }) => {

    const [activeSections, setActiveSections] = useState<number[]>([0,1,2,3,4,5,6,7,8]);
    const [activeMenus, setActiveMenus] = useState<number[]>([0,1,2,3,4,5,6,7,8]);
    const isAnimating = useRef(false);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const onClickTitle = (index: number) => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        const isActive = activeSections.includes(index);
        const updatedSections = isActive
            ? activeSections.filter((activeIndex) => activeIndex !== index)
            : [...activeSections, index];

        setActiveSections(updatedSections);
        if (!isActive) setActiveMenus(updatedSections);

        setTimeout(() => {
            isAnimating.current = false;
            if (isActive) setActiveMenus(updatedSections);
        }, 500);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveMenus(isMainSection ? [0] : []);
            setActiveSections(isMainSection ? [0] : []);
        }, 1);

        return () => clearTimeout(timer);
    }, [isMainSection]);

    const contentClass = ' px-4 lg:px-6 bg-white border-l-[3px] border-sgt-primary-2 ';

    return (
        <>
            {sections.map((item, index) => (
                <div key={index}>
                    {activeMenus.includes(index) ? (
                        <div className={contentClass}>
                            <div className='pt-3.5 pb-2 flex justify-between items-center cursor-pointer select-none' onClick={() => onClickTitle(index)}>
                                <h3 className='text-body-1 lg:text-sub-1 text-sgt-secondary-1 w-5/6'>{item.title}</h3>
                                <div
                                    className='bg-sgt-neutral-3 w-5 h-5'
                                    style={{
                                        mask: 'url("/assets/icons/chevron-up.svg")',
                                        maskSize: 'cover',
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            className='border-l-[3px] border-l-transparent border-b-[1px] px-4 lg:px-6 border-sgt-neutral-5 flex justify-between cursor-pointer select-none'
                            onClick={() => onClickTitle(index)}
                        >
                            <h3 className='text-button lg:text-sub-1 text-sgt-neutral-3 mt-3.5 mb-3 w-5/6'>
                                {item.title}
                            </h3>
                            <div
                                className='bg-sgt-neutral-3 w-5 h-5 max-lg:self-center lg:mt-2'
                                style={{
                                    mask: 'url("/assets/icons/chevron-down.svg")',
                                    maskSize: 'cover',
                                }}
                            />
                        </div>
                    )}
                    <div
                        className={`overflow-hidden duration-500 ease-in-out ${contentClass}`}
                        style={{
                            maxHeight: sectionRefs.current?.[index]
                                ? activeSections.includes(index)
                                    ? `${Math.max(2000, sectionRefs.current[index].scrollHeight)}px`
                                    : 0
                                : undefined,
                        }}
                    >
                        <div ref={el => {
                            sectionRefs.current[index] = el;
                        }}>
                            <SectionContent content={item.content} />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ArticalSections;

const SectionContent = React.memo(({ content }: { content: string }) => (
    <div dangerouslySetInnerHTML={{ __html: content || 'Chưa có thông tin' }} className='ck-content pl-2.5 lg:pl-3 pr-6 pb-1 overflow-hidden' />
));
SectionContent.displayName = "SectionContent";

