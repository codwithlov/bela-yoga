
'use client'
import React from 'react';
import { Checkbox, Form } from 'antd';

interface Props {
    label: string;
    name: string;
    className?: string;
    disabled?: boolean;
}

const FormItemCheckbox = (props: Props) => {
    const { label, name, className, disabled } = props;
    return (
        <Form.Item
            name={name}
            valuePropName="checked"
            className={className}
            getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? 1 : 0}
        >
            <Checkbox disabled={disabled}>{label}</Checkbox>
        </Form.Item>
    )
}

export default FormItemCheckbox




