'use client';
import { Form, Select } from 'antd'
import React, { useMemo } from 'react'
import '@/styles/components/loading.scss'
import { formatSelectArray } from '@/utils/helper';

export const SlugPrefixSelect = (props: any) => {
    const { slugs, className, onChange = () => { }, name, label, rules } = props
    const slugOptions = useMemo(() => {
        return formatSelectArray(slugs, 'id', 'slug')
    }, [slugs]);

    return (
        <Form.Item name={name || "parent_id"} label={label || "Đường dẫn"} className={className} rules={rules}>
            <Select
                options={slugOptions}
                placeholder="Chọn đường dẫn"
                loading={slugOptions.length === 0}
                showSearch
                optionFilterProp="label"
                allowClear
                onChange={onChange}
                dropdownStyle={{ minWidth: 500 }}
            />
        </Form.Item>
    )
}
