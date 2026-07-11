'use client'
import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { SocialLinkProps } from '../../atoms/SocialLinkIcon';
import { QuickChat } from './index'

const PopupQuickChat: React.FC<SocialLinkProps> = ({ href, onClick, style }) => {
  const isClient = typeof window !== "undefined";

  const portalDiv = useMemo(() => {
    if (isClient) {
      return document.createElement("div");
    }
    return null;
  }, [isClient]);

  useEffect(() => {
    if (!portalDiv) return;

    // Configure portal div properties
    Object.assign(portalDiv.style, {
      display: "none",
      position: "fixed",
      zIndex: "999999999",
      right: "16px",
      bottom: "80px",
    });

    // Set unique ID and append to body
    portalDiv.id = "popup_quick_chat";
    document.body.appendChild(portalDiv);

    // Cleanup function to remove the div
    return () => {
      document?.body?.removeChild(portalDiv);
    };
  }, [portalDiv]);

  if (!isClient || !portalDiv) {
    return null;
  }

  const content = (
    <QuickChat
      href={href}
      style={{ width: '56px', height: '56px', transition: "all 0.2s ease-in-out", ...style }}
      onClick={onClick}
      styleImg={{
        maxWidth: "35px",
        height: "35px",
        // top: "8px",
        // right: "9px"
      }}
    />
  );

  return ReactDOM.createPortal(content, portalDiv);
};

export default PopupQuickChat;
