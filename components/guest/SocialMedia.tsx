import { SOCIAL_MEDIA } from '@/constants/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import Image from 'next/image';
import '@/styles/components/social-media.scss'
type SocialMediaParams = {
    mode?: string
}
const SocialMedia: React.FC<SocialMediaParams> = ({ mode }) => {
    const socialMedia = SOCIAL_MEDIA;
    return (
        <>
            {
                socialMedia.map(item => {
                    const borderColor = item.borderColor;
                    const textColor = item.color;
                    if (mode == undefined && item.name == 'Phone') {
                        return <></>;
                    }
                    return <a
                        key={item.link}
                        target={item.name !== 'Phone' ? '_blank' : ''}
                        href={item.name == 'Phone' ? `tel:${item.link.trim()}` : item.link}
                        className={`sgt_social_media`}>
                        <div className={`sgt${mode ? `_${mode}_` : '_'}social_media_bg ${mode ? 'w-10 h-10' : 'w-8 h-8'}`}>
                            <span className={`${textColor} ${borderColor}`}></span>
                            {
                                mode ? <>
                                    <span className={`${textColor} ${borderColor}`}></span>
                                </> : null
                            }
                            <span className={`sgt_social_media_icon ${borderColor}`}>
                                {
                                    item.icon ?
                                        <FontAwesomeIcon
                                            className={` ${mode ? 'text-xl' : 'text-base'} ${textColor}`}
                                            icon={item.icon}
                                        />
                                        : item.imageIcon ?
                                            <Image
                                                src={item.imageIcon}
                                                alt=""
                                                width={mode ? 26 : 18}
                                                height={mode ? 26 : 18}
                                            /> : null
                                }

                            </span>
                        </div>
                        {/* <div className='sgt_social_media_text'>
                            <p className='text-sm'>{item.name}</p>
                        </div> */}
                    </a>
                })
            }
        </>
    )
}

export default SocialMedia