import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const LinkedinIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        icon={faLinkedin}
        ariaLabel="linkedin"
        className="icon-blue"
        iconClassName="text-xl text-white"
    />
}

export default LinkedinIcon;
