'use client';
import React from 'react'
import { Col, Form, Input, Row } from 'antd'
import { ActiveSelect } from '@/components/admin/atoms/ActiveSelect';
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';
import { TagSelect } from '@/components/admin/atoms/TagSelect';

type Params = {
    slugs: any,
    tagOptions: any,
    updateCanonical: any,
}
const AdminNationBaseFields: React.FC<Params> = ({ slugs, updateCanonical, tagOptions }) => {

    return (
        <Row gutter={12}>
            <Col span={12}>
                <SlugPrefixSelect slugs={slugs} onChange={updateCanonical} />
            </Col>
            <Col span={12}>
                <Form.Item name="nation_slug" label="Slug" rules={[{ required: true }]}>
                    <Input onChange={updateCanonical} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <TagSelect tagOptions={tagOptions} />
            </Col>
            <Col span={12}>
                <ActiveSelect />
            </Col>
        </Row>
    )
}

export default AdminNationBaseFields

