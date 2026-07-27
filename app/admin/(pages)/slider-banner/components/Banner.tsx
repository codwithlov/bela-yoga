'use client';
import React from "react";
import Image from "next/image";

const Banner = ({ setBannerImage, bannerImage, editImage }: any) => {
    const handleUploadBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        if (file && file.size > 2 * 1024 * 1024) {
            alert('File lớn hơn 2MB');
            return;
        }

        setBannerImage({
            url: URL.createObjectURL(file),
            file: file,
            image_type: 'banner',
        });
    };

    return (
        <>
            <p className="font-medium text-lg mt-1">Banner</p>
            <div className="flex items-center gap-4">
                {bannerImage?.url &&
                    <div className="rounded-md overflow-hidden mb-2">
                        <Image
                            src={bannerImage?.url}
                            alt="Banner"
                            width={850}
                            height={120}
                            className="w-[850px] h-[120px] object-cover rounded-md"
                            priority={false}
                        />
                    </div>
                }
                <div className="flex flex-col justify-center my-2">
                    <label
                        htmlFor="banner-file"
                        className="bg-bela-primary-2 rounded-lg w-full text-center cursor-pointer"
                    >
                        <p className="text-sx justify-center p-2">
                            <span className="font-semibold">{`${bannerImage?.url ? 'Đổi' : 'Thêm'} banner (2MB)`}</span>
                        </p>
                        <input
                            id="banner-file"
                            type="file"
                            accept="image/*"
                            onChange={handleUploadBanner}
                            className="hidden"
                        />
                    </label>
                    {bannerImage?.url &&
                        <button
                            className="bg-bela-primary-2 rounded-lg w-full text-center p-2 font-semibold text-sx mt-2"
                            onClick={() => editImage(null)}
                        >
                            Đường dẫn
                        </button>
                    }
                </div>
            </div>
        </>
    );
}

export default Banner;
