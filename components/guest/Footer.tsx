
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons";
import React from 'react'
import Image from "next/image";
import { FACEBOOK, MAIL, PHONE, TIKTOK, YOUTUBE, ZALO } from '@/constants/link';
import FooterField from './FooterField';
import TrafficScriptComponent from '../script/TrafficScriptComponent';
import { Menu } from '@/interfaces/menu';
import { normalizeUrl } from '@/utils/helper';
import { templateSiteConfig } from '@/config/template/site';

function Footer({ footerMenus = [], accountMenus = [] }: { footerMenus?: Menu[]; accountMenus?: Menu[] }) {

    const facebookLink: string = FACEBOOK;
    const zaloLink: string = ZALO;
    const tiktokLink: string = TIKTOK;
    const youtubeLink: string = YOUTUBE;
    const footerConfig = templateSiteConfig.footer;
    const brandName = templateSiteConfig.name;
    const logo = templateSiteConfig.assets.logo;

    const FooterSocialMedia = () => {
        return <>
            <span className='text-sgt-primary-2 text-sub-1 font-bold'>{footerConfig.connectTitle}</span>
            <div className='flex flex-row gap-2.5 justify-start pt-4 max-xs:gap-4'>
                <a
                    href={facebookLink}
                    target='_blank'
                    className='h-9 w-9 rounded-full bg-white border border-facebook flex justify-center items-center'
                    aria-label='facebook link'
                >
                    <FontAwesomeIcon className='text-4xl text-facebook' icon={faFacebook} />
                </a>
                <a href={tiktokLink}
                    target='_blank'
                    className='h-9 w-9 rounded-full bg-black flex flex-row justify-center items-center'
                    aria-label='tiktok link'
                >
                    <Image
                        src="/assets/icons/emoji-tiktok.svg"
                        alt="emoji-tiktok"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '1.125rem', height: 'auto' }}
                    />
                </a>
                <a
                    href={zaloLink}
                    target='_blank'
                    className='h-9 w-9 rounded-full flex flex-row justify-center items-center'
                    aria-label='zalo link'
                >
                    <Image
                        src="/assets/icons/zalo.svg"
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '2.25rem', height: 'auto' }}
                    />
                </a>
                <a
                    href={youtubeLink}
                    target='_blank'
                    className='h-9 w-9 rounded-full bg-youtube flex flex-row justify-center items-center'
                    aria-label='youtube link'
                >
                    <FontAwesomeIcon className='text-xl text-white' icon={faYoutube} />
                </a>
            </div>
        </>
    }

    const FooterHotline = () => {
        return <>
            <span className='text-sgt-primary-2 text-sub-1 font-bold'>{templateSiteConfig.contact.footerHotlineTitle}</span>
            <div className='flex flex-row gap-2.5 justify-start pt-2'>
                <a href={`tel:${PHONE.trim()}`}
                    className='px-3 py-1.5 rounded-md text-h4 text-sgt-neutral-7'
                    style={{ backgroundColor: "var(--template-color-primary-dark)" }}>
                    {PHONE}
                </a>
            </div>
        </>
    }

    const defaultFooterMenus: Menu[] = [...templateSiteConfig.navigation.footer];
    const defaultAccountMenus: Menu[] = [...templateSiteConfig.navigation.account];

    const footerMenuItems = footerMenus.length > 0 ? footerMenus : defaultFooterMenus;
    const accountMenuItems = accountMenus.length > 0 ? accountMenus : defaultAccountMenus;

    return (
        <>

            <section id='__sgt_footer' className='bg-sgt-neutral-1'>
                <div className='max-xl:w-full md:overflow-hidden 2xl:overflow-visible px-4 xl:py-16 width-primary m-auto text-sm pt-12 max-xs:pt-28 max-sm:pt-36 max-sm:mt-12 relative'>
                    {/* Email */}
                    <div className='email_form'>
                        <div className='hidden md:block w-full left-10 absolute top-1/2 -translate-y-1/2' style={{}}>
                            <Image
                                src="/assets/icons/line-ripple.svg"
                                alt="sgt-email"
                                width={0}
                                height={0}
                                sizes='100vw'
                                style={{ width: "100%", height: "auto" }}
                            />
                            <div className='w-10 absolute bottom-1/2 translate-x-1/2 translate-y-2' style={{ right: "-0.375rem" }}>
                                <Image
                                    src="/assets/icons/plane-1.svg"
                                    alt="sgt-email"
                                    width={0}
                                    height={0}
                                    sizes='100vw'
                                    style={{ width: "2.5rem", height: "auto" }}
                                />
                            </div>
                        </div>
                        <div className='email_form_wrap'>
                            <div className='col-span-12 lg:col-span-6 flex flex-row justify-start items-center gap-5'>
                                {/* scale-125 */}
                                <div className='relative w-24'>
                                    <div className='email_icon w-full absolute left-0 top-0 -translate-y-1/2 '>
                                        <Image
                                            src="/assets/icons/email.png"
                                            alt="sgt-email"
                                            width={0}
                                            height={0}
                                            sizes='100vw'
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <span className='max-xs:text-lg max-sm:text-h4 text-h3 text-sgt-neutral-1'>{footerConfig.newsletterTitle}</span>
                                    <p className='text-body-2 text-sgt-neutral-2 pt-1 max-xs:pt-0'>{footerConfig.newsletterDescription}</p>
                                </div>
                            </div>
                            <FooterField />
                        </div>
                    </div>

                    {/* Info */}
                    <div className='w-full grid grid-cols-12 gap-5 max-sm:gap-6 pt-9'>
                        <div className='col-span-12 lg:col-span-6 max-sm:order-2'>
                            <div className='pb-4'>
                                <Image
                                    src={logo}
                                    alt={`${brandName} logo`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '220px', height: 'auto' }}
                                />
                            </div>
                            <h3 className='text-sgt-primary-2 text-base font-semibold'>{footerConfig.companyHeading}</h3>
                            <div className='flex flex-col gap-1.5 text-sgt-primary-4 pt-4'>
                                {footerConfig.paragraphs.map((paragraph) => (
                                    <div key={paragraph}>
                                        <span className='text-body-2'>{paragraph}</span>
                                    </div>
                                ))}
                                <a href={`mailto:${MAIL}`} className='flex flex-row gap-1.5 justify-start items-center'>
                                    <span className='text-body-1'>Email: </span>
                                    <span className='text-body-2'>{MAIL}</span>
                                </a>
                            </div>
                            <div className='text-sgt-primary-4 pt-8 max-sm:pt-5'>
                                <div>
                                    <span className='text-body-1'>{footerConfig.focusLabel}: </span>
                                    <span className='text-body-2'>{templateSiteConfig.tagline}</span>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-12 pt-4 lg:col-span-6 lg:pt-0 flex flex-row justify-end gap-24 max-xs:flex-col max-sm:justify-between max-sm:order-1 max-sm:gap-4' >
                            <div className='grid grid-cols-12 gap-y-16 max-sm:gap-y-6'>
                                <div className='col-span-12'>
                                    <h4 className='text-sgt-primary-2 text-sub-1 font-bold'>{footerConfig.aboutTitle}</h4>
                                    <div className='flex flex-col gap-2.5 text-body-2 text-sgt-primary-4 pt-4'>
                                        {footerMenuItems.map((item) => (
                                            <a key={item.key} href={normalizeUrl(item.slug || item.url_to)} target='_blank'>{item.title}</a>
                                        ))}
                                        <p>&nbsp;</p>
                                    </div>
                                </div>
                                <div className='col-span-12 hidden max-xs:hidden max-sm:block'>
                                    <FooterHotline></FooterHotline>
                                </div>
                                <div className='col-span-12 block max-sm:hidden'>
                                    <FooterSocialMedia></FooterSocialMedia>
                                </div>
                            </div>
                            <div className='grid grid-cols-12 gap-y-16 max-sm:gap-y-6'>
                                <div className='col-span-12'>
                                    <h4 className='text-sgt-primary-2 text-sub-1 font-bold'>{footerConfig.infoTitle}</h4>
                                    <div className='flex flex-col gap-2.5 text-body-2 text-sgt-primary-4 pt-4'>
                                        {accountMenuItems.map((item) => (
                                            <a key={item.key} href={normalizeUrl(item.slug || item.url_to)} target='_blank'>{item.title}</a>
                                        ))}
                                    </div>
                                </div>
                                <div className='col-span-12 block max-xs:block max-sm:hidden'>
                                    <FooterHotline></FooterHotline>
                                </div>
                                <div className='col-span-12 hidden max-sm:block'>
                                    <FooterSocialMedia></FooterSocialMedia>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-10 mb-5 max-sm:mt-6 max-sm:mb-3 border-b border-sgt-primary-4 border-opacity-50'></div>
                <div className='text-cap-1 text-center text-sgt-primary-4 pb-7'>
                    Copyright {templateSiteConfig.copyrightYear} © {templateSiteConfig.name}<span className='inline max-xs:hidden'> - {templateSiteConfig.tagline}</span>
                </div>
                {templateSiteConfig.features.showTrafficScript && <TrafficScriptComponent />}
            </section>
        </>
    )
}

export default Footer



