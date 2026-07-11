'use client';
import React from 'react'
import { Form, Input, Switch } from 'antd'
import { SlugPrefixSelect } from '@/components/admin/atoms/SlugPrefixSelect';
import Image from 'next/image';
// import { DeleteOutlined } from '@ant-design/icons';

type Params = {
    form: any,
    slugs: any,
    bannerImage: any,
    setBannerImage: any,
}

const AdminMenuCreateUpdate: React.FC<Params> = ({
    form,
    slugs,
    bannerImage,
    setBannerImage,
}) => {
    const isSwitchOn = Form.useWatch('is_switch_on', form)
    const handleUploadBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        if (file && file.size > 0.2 * 1024 * 1024) {
            alert('File lớn hơn 200KB');
            return;
        }

        setBannerImage({
            url: URL.createObjectURL(file),
            file: file,
        });
    };
    return (
        <>
            <Form.Item name="title" label="Tên" rules={[{ required: true }]}>
                <Input maxLength={100} />
            </Form.Item>

            {isSwitchOn ? (
                <Form.Item name="url_to" label="Đến url" rules={[{ required: true }]}>
                    <Input placeholder='Nhập đường dẫn' />
                </Form.Item>
            ) : (
                <SlugPrefixSelect
                    slugs={slugs}
                    name='slug_permalink_id'
                    label='Đến slug'
                    rules={[{ required: true }]}
                />
            )}

            <Form.Item name="is_switch_on" label="Url khác" valuePropName="checked">
                <Switch />
            </Form.Item>

            <div className='flex gap-2'>
                {bannerImage?.url &&
                    <>
                        <div className="overflow-hidden">
                            <Image
                                src={bannerImage?.url}
                                alt="menu"
                                width={80}
                                height={40}
                                className="w-auto h-[40px] object-cover"
                                loading="lazy"
                            />
                        </div>
                        {/* <DeleteOutlined
                            className="!text-red-500 cursor-pointer"
                            onClick={() => setBannerImage({ url: '' })}
                        /> */}
                    </>
                }
                <label
                    htmlFor="banner-file"
                    className="bg-red-400 rounded-lg text-center cursor-pointer"
                >
                    <p className="text-sx justify-center p-2">
                        <span className="font-semibold">{`${bannerImage?.url ? 'Đổi' : 'Thêm'} ảnh (200KB)`}</span>
                    </p>
                    <input
                        id="banner-file"
                        type="file"
                        accept="image/*"
                        onChange={handleUploadBanner}
                        className="!hidden"
                    />
                </label>
            </div>
        </>
    )
}

export default AdminMenuCreateUpdate
