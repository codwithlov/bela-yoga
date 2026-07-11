'use client';

const SubmitButton = ({ text }: { text: string }) => {
    return (
        <button
            className='py-4 flex items-center justify-center rounded-md bg-sgt-primary-2 w-full mt-8'
            type='submit'
        >
            <p className='text-sm font-medium'>
                {text}
            </p>
        </button>
    );
};

export default SubmitButton;
