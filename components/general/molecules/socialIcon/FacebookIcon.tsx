import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

const FacebookIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        icon={faFacebook}
        ariaLabel="facebook"
        className="icon-facebook"
        iconClassName="text-4xl text-facebook"
    />
}

export default FacebookIcon;