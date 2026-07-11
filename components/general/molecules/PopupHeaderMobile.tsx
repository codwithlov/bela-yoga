import React from 'react'
type PopupHeaderMobileParams = {
    close: () => void,
    reset?: () => void,
    title?: string,
    showDivider?: boolean,
}
// pt-6 pb-3
const PopupHeaderMobile: React.FC<PopupHeaderMobileParams> = ({ title, close, reset, showDivider }) => {
    return (
        <section id='drawer_header_mobile' className='my-0.5 px-4'>
            <div className='py-4 flex flex-row justify-between items-center'>
                <button onClick={close}>
                    <div className='bg-sgt-neutral-1'
                        style={{
                            mask: 'url("/assets/icons/close.svg")',
                            maskSize: 'cover',
                            width: "1.5rem",
                            height: "1.5rem",
                        }}
                    >
                    </div>
                </button>
                <h3 className='text-lg font-semibold text-sgt-secondary-1'>{title}</h3>
                {
                    reset ?
                        <button onClick={reset}>
                            <div className='bg-sgt-neutral-1 '
                                style={{
                                    mask: 'url("/assets/icons/reset.svg")',
                                    maskSize: 'cover',
                                    width: "1.5rem",
                                    height: "1.5rem",
                                }}
                            >
                            </div>
                        </button> :
                        <div></div>
                }
            </div>
            {showDivider &&
                <div className='border-b border-sgt-neutral-5' />
            }

        </section>
    )
}

export default PopupHeaderMobile