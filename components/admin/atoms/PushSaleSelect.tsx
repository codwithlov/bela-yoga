'use client';
import { Checkbox, Form, Select } from 'antd';
import React from 'react';
import '@/styles/components/loading.scss';
import { IS_PUSH_SALE, NOT_PUSH_SALE } from '@/constants/ui';
import { FormItemProps } from 'antd/lib/form';
import { SelectProps } from 'antd/lib/select';

interface PushSaleSelectProps extends FormItemProps {
    notShowLabel?: boolean;
    className?: string;
    selectProps?: SelectProps<number>;
    checkbox?: boolean;
}

export const PushSaleSelect: React.FC<PushSaleSelectProps> = (props) => {
    const { notShowLabel, className, selectProps, checkbox, ...formItemProps } = props;
    return (
        checkbox ?
            <Form.Item
                name="is_push_sale"
                className={className}
                valuePropName="checked"
                getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? 1 : 0}
                {...formItemProps}
            >
                <Checkbox>Push sale</Checkbox>
            </Form.Item>
            :
            <Form.Item
                name="is_push_sale"
                label={notShowLabel ? '' : 'Push sale'}
                className={className}
                style={{ width: 110 }}
                {...formItemProps}
            >
                <Select
                    placeholder="Push sale"
                    options={[
                        { value: 1, label: IS_PUSH_SALE },
                        { value: 0, label: NOT_PUSH_SALE }
                    ]}
                    {...selectProps}
                    allowClear={notShowLabel}
                />
            </Form.Item>
    );
};
