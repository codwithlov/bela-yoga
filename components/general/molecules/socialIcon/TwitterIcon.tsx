import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";



const TwitterIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        icon={faTwitter}
        ariaLabel="twitter"
        className="icon-blue"
        iconClassName="text-xl text-white"
    />
}

export default TwitterIcon;