import React from 'react';
import {
  FacebookIcon,
  TwitterIcon,
  MailIcon,
  LinkedinIcon,
  PinterestIcon,
} from '../molecules/socialIcon';
import { FACEBOOK, MAIL } from '@/constants/link';

interface SocialLinkPartProps {
  facebookLink?: string;
  twitterLink?: string;
  sub_mail?: string;
  pinterestLink?: string;
  linkedinLink?: string;
}

const SocialLinkPart: React.FC<SocialLinkPartProps> = ({
  facebookLink = FACEBOOK,
  twitterLink = '#',
  sub_mail = MAIL,
  pinterestLink = '#',
  linkedinLink = '#',
}) => {
  return (
    <div className="flex flex-row gap-1 justify-start max-xs:gap-4 mt-2">
      <FacebookIcon href={facebookLink} />
      <TwitterIcon href={twitterLink} />
      <MailIcon href={sub_mail} />
      <PinterestIcon href={pinterestLink} />
      <LinkedinIcon href={linkedinLink} />
    </div>
  );
};

export default SocialLinkPart;
