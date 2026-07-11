'use client';

import React from 'react';
import useCheckPermission from '@/hooks/useCheckPermission';
import ShowCreateDrawer from '@/components/admin/organisms/ShowCreateDrawer';
import { UnorderedListOutlined } from '@ant-design/icons';
import OrderTree from './OrderTree';

const AdminMarketDisplayOrder: React.FC<any> = ({ slugOptions }) => {
    const checkPermission = useCheckPermission();

    if (!checkPermission('MARKET_UPDATE')) {
        return null;
    }

    return (
        <>
            <ShowCreateDrawer
                title='Thứ tự hiển thị'
                type='default'
                width='1000px'
                btnText='Thứ tự hiển thị'
                icon={<UnorderedListOutlined />}
            >
                {() => (
                    <div className='pt-2'>
                        <OrderTree slugOptions={slugOptions} />
                    </div>
                )}
            </ShowCreateDrawer>
        </>
    );
};

export default AdminMarketDisplayOrder;