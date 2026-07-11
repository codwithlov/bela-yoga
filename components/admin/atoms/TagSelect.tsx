'use client';
import { Form, Select } from 'antd';
import React from 'react';
import '@/styles/components/loading.scss';
import { IS_ACTIVE, NOT_ACTIVE } from '@/constants/ui';
import { FormItemProps } from 'antd/lib/form';
import { SelectProps } from 'antd/lib/select';

interface TagSelectProps extends FormItemProps {
    notShowLabel?: boolean;
    className?: string;
    selectProps?: SelectProps<number>;
    tagOptions: any;
    isNotMultiple?: any;
    name?: string;
}

export const TagSelect: React.FC<TagSelectProps> = (props) => {
    const { notShowLabel, className, selectProps, tagOptions, isNotMultiple, name, ...formItemProps } = props;
    return (
        <Form.Item
            name={name || "tags"}
            label={notShowLabel ? '' : 'Tag'}
            className={className}
            {...formItemProps}
        >
            <Select
                placeholder="Chọn tag"
                options={tagOptions}
                {...selectProps}
                allowClear={notShowLabel}
                style={{ minWidth: 200 }}
                mode={isNotMultiple ? undefined : "multiple"}
                optionFilterProp="label"
                popupMatchSelectWidth={false}
                showSearch
            />
        </Form.Item>
    );
};
