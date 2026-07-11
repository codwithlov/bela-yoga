'use client';

import React from 'react';
import useCheckPermission from '@/hooks/useCheckPermission';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import { UnorderedListOutlined } from '@ant-design/icons';
import OrderTree from './OrderTree';

const AdminDisplayOrder: React.FC<{ type: string }> = ({ type }) => {
    const checkPermission = useCheckPermission();

    if (!checkPermission(type.slice(0, -1) + '_UPDATE')) {
        return null;
    }

    return (
        <>
            <ShowCreateDrawer
                title='Thứ tự hiển thị'
                type='default'
                width='500px'
                btnText='Thứ tự hiển thị'
                icon={<UnorderedListOutlined />}
            >
                {() => (
                    <div className='pt-2'>
                        <OrderTree type={type} />
                    </div>
                )}
            </ShowCreateDrawer>
        </>
    );
};

export default AdminDisplayOrder;