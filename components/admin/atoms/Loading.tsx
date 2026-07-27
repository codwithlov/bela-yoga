import { ConfigProvider, Spin } from 'antd'
import { LoadingOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import React from 'react'
import '@/styles/components/loading.scss'

const contentStyle: React.CSSProperties = {
    zIndex: 9999
};

export const AdminLoading = (props: any) => {
    const { isLoading, fullscreen = true } = props;
    return (

        <ConfigProvider
            theme={{
                token: {
                    zIndexPopupBase: 9999
                },
            }}
        >
            <Spin
                className='bela-ant-spin-fullcreen'
                spinning={isLoading}
                fullscreen={fullscreen}
                indicator={<LoadingOutlined className='!text-bela-primary-default' style={{ fontSize: 48 }} />}
            >
            </Spin>
        </ConfigProvider>


    )
}

export const AdminLoadingMini = (props: any) => {
    return (
        <>
            <div className={`loading-mini-wrap`}>
                <div className={`loading-mini bg-bela-primary-default h-5 w-5 rounded-full ${props.className ?? ''}`}></div>
                <div className={`loading-mini bg-bela-primary-default h-5 w-5 rounded-full ${props.className ?? ''}`}></div>
                <div className={`loading-mini bg-bela-primary-default h-5 w-5 rounded-full ${props.className ?? ''}`}></div>
                <div className={`loading-mini bg-bela-primary-default h-5 w-5 rounded-full ${props.className ?? ''}`}></div>
            </div>
        </>
    )
}