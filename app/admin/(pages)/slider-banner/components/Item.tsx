import React from "react";
import Image from "next/image";
import { Button } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { SliderBannerImage } from "@/interfaces/image";
import { EMPTY_IMAGE } from "@/constants/ui";

const Item = React.memo(({ item, viewGallery, editImage, height }: { item: SliderBannerImage; viewGallery: any; editImage: any, height: number }) => {
    return (
        <div className="relative group rounded-md shadow-lg w-full overflow-hidden" style={{ height: height }}>
            <Image
                key={item.id}
                src={item.url || EMPTY_IMAGE}
                alt="Slider"
                width={400}
                height={120}
                className="object-cover rounded-md"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: 'white' }} />}
                        onClick={editImage}
                    />
                    <Button
                        type="text"
                        icon={<EyeOutlined style={{ color: 'white' }} />}
                        onClick={viewGallery}
                    />
                </div>
            </div>
        </div>
    );
});

Item.displayName = "Item";
export default Item;
``
