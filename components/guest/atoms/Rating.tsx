const Rating = ({ rating, className = '', small = false }: { rating: any, className?: string, small?: boolean }) => (
    <div className={className + ' flex '}>
        {[...Array(5)].map((_, index) => (
            <div
                key={index}
                className={`${small ? 'w-[0.7rem] lg:w-[0.8rem] mr-1' : 'w-[13px] lg:w-3.5 mr-1'} aspect-1/1
                ${index < Number(rating) ? 'bg-sgt-primary-2' : 'bg-gray-300'
                    }`}
                style={{
                    mask: 'url("/assets/icons/star.svg")',
                    maskSize: 'cover',
                }}
            />
        ))}
    </div>
);
export default Rating