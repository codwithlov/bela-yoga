'use client'
import React, { Suspense } from 'react'
import AdminRoleList from './components/AdminRoleList'

const AdminRole = () => {
    return (
        <Suspense>
            <AdminRoleList />
        </Suspense>
    )
}

export default AdminRole
