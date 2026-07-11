'use client';

import Image from 'next/image';
import { useMemo } from 'react';

interface AvatarProps {
    src?: string;
    className?: string;
    name?: string;
}

const bgColors = [
    '#F44336', '#E91E63', '#9C27B0', '#3F51B5',
    '#03A9F4', '#009688', '#4CAF50', '#FF9800',
    '#795548', '#607D8B'
];

function stringToColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % bgColors.length;
    return bgColors[index];
}

const Avatar: React.FC<AvatarProps> = ({ src, className = '', name = '' }) => {
    const useFallback = name && !src;
    const fallbackLetter = name?.charAt(0).toUpperCase() || 'U';
    const bgColor = useMemo(() => stringToColor(name), [name]);
    const defaultAvatar = "/assets/icons/default-avatar.svg";
    const avatarClass = "w-10 lg:w-[2.8125rem] h-10 lg:h-[2.8125rem] bg-sgt-primary-3 rounded-full flex items-end justify-center overflow-hidden ";

    return (
        <div className={avatarClass + className} style={{ backgroundColor: useFallback ? bgColor : undefined }}>
            {!useFallback ? (
                <Image
                    src={src || defaultAvatar}
                    alt='avatar'
                    width={45}
                    height={45}
                    priority={true}
                    sizes='100vw'
                    className={src ? 'object-cover w-full h-full' : 'w-4/5 aspect-1/1 -mb-[1px]'}
                />
            ) : (
                <span className="text-white font-bold self-center text-xl leading-none">{fallbackLetter}</span>
            )}
        </div>
    );
};

export default Avatar;
