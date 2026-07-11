'use client'
import React, { Suspense } from 'react'
import AdminMenuManager from './components/AdminMenuManager'
const MenuManager = () => {
    return (
        <Suspense>
            <AdminMenuManager />
        </Suspense>
    )
}

export default MenuManager
