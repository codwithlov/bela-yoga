import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";

const TiktokIIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        isUseImg={true}
        nameImg="emoji-tiktok.svg"
        className="bg-black"
        alt="emoji-tiktok"
        ariaLabel="tiktok"
        styleImg={{ width: "1.125rem"}}
    />
}

export default TiktokIIcon;