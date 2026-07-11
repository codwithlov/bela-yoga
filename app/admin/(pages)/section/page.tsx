'use client'
import React, { Suspense } from 'react'
import AdminSectionManager from './components/AdminSectionManager'

const SectionManager = () => {
    return (
        <Suspense>
            <AdminSectionManager />
        </Suspense>
    )
}

export default SectionManager