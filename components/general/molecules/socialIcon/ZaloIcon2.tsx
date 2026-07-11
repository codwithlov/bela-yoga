import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";

const ZaloIcon2 = (props: SocialLinkProps) => {
    const { href, style } = props;
    return <SocialLinkIcon
        href={href}
        isUseImg={true}
        nameImg="zalo-2.svg"
        alt="contact-zalo"
        ariaLabel="contact-zalo"
        style={{ width: "48px", height: "48px", ...style }}
        styleImg={{ width: "100%" }}
    />
}

export default ZaloIcon2;
