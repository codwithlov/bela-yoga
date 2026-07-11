import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFacebookF, faFacebookMessenger, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { templateSiteConfig } from "@/config/template/site";

export const PHONE: string = templateSiteConfig.contact.phone;
export const MAIL: string = templateSiteConfig.contact.email;
export const YOUTUBE: string = templateSiteConfig.social.youtube;
export const TIKTOK: string = templateSiteConfig.social.tiktok;
export const ZALO: string = templateSiteConfig.social.zalo;
export const FACEBOOK: string = templateSiteConfig.social.facebook;
export const MESSENGER: string = templateSiteConfig.social.messenger;
export const BCT: string = templateSiteConfig.social.bct;
export const SOCIAL_MEDIA: {
    name: string,
    link: string,
    color: string,
    icon: IconProp | null,
    borderColor: string,
    imageIcon?: string,
}[] = [
        {
            name: 'Phone',
            link: PHONE,
            color: 'text-green-600',
            borderColor: 'border-green-600',
            icon: faPhone,
        },
        {
            name: 'Zalo',
            link: ZALO,
            color: 'text-zalo',
            borderColor: 'border-zalo',
            icon: null,
            imageIcon: "/assets/images/zalo.png",
        },
        {
            name: 'Messenger',
            link: MESSENGER,
            color: 'text-messenger',
            borderColor: 'border-messenger',
            icon: faFacebookMessenger
        },
        {
            name: 'Facebook',
            link: FACEBOOK,
            color: 'text-facebook',
            borderColor: 'border-facebook',
            icon: faFacebookF
        },
        {
            name: 'Youtube',
            link: YOUTUBE,
            color: 'text-youtube',
            borderColor: 'border-youtube',
            icon: faYoutube
        },
        {
            name: 'Tiktok',
            link: TIKTOK,
            color: 'text-tiktok',
            borderColor: 'border-tiktok',
            icon: faTiktok,
        }
    ]

