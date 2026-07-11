'use client'
import React, { Suspense } from 'react'
import AdminBookingList from './components/AdminBookingList'
const AdminBooking = () => {
    return (
        <Suspense>
            <AdminBookingList />
        </Suspense>
    )
}

export default AdminBooking
