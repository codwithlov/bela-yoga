'use client';
import { Button, Form } from 'antd'
import React from 'react'
import '@/styles/components/loading.scss'
import { SearchOutlined } from '@ant-design/icons';

export const SearchButton = () => {
    return (
        <Form.Item>
            <Button type={'primary'} icon={<SearchOutlined />} htmlType='submit'>
                Search
            </Button>
        </Form.Item>
    )
}
