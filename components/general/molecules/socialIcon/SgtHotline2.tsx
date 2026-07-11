import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";

const SgtHotline2 = (props: SocialLinkProps) => {
    const { href, style } = props;
    return <SocialLinkIcon
        href={href}
        isUseImg={true}
        nameImg="phone-mobile.svg"
        alt="call-sgt"
        ariaLabel="call-sgt"
        className=""
        style={{ width: "48px", height: "48px", ...style }}
        styleImg={{ width: "100%" }}
    />
}

export default SgtHotline2;
