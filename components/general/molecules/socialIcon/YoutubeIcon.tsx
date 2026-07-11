import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

const YoutubeIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        icon={faYoutube}
        ariaLabel="youtube"
        className="bg-youtube"
        iconClassName="text-xl text-white"
    />
}

export default YoutubeIcon;