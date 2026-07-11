import React, { useMemo, useState } from 'react';
import { EyeOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import { getTabContents } from '@/utils/helper';
import { marketCkeditorTabFields } from '@/constants/ui';
import HtmlContent from '@/components/admin/organisms/HtmlContent';

interface OtherInfoMenuProps {
    otherInfoList: OtherInfoItem[];
    selectedKey: number;
    className?: string;
    setSelectedKey: (key: number) => void;
    confirmDelete?: (index: number) => void;
    openDatesDrawer?: any;
    getFormValue?: (key: string, index: number) => any;
}

interface OtherInfoItem {
    tour_ids?: string[];
}

interface ModalContents {
    [key: string]: any;
}

const OtherInfoMenu: React.FC<OtherInfoMenuProps> = ({
    otherInfoList,
    selectedKey,
    className = '',
    setSelectedKey,
    confirmDelete,
    getFormValue,
    openDatesDrawer,
}) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalContents, setModalContents] = useState<ModalContents>({});

    const defaultText = 'Bài viết mặc định';

    const items = useMemo(() => {
        return (otherInfoList || []).map((item, index) => ({
            key: index,
            label: !item.tour_ids || item.tour_ids.length === 0 ? defaultText : 'Bài viết ' + index,
            style: { borderInlineEnd: 'none' },
        }));
    }, [otherInfoList]);

    const handleDelete = (e: React.MouseEvent, otherInfoIndex: number) => {
        e.stopPropagation();
        confirmDelete?.(otherInfoIndex);
    };

    const handleView = (e: React.MouseEvent, otherInfoIndex: number) => {
        e.stopPropagation();
        const contents = marketCkeditorTabFields.reduce((acc: ModalContents, field) => {
            acc[field.key] = getFormValue?.(field.key, otherInfoIndex);
            return acc;
        }, {});
        setModalContents(contents);
        setOpenModal(true);
    };

    return (
        <div
            className={className + 'bg-white overflow-auto custom-scrollbar rounded-lg shadow-sm '}
            style={{ maxHeight: `calc(100vh - 320px)` }}
        >
            <div className="p-2">
                {items.map(item => (
                    <div
                        key={item.key}
                        className={`flex items-center px-3 h-9 cursor-pointer rounded-lg justify-between mb-1 
                                ${selectedKey === item.key ? 'bg-blue-100' : 'hover:bg-gray-100'
                            }`}
                        onClick={() => setSelectedKey(item.key)}
                    >
                        <div className='leading-none'>
                            {getFormValue && (
                                <span className="mr-2" onClick={(e) => handleView(e, item.key)}>
                                    <EyeOutlined />
                                </span>
                            )}
                            {item.label}
                        </div>
                        <div>
                            {item.label !== defaultText && openDatesDrawer && (
                                <span className="mr-2" onClick={openDatesDrawer}>
                                    <CalendarOutlined className="!text-blue-600" />
                                </span>
                            )}
                            {item.label !== defaultText && confirmDelete && (
                                <span className="mr-2" onClick={(e) => handleDelete(e, item.key)}>
                                    <DeleteOutlined className="!text-red-600" />
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Drawer
                title=""
                open={openModal}
                width="80%"
                height="max-content"
                footer={null}
                closeIcon={null}
                className="sgt_drawer sgt_drawer_tour_detail custom-scrollbar"
                placement="right"
                destroyOnHidden
                onClose={() => setOpenModal(false)}
            >
                <HtmlContent
                    multiple={true}
                    tabContents={getTabContents(modalContents, marketCkeditorTabFields)}
                />
            </Drawer>
        </div>
    );
};

export default OtherInfoMenu;
