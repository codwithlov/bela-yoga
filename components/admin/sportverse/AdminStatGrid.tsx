type StatItem = {
    label: string;
    value: string | number;
    hint?: string;
};

const AdminStatGrid: React.FC<{ items: StatItem[] }> = ({ items }) => {
    return (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
            {items.map((item) => (
                <div key={item.label} className='rounded-2xl border border-bela-gray-2 bg-white p-5 shadow-sm'>
                    <div className='text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1'>{item.label}</div>
                    <div className='mt-3 text-3xl font-bold text-bela-secondary-2'>{item.value}</div>
                    {item.hint ? <div className='mt-2 text-sm text-bela-neutral-3'>{item.hint}</div> : null}
                </div>
            ))}
        </div>
    );
};

export default AdminStatGrid;
