import React from 'react'
import "@/styles/admin.scss";
import StoreProvider from '@/store/StoreProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'ckeditor5/ckeditor5.css';
import "@/styles/components/ck-content.scss";
function AdminLayout(
  { children }: {
    children: React.ReactNode;
  }) {
  return (
    <>
      <div
        className='rt_admin_main'
      > <StoreProvider>
          {children}
        </StoreProvider>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      // transition:Bounce
      />
    </>

  )
}

export default AdminLayout