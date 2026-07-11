import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";

const CloseAdviseIcon = (props: SocialLinkProps) => {
    const { href, onClick } = props;
    return <SocialLinkIcon 
        href={href}
        isUseImg={true}
        nameImg="close-2.svg"
        alt="close-advise"
        ariaLabel="close-advise"
        style={{ width: "56px"}}
        styleImg={{ width: "100%"}}
        onClick={onClick}
    />
}

export default CloseAdviseIcon;
