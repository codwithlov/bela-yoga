'use client';

import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import HtmlContent from './HtmlContent';

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

const ShowHtmlContentDrawer: React.FC<Props> = ({
    width = "90%",
    btnText = "Bài viết",
    htmlContent = '',
    multiple = false,
    tabContents = [],
    title = '',
}) => {
    const [open, setOpen] = useState(false);
    const closeModal = () => { setOpen(false); };
    const checkContent = tabContents.some((item) => item.content);
    return (
        <>
            {htmlContent || checkContent ?
                <Button icon={<EyeOutlined />} onClick={() => setOpen(true)}>
                    {btnText}
                </Button>
                :
                <p>Chưa có</p>
            }

            <Drawer
                title={title}
                open={open}
                width={width}
                height={"max-content"}
                footer={null}
                closeIcon={null}
                className="sgt_drawer sgt_drawer_tour_detail custom-scrollbar"
                placement='right'
                destroyOnHidden
                onClose={closeModal}
            >
                <HtmlContent htmlContent={htmlContent} multiple={multiple} tabContents={tabContents} />
            </Drawer>
        </>
    );
};

export default ShowHtmlContentDrawer;
