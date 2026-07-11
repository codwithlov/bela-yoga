import SocialLinkIcon, { SocialLinkProps } from "../../atoms/SocialLinkIcon";
import { faPinterest } from "@fortawesome/free-brands-svg-icons";

const PinterestIcon = (props: SocialLinkProps) => {
    const { href } = props;
    return <SocialLinkIcon 
        href={href}
        icon={faPinterest}
        ariaLabel="printerest"
        className="icon-red"
        iconClassName="text-xl text-white"
    />
}

export default PinterestIcon;