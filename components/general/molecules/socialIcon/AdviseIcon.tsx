import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";

const AdviseIcon = (props: SocialLinkProps) => {
    const { href, onClick } = props;
    return <SocialLinkIcon 
        href={href}
        isUseImg={true}
        nameImg="advise.svg"
        alt="advise"
        ariaLabel="advise"
        style={{ width: "56px"}}
        styleImg={{ width: "100%"}}
        onClick={onClick}
    />
}

export default AdviseIcon;
