type AdminPageHeaderProps = {
    eyebrow: string;
    title: string;
    description: string;
    badges?: string[];
};

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ eyebrow, title, description, badges = [] }) => {
    return (
        <div className='rounded-2xl border border-sgt-gray-2 bg-white p-6 shadow-sm'>
            <div className='text-xs font-semibold uppercase tracking-[0.2em] text-sgt-primary-1'>{eyebrow}</div>
            <h1 className='mt-3 text-2xl font-bold text-sgt-secondary-2 md:text-3xl'>{title}</h1>
            <p className='mt-3 max-w-4xl text-sm leading-7 text-sgt-neutral-3'>{description}</p>
            {badges.length > 0 ? (
                <div className='mt-4 flex flex-wrap gap-3'>
                    {badges.map((badge) => (
                        <span key={badge} className='rounded-full bg-sgt-bg-primary px-4 py-2 text-xs font-semibold text-sgt-primary-1'>
                            {badge}
                        </span>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default AdminPageHeader;
