'use client';
import React, { useEffect, useState } from 'react';
import { MESSENGER, PHONE, ZALO } from '@/constants/link';
import ContactMobilePart from '../general/organisms/ContactMobilePart';
import { useMediaQuery } from 'react-responsive';
// import PopupQuickChat from '../general/molecules/socialIcon/PopupQuickChat';
import SgtHotline2 from '../general/molecules/socialIcon/SgtHotline2';
import ZaloIcon2 from '../general/molecules/socialIcon/ZaloIcon2';
import dynamic from 'next/dynamic';

/** Import Lazy CSS */
const ContactSupportCss = dynamic(() => import('@/components/non-critical/ContactSupportCss'), { ssr: false });
/** End */

const ContactSupport = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  const zaloLink: string = ZALO;
  const messenger: string = MESSENGER;
  const phone: string = `tel:${PHONE.trim()}`;
  const [isMounted, setIsMounted] = useState(false);

  const handleWidgetChatClick = () => {
    const chatWidget = document.querySelector(
      'chat-widget'
    ) as HTMLElement | null;
    const shadowRoot = chatWidget?.shadowRoot;
    const aEl = shadowRoot?.querySelector('a#prime.fab') as HTMLElement | null;
    if (aEl) {
      aEl.click();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && <ContactSupportCss />}
      <section id="contact_support">
        <div className="hidden md:block" style={{ zIndex: 999999999999 }}>
          <div
            className={`flex flex-col items-center gap-3 transition-all duration-300`}
          >
            {/* <a href={zaloLink} target="_blank" aria-label="zalo link">
              <Image
                src="/assets/icons/zalo.png"
                alt="sgt-zalo-shadow"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '52px', height: 'auto' }}
              />
            </a>
            <a href={phone} aria-label="phone link">
              <Image
                src="/assets/icons/hotline.png"
                alt="sgt-hotline"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '55px', height: 'auto' }}
              />
            </a>
            <a href={messenger} target="_blank" aria-label="messenger link">
              <Image
                src="/assets/icons/messenger.png"
                alt="sgt messenger"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '52px', height: 'auto' }}
              />
            </a> */}
            <SgtHotline2 href={phone} style={{ width: '58px', height: '58px', }} />
            <ZaloIcon2 href={zaloLink} style={{ width: '58px', height: '58px', }} />
            {/* <MessengerIcon2 href={messenger} style={{ width: '58px', height: '58px', }} /> */}
          </div>
        </div>

        {isMounted && isMobile &&
          <ContactMobilePart
            zalo={zaloLink}
            message={messenger}
            phone={phone}
            handleWidgetChatClick={handleWidgetChatClick}
          />
          // :
          // <PopupQuickChat
          //   href='#'
          //   onClick={handleWidgetChatClick}
          // />
        }
      </section>
    </>
  );
};

export default ContactSupport;
