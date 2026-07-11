import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";

const ZaloIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        isUseImg={true}
        nameImg="zalo.svg"
        alt="zalo"
        ariaLabel="zalo"
        styleImg={{ width: "2.25rem"}}
    />
}

export default ZaloIcon;