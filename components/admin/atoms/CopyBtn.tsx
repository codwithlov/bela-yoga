'use client';

import { Button } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

type Props = {
    text: string;
};

const CopyBtn: React.FC<Props> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <Button
            type="text"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            size="small"
        />
    );
};

export default CopyBtn;
