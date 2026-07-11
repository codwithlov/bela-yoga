'use client'

import React, { Suspense } from 'react';
import AdminCustomPageManager from './components/AdminCustomPageManager';

const PageManagerPage = () => {
    return (
        <Suspense>
            <AdminCustomPageManager />
        </Suspense>
    );
};

export default PageManagerPage;
