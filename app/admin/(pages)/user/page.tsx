'use client'
import React, { Suspense } from 'react'
import AdminUserList from './components/AdminUserList'

const AdminUser = () => {
    return (
        <Suspense>
            <AdminUserList />
        </Suspense>
    )
}

export default AdminUser
