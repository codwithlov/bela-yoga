import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";

const MessengerIcon2 = (props: SocialLinkProps) => {
    const { href, style } = props;
    return <SocialLinkIcon
        href={href}
        isUseImg={true}
        nameImg="mess.svg"
        alt="contact-messeger"
        ariaLabel="contact-messeger"
        style={{ width: "48px", height: "48px", ...style }}
        styleImg={{ width: "100%" }}
    />
}

export default MessengerIcon2;
