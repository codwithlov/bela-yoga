'use client';

import { Popover, List, Typography } from 'antd';
import React from 'react';
import CopyBtn from '../atoms/CopyBtn';
import { trimText } from '@/utils/formatString';

const { Text } = Typography;

type Props = {
    anchorList: {
        text: string;
        href: string;
    }[];
    title: string;
};

const LinkList: React.FC<Props> = ({ anchorList, title }) => {
    return (
        <Popover
            content={
                <div className='max-h-[400px] overflow-auto custom-scrollbar'>
                    <List
                        size="small"
                        dataSource={anchorList}
                        renderItem={(item) => (
                            <List.Item className="flex flex-col !items-start">
                                <div className="flex items-center gap-2">
                                    <Text>{trimText(item.text, 55)}</Text>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-2">
                                    <Text type="secondary" className="text-xs">
                                        {trimText(item.href, 55)}
                                    </Text>
                                    <CopyBtn text={item.href} />
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            }
            title={title}
            trigger="hover"
            className="p-2"
            placement="left"
        >
            <a className="cursor-pointer text-blue-500 hover:underline">{anchorList.length} links</a>
        </Popover>
    );
};

export default LinkList;
