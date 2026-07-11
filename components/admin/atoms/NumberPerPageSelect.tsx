'use client';
import { Form, Select } from 'antd'
import React from 'react'
import '@/styles/components/loading.scss'

export const NumberPerPageSelect = (props: any) => {
    const { setParam, setPage, className, firstValue = 10 } = props
    const onChange = (value: any) => {
        setParam((previousValue: any) => ({
            ...previousValue,
            limit: value,
            page: 1,
        }));
        setPage(1);
    };
    return (
        <Form.Item name="limit" className={className}>
            <Select
                options={[
                    { value: firstValue },
                    { value: firstValue * 2 },
                    { value: firstValue * 3 },
                    { value: firstValue * 4 },
                    { value: firstValue * 5 },
                ]}
                onChange={onChange}
            >
            </Select>
        </Form.Item>
    )
}
