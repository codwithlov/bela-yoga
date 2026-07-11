'use client';

import React, { useEffect, useState } from 'react';
import {
  AdviseIcon,
  CloseAdviseIcon,
  SgtHotline2,
  ZaloIcon2,
} from '../molecules/socialIcon';
import { MESSENGER, ZALO, PHONE } from '@/constants/link';

interface SocialLinkPartProps {
  phone?: string;
  zalo?: string;
  message?: string;
  handleWidgetChatClick: () => void;
}

const ContactMobilePart: React.FC<SocialLinkPartProps> = ({
  phone = `tel:${PHONE.trim()}`,
  zalo = ZALO,
  message = MESSENGER,
  handleWidgetChatClick,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(false);
  const handleShowToggle = () => setShow((prev) => !prev);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className={`flex flex-col items-center gap-4`}>
        {show && <div className={`flex flex-col items-center gap-0 transition-show ${show ? 'transition-show-active' : ''}`}>
          <SgtHotline2 href={phone} />
          <ZaloIcon2 href={zalo} />
          {/* <MessengerIcon2 href={message} /> */}
          {/* <QuickChat href={message} onClick={handleWidgetChatClick} style={{ marginTop: "3px" }} /> */}
        </div>}
        {show ? (
          <CloseAdviseIcon href="#" onClick={handleShowToggle} />
        ) : (
          <AdviseIcon href="#" onClick={handleShowToggle} />
        )}
      </div>
    </>

  );
};

export default ContactMobilePart;
