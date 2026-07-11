'use client';

import React, { ReactNode, useState } from 'react';
import { Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TEXT_BTN_ADD } from '@/constants/ui';
import useCheckPermission from '@/hooks/useCheckPermission';
import { ButtonType } from 'antd/lib/button';

type Props = {
    children: (closeDrawer: () => void, open?: boolean) => React.ReactNode;
    title: string;
    width?: string;
    btnText?: string;
    destroyOnHidden?: boolean;
    code?: string;
    type?: ButtonType;
    icon?: ReactNode;
};

const ShowCreateDrawer: React.FC<Props> = ({
    children,
    title,
    width = '80%',
    btnText,
    destroyOnHidden = false,
    code,
    type,
    icon,
}) => {
    const [open, setOpen] = useState(false);
    const closeDrawer = () => { setOpen(false); };
    const checkPermission = useCheckPermission();

    if (code && !checkPermission(code)) {
        return null;
    }
    return (
        <>
            <Button type={type || 'primary'} icon={icon || <PlusOutlined />} onClick={() => setOpen(true)}>
                {btnText || TEXT_BTN_ADD}
            </Button>

            <Drawer
                title={title}
                open={open}
                width={width}
                height={"max-content"}
                footer={null}
                closeIcon={null}
                placement='right'
                onClose={closeDrawer}
                destroyOnHidden={destroyOnHidden}
            >
                {children(closeDrawer, open)}
            </Drawer>
        </>
    );
};

export default ShowCreateDrawer;