'use client'

import React, { Suspense } from 'react';
import AdminVenuesList from './components/AdminVenuesList';

const AdminVenuesPage = () => {
    return (
        <Suspense>
            <AdminVenuesList />
        </Suspense>
    );
};

export default AdminVenuesPage;
