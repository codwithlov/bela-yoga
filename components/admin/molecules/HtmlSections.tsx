'use client';
import { Collapse, CollapseProps } from "antd";
import React from "react";

interface Section {
    title: string;
    content: string;
}

interface ActionProps {
    sections: Section[];
}

const HtmlSections = (props: ActionProps) => {
    const { sections } = props;

    const items: CollapseProps['items'] = sections.map((item, index) => ({
        key: index,
        label: item.title,
        children: (
            <div key={item.title} dangerouslySetInnerHTML={{ __html: item.content }} className='ck-content text-sgt-neutral-1 overflow-hidden' />
        ),
    }));

    return (
        <Collapse items={items} />
    );
}

export default HtmlSections;
