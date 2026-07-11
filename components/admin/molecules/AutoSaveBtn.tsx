'use client';

import { useState } from "react";
import { Button, Popover } from "antd";
import { ClockCircleOutlined, RollbackOutlined } from '@ant-design/icons';

interface ActionProps {
    name: string;
    rollbackFunc: (data: any) => void;
    isDraft: any;
}

const AutoSaveBtn: React.FC<ActionProps> = ({ name, rollbackFunc, isDraft }) => {
    const [savedPosts, setSavedPosts] = useState<any[]>([]);

    const handleOpenChange = (visible: boolean) => {
        if (visible) {
            const existingData = localStorage.getItem(name);
            const parsedData = existingData ? JSON.parse(existingData) : [];
            setSavedPosts(parsedData.reverse());
        }
    };

    const handleRollback = (item: any) => {
        rollbackFunc(item);
    };

    const content = (

        <div className="max-h-60 overflow-y-auto custom-scrollbar">
            <p className="text-sm text-red-600">Chỉ lưu 3 bản gần nhất</p>
            {savedPosts.length > 0 ? (
                savedPosts.map((item, index) => (
                    <div
                        key={index}
                        className="p-2 border-b flex items-center justify-between"
                    >
                        <p className="text-sm">{item.autoSaveTime}</p>
                        <Button
                            icon={<RollbackOutlined />}
                            size="small"
                            onClick={() => handleRollback(item)}
                        />
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">Không có bản lưu nào</p>
            )}
        </div>
    );

    if (isDraft) return null;

    return (
        <div className="fixed top-2 right-6 z-[1111] cursor-pointer hover:text-blue-500">
            <Popover
                content={content}
                title="Bản lưu tự động"
                trigger="hover"
                placement="left"
                onOpenChange={handleOpenChange}
            >
                <div className="flex items-center gap-1">
                    <Button
                        shape="circle"
                        icon={<ClockCircleOutlined />}
                    />
                    <div>Bản lưu tự động</div>
                </div>
            </Popover>
        </div>
    );
};

export default AutoSaveBtn;
