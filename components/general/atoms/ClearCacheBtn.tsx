
import useCheckPermission from '@/hooks/useCheckPermission';
import { showSuccessToastr } from '@/utils/toastr';
import { Button } from 'antd';
import React from 'react';

const ClearCacheBtn: React.FC<any> = () => {
    const checkPermission = useCheckPermission();
    const handleClearCacheClick = () => {
        window.open('/?clearCache=true', '_blank');
        showSuccessToastr('Xóa cache thành công');
    };

    if (!checkPermission('USER_LIST')) {
        return null;
    }
    return (
        <Button onClick={handleClearCacheClick}>
            Xóa Cache
        </Button>
    );
};

export default ClearCacheBtn;
