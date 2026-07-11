import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function AdminPagesLoading() {
    return (
        <div className='flex min-h-[calc(100vh-140px)] items-center justify-center rounded-2xl bg-white/70'>
            <div className='flex flex-col items-center gap-4 text-center'>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} className='text-sgt-primary-default' spin />} />
                <div>
                    <div className='text-sm font-semibold text-sgt-secondary-2'>Đang tải nội dung quản trị</div>
                    <div className='text-xs text-sgt-neutral-3'>Vui lòng chờ trong giây lát...</div>
                </div>
            </div>
        </div>
    );
}