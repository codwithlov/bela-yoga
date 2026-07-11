type AdminTemplatePlaceholderProps = {
    moduleName: string;
    description: string;
};

const AdminTemplatePlaceholder: React.FC<AdminTemplatePlaceholderProps> = ({ moduleName, description }) => {
    return (
        <div className='space-y-4'>
            <div className='rounded-2xl border border-sgt-gray-2 bg-white p-6 shadow-sm'>
                <div className='text-xs font-semibold uppercase tracking-[0.2em] text-sgt-primary-1'>Template cleanup</div>
                <h1 className='mt-3 text-2xl font-bold text-sgt-secondary-2'>{moduleName}</h1>
                <p className='mt-3 max-w-4xl text-sm leading-7 text-sgt-neutral-3'>{description}</p>
            </div>
            <div className='rounded-2xl border border-dashed border-sgt-gray-2 bg-white p-5 text-sm leading-7 text-sgt-neutral-3'>
                Module legacy theo travel stack đã được tách khỏi luồng template CMS mặc định. Khi cần cho một dự án cụ thể, có thể thay trang này bằng module domain riêng mà không ảnh hưởng bộ khung template hiện tại.
            </div>
        </div>
    );
};

export default AdminTemplatePlaceholder;
