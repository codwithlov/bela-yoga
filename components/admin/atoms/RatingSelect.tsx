
'use client';
import { Form, Select } from 'antd'
import React from 'react'
import '@/styles/components/loading.scss'

export const RatingSelect = ({ className = '' }: any) => {
    return (
        <Form.Item name="rating" label="Đánh giá" className={className}>
            <Select
                options={[
                    { value: 1, label: '1 sao' },
                    { value: 2, label: '2 sao' },
                    { value: 3, label: '3 sao' },
                    { value: 4, label: '4 sao' },
                    { value: 5, label: '5 sao' },
                ]}
            />
        </Form.Item>
    )
}
