'use client'

import React, { Suspense } from 'react';
import AdminOrganizationsList from './components/AdminOrganizationsList';

const AdminOrganizationsPage = () => {
    return (
        <Suspense>
            <AdminOrganizationsList />
        </Suspense>
    );
};

export default AdminOrganizationsPage;
