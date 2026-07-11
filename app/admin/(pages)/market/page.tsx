'use client';
import React, { Suspense } from 'react';
import AdminMarketList from './components/AdminMarketList';
import "@/styles/detail.scss";
import "@/styles/components/input.scss";

const AdminMarket = () => {
    return (
        <Suspense>
            <AdminMarketList />
        </Suspense>
    )
}

export default AdminMarket