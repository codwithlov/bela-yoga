import React from 'react';

type Column<T> = {
    key: string;
    title: string;
    render: (row: T) => React.ReactNode;
    className?: string;
};

type AdminDataTableProps<T> = {
    title: string;
    description?: string;
    columns: Column<T>[];
    rows: T[];
    emptyMessage: string;
};

const AdminDataTable = <T,>({ title, description, columns, rows, emptyMessage }: AdminDataTableProps<T>) => {
    return (
        <div className='rounded-2xl border border-bela-gray-2 bg-white shadow-sm'>
            <div className='border-b border-bela-gray-2 px-6 py-5'>
                <h2 className='text-lg font-bold text-bela-secondary-2'>{title}</h2>
                {description ? <p className='mt-2 text-sm leading-6 text-bela-neutral-3'>{description}</p> : null}
            </div>
            {rows.length > 0 ? (
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-bela-gray-2'>
                        <thead className='bg-bela-bg-primary'>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key} className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-bela-primary-1 ${column.className || ''}`}>
                                        {column.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-bela-gray-2'>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className='align-top'>
                                    {columns.map((column) => (
                                        <td key={column.key} className={`px-6 py-4 text-sm text-bela-neutral-3 ${column.className || ''}`}>
                                            {column.render(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='px-6 py-8 text-sm text-bela-neutral-3'>{emptyMessage}</div>
            )}
        </div>
    );
};

export default AdminDataTable;
