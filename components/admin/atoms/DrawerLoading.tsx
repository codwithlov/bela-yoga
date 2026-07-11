import React from 'react'
import '@/styles/components/loading.scss'
import { AdminLoading } from './Loading';

export const DrawerLoading = (props: any) => {
    return (
        <>
            {
                props.isLoading
                    ?
                    <div className='w-full flex justify-center items-center bg-white'
                        style={{ height: props.height || '75vh' }
                        }
                    >
                        <AdminLoading isLoading={true} fullscreen={false} />
                    </div >
                    :
                    null}
        </>
    )
}