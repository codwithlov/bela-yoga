import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";



const MailIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        icon={faEnvelope}
        ariaLabel="mail"
        className="icon-black"
        iconClassName="text-xl text-white"
    />
}

export default MailIcon;