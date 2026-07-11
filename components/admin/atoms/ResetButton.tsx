'use client';
import { Button, Form } from 'antd'
import React from 'react'
import '@/styles/components/loading.scss'
import { ReloadOutlined } from '@ant-design/icons';

export const ResetButton = (props: any) => {
    return (
        <Button
            icon={<ReloadOutlined />}
            onClick={props.onClick}
        >
            {/* Reset */}
        </Button>
    )
}
