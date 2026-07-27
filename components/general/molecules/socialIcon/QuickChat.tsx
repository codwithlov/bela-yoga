import React from "react";
import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
const QuickChat: React.FC<SocialLinkProps> = ({ href, onClick, style, styleImg }) => {
  return (
    <SocialLinkIcon
      className="shadow-bela-black-1"
      href={href}
      icon={faCommentDots}
      alt="fchat"
      ariaLabel="fchat"
      iconClassName="text-lg text-white"
      style={{
        display: "block",
        width: "44px",
        height: "44px",
        position: "relative",
        zIndex: 999999999,
        backgroundColor: "rgb(245, 178, 44)",
        ...style,
      }}
      styleImg={{
        position: "absolute",
        maxWidth: "28px",
        height: "28px",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        ...styleImg
      }}
      onClick={onClick}
    />
  )
};

export default QuickChat;

