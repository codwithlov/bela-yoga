'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const ChatWidget: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    isClient && <Script
      src="https://cdn.fchat.vn/assets/embed/webchat.js?id=664ea9942dc06718c45c1942"
      strategy="lazyOnload"
      rel='preconnect'
      defer
      onLoad={() => {
        let isApplied = false;
        const chatWidget = document.querySelector('chat-widget');

        if (chatWidget && !isApplied) {
          setInterval(() => {
            const shadowRoot = chatWidget.shadowRoot;
            if (shadowRoot) {
              const aEl = shadowRoot.querySelector('a#prime') as HTMLElement | null;
              const powerBy = shadowRoot.getElementById('power_by') as HTMLElement | null;
              const channelItem = shadowRoot.querySelector('.channel-items') as HTMLElement | null;
              const salesOnline = shadowRoot.querySelector('.sales-online') as HTMLElement | null;

              // Apply custom styles
              if (channelItem) {
                channelItem.style.textAlign = 'center';
              }
              if (salesOnline) {
                salesOnline.style.maxHeight = '58px';
                salesOnline.style.padding = '0 4px';
                salesOnline.style.overflow = 'hidden';
              }
              if (powerBy) {
                powerBy.style.display = 'none';
              }
              if (aEl) {
                aEl.style.display = 'none';
                const contactSupport = document.getElementById('contact_support');
                if (contactSupport) {
                  contactSupport.style.display = 'block';
                }
                const popupQuickChat = document.getElementById('popup_quick_chat');
                if (popupQuickChat) {
                  popupQuickChat.style.display = 'block';
                }
              }
            }
            isApplied = true;
          }, 100);
        }
      }}
    />
  );
};

export default ChatWidget;
