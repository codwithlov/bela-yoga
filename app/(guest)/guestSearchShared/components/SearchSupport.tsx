'use client'
import AdviseModal from '@/components/guest/AdviseModal'
import { MESSENGER, PHONE, ZALO } from '@/constants/link'
import { getTextOnly } from '@/utils/htmlUtils'
import { Collapse, CollapseProps, Divider } from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type SearchSupportParams = {
    questions: { title: string; content: string }[],
    source: string,
}

const SearchSupport = (props: SearchSupportParams) => {
    const { questions, source } = props;
    const zaloLink: string = ZALO;
    const messenger: string = MESSENGER;
    // const [questionItems, setQuestionItems] = useState<CollapseProps['items']>([]);
    const [openModal, setOpenModal] = useState(false);

    // useEffect(() => {
    //     let questionItems = questions.map((item, index) => {
    //         return {
    //             key: index + 1,
    //             label: <div className='text-body-1 text-bela-secondary-1'>{item.title}</div>,
    //             children: <div
    //                 className='max-sm:text-cap-1 text-body-2 text-bela-secondary-1 ck-content'
    //                 dangerouslySetInnerHTML={{ __html: item.content ?? '' }}
    //             >
    //             </div>,
    //         }
    //     })
    //     setQuestionItems(questionItems);
    // }, [questions])

    const SupportImageComponent = ({ className }: { className: string }) =>
        <div className={`${className}bg-bela-secondary-1 bg-gradient-to-t from-bela-primary-1 to-bela-primary-2 aspect-square rounded-full`}>
            <div className='w-full h-full flex flex-row justify-center items-center'>
                <Image
                    src={`/assets/icons/tvv-1.svg`}
                    alt='about-us'
                    width={0}
                    height={0}
                    priority={true}
                    sizes='100vw'
                    className='w-4/5 h-4/5 object-cover object-center mb-7'
                />
            </div>
        </div>


    return (
        <section id='search_support' className='pb-16 mb-1 max-sm:pb-10 max-sm:px-4'>
            <div className='grid grid-cols-12 gap-y-10 md:gap-x-5'>
                <div className='col-span-12 md:col-span-3 mt-10 max-sm:mt-0'>
                    <div className='max-sm:hidden flex flex-row relative'>
                        <div className='w-1/2 flex flex-row relative'>
                            <div className='w-1/2 aspect-square rounded-full bg-bela-neutral-7'></div>
                            <div className='w-1/2 aspect-square rounded-full bg-bela-neutral-7 absolute right-0 bottom-0 -translate-y-1/4 -translate-x-1/4'></div>
                        </div>
                        <div className='w-1/2 flex flex-row relative'>
                            <div className='w-1/2 aspect-square rounded-full bg-bela-neutral-7 absolute left-0 bottom-0 -translate-y-1/4 translate-x-1/4'></div>
                            <div className='w-1/2 aspect-square rounded-full bg-bela-neutral-7 absolute right-0'></div>
                        </div>
                    </div>
                    <div className='bg-gradient-to-t from-bela-primary-2 from-10% to-bela-neutral-7 to-70% rounded-bela-10 p-0.5 relative -top-10 max-sm:top-0'>
                        <div className='bg-bela-neutral-7 rounded-bela-10 relative'>
                            <SupportImageComponent className='hidden md:block w-[5.125rem] absolute left-1/2 -top-2 -translate-y-3/4 -translate-x-1/2 ' />
                            <div className='pt-8 pb-4 px-5 max-sm:pt-4'>
                                <div className='flex flex-row justify-start gap-4'>
                                    <SupportImageComponent className='hidden max-sm:flex w-[4.75rem]' />
                                    <div className='flex-1 flex flex-col items-start md:items-center gap-2 md:gap-3.5 '>
                                        <h1 className='text-sub-1 text-bela-secondary-1'>Bạn cần hỗ trợ ngay?</h1>
                                        <p className='text-cap-1 text-bela-neutral-3 pb-2'>Với kinh nghiệm trong ngành du lịch chúng tôi tự tin có thể hỗ trợ bạn nhanh nhất</p>
                                    </div>
                                </div>
                                <a
                                    href={`tel:${PHONE.trim()}`}
                                    className='px-3 pt-4 rounded-md text-h4 text-bela-secondary-1 flex flex-row justify-center items-center gap-2'>
                                    <div className='bg-bela-third-2 h-8 w-8 rounded-full flex flex-row justify-center items-center'>
                                        <div className='bg-bela-neutral-7'
                                            style={{
                                                mask: 'url("/assets/icons/phone-1.svg")',
                                                maskSize: 'contain',
                                                width: "1.0625rem",
                                                height: "1.0625rem",
                                            }}
                                        ></div>
                                    </div>
                                    {PHONE}
                                </a>
                                <Divider className='!min-w-[80%] !w-4/5 !mx-auto !text-bela-neutral-4 !text-cap-1 !my-3'>Hoặc</Divider>
                                <div className='flex flex-row justify-center items-center gap-3.5'>
                                    <a
                                        href={messenger}
                                        target='_blank'
                                        className='h-8 w-8 rounded-full flex flex-row justify-center items-center'
                                        aria-label='messenger link'
                                    >
                                        <Image
                                            src="/assets/icons/emoji-messenger.svg"
                                            alt=""
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ width: '2.25rem', height: 'auto' }}
                                        />
                                    </a>
                                    <a
                                        href={zaloLink}
                                        target='_blank'
                                        className='h-8 w-8 rounded-full flex flex-row justify-center items-center'
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
                                </div>
                                <button className='send_now_btn' onClick={() => setOpenModal(true)}>
                                    Gửi ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 md:col-span-9'>
                    <div className='rounded-bela-10 bg-bela-neutral-7 h-auto overflow-hidden'>
                        <h3 className='text-h3 max-sm:text-lg text-bela-secondary-1 pl-5 pt-6 pb-4'>Các câu hỏi thường gặp</h3>
                        <Collapse
                            items={questions.map((item, index) => {
                                return {
                                    key: index + 1,
                                    label: <div className='text-body-1 text-bela-secondary-1'>{item.title}</div>,
                                    children: <div
                                        className='max-sm:text-cap-1 text-body-2 text-bela-secondary-1 ck-content'
                                        dangerouslySetInnerHTML={{ __html: item.content ?? '' }}
                                    >
                                    </div>,
                                }
                            })}
                            bordered={false}
                            defaultActiveKey={['1']}
                            expandIconPosition='end'
                            expandIcon={({ isActive }) =>
                                <div className='bg-bela-neutral-3'
                                    style={{
                                        mask: 'url("/assets/icons/chevron-down.svg")',
                                        maskSize: 'cover',
                                        width: "1.25rem",
                                        height: "1.25rem",
                                    }}
                                >
                                </div>
                            }
                            className='search_support_collapse'
                        />
                    </div>
                </div>
            </div>
            <AdviseModal closeModal={() => setOpenModal(false)} openModal={openModal} source={source} />
        </section>
    )
}

export default SearchSupport