'use client'
import React, { Suspense } from 'react'
import AdminOverview from './components/AdminOverview'
const Overview = () => {
    return (
        <Suspense>
            <AdminOverview />
        </Suspense>
    )
}

export default Overview
