'use client'
import React, { Suspense } from 'react'
import AdminPostList from './components/AdminPostList'

const AdminPost = () => {
    return (
        <Suspense>
            <AdminPostList />
        </Suspense>
    )
}

export default AdminPost
