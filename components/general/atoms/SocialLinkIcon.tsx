'use client'
import React, { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

export interface SocialLinkProps {
  href: string;
  isShareLink?: boolean;
  target?: string;
  isUseImg?: boolean;
  icon?: IconProp;
  nameImg?: string;
  alt?: string;
  style?: object;
  styleImg?: object;
  ariaLabel?: string; //facebook, twitter, youtube...
  className?: string;
  iconClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const SocialLinkIcon: React.FC<SocialLinkProps> = ({
  href,
  isShareLink = false,
  target = '_blank',
  isUseImg = false,
  icon = ['fab', 'phone'],
  nameImg,
  alt,
  style = {},
  styleImg,
  ariaLabel,
  className,
  iconClassName,
  onClick,
}) => {
  //Dùng trong trường hợp chờ load AuthorInfo
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }

  let srcLink = '';
  const socialPlatforms: { [key: string]: string } = {
    facebook: `https://www.facebook.com/sharer.php?u=${href}`,
    twitter: `https://twitter.com/share?url=${href}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${href}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${href}`,
  };

  srcLink = isShareLink ? socialPlatforms[ariaLabel || ''] : href;

  return (
    <a
      href={srcLink}
      target={target}
      rel="noopener noreferrer"
      className={`h-9 w-9 rounded-full  flex justify-center items-center ${className}`}
      style={{ ...style }}
      aria-label={`link ${ariaLabel}`}
      onClick={(event) => {
        if (onClick) {
          event.preventDefault();
          onClick(event);
        }
      }}
    // onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
    // onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {isUseImg ? (
        <Image
          src={`/assets/icons/${nameImg}`}
          alt={`${alt}`}
          width={0}
          height={0}
          sizes="100vw"
          style={{ height: 'auto', ...styleImg }}
        />
      ) : (
        <FontAwesomeIcon className={`${iconClassName}`} icon={icon} style={{ ...styleImg }} />
      )}
    </a>
  );
};

export default SocialLinkIcon;
