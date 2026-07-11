'use client'
import LoginRegisterForm from '@/components/general/organisms/LoginRegisterForm'
import React from 'react'

function LoginAdmin() {
  return (
    <div className='w-full h-full flex items-center justify-center bg-slate-50'>
      <div className='mt-5 bg-white shadow-lg rounded-2xl p-10 w-[450px]'>
        <LoginRegisterForm fromAdmin={true} modalType='login' />
      </div>
    </div>
  )
}

export default LoginAdmin