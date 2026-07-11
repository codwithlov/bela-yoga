'use client';
import { Checkbox, Form, Select } from 'antd';
import React from 'react';
import '@/styles/components/loading.scss';
import { IS_ACTIVE, NOT_ACTIVE } from '@/constants/ui';
import { FormItemProps } from 'antd/lib/form';
import { SelectProps } from 'antd/lib/select';

interface ActiveSelectProps extends FormItemProps {
    notShowLabel?: boolean;
    className?: string;
    selectProps?: SelectProps<number>;
    checkbox?: boolean;
}

export const ActiveSelect: React.FC<ActiveSelectProps> = (props) => {
    const { notShowLabel, className, selectProps, checkbox, ...formItemProps } = props;
    return (
        checkbox ?
            <Form.Item
                name="is_active"
                className={className}
                valuePropName="checked"
                getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? 1 : 0}
                {...formItemProps}
            >
                <Checkbox>{IS_ACTIVE}</Checkbox>
            </Form.Item>
            :
            <Form.Item
                name="is_active"
                label={notShowLabel ? '' : 'Hiển thị'}
                className={className}
                {...formItemProps}
            >
                <Select
                    placeholder="Chọn trạng thái"
                    options={[
                        { value: 1, label: IS_ACTIVE },
                        { value: 0, label: NOT_ACTIVE }
                    ]}
                    {...selectProps}
                    allowClear={notShowLabel}
                    style={{ minWidth: 210 }}
                />
            </Form.Item>
    );
};
