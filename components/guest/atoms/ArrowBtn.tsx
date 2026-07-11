import Image from "next/image";
import { memo } from "react";
import type { FC, MouseEventHandler } from "react";

type NavButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    direction?: 'left' | 'right';
    disabled?: boolean;
    className?: string;
};

const NavButton: FC<NavButtonProps> = memo(({ onClick, direction = 'left', disabled = false, className = '' }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`absolute transform -translate-y-1/2 w-10 h-10 z-20 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            aria-label={`${direction} navigation button`}
        >
            <Image
                src="/assets/icons/banner-slider-arrow.svg"
                alt="Slider arrow"
                width={40}
                height={40}
                className={direction === 'right' ? 'rotate-180' : ''}
            />
        </button>
    );
});

NavButton.displayName = 'NavButton';

export default NavButton;
