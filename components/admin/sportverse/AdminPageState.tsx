const AdminPageState: React.FC<{ message: string }> = ({ message }) => (
    <div className='rounded-2xl border border-dashed border-bela-gray-2 bg-white px-6 py-10 text-sm text-bela-neutral-3 shadow-sm'>
        {message}
    </div>
);

export default AdminPageState;
