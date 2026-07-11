'use client';
import React, { useState, useRef } from "react";
import { useGetDataQuery, usePostDataMutation } from "@/services/api/common";
import { SLIDER_BANNER } from "@/constants/route";
import { Select } from "antd";
import { pageOptions } from "@/constants/options";
import DrawerFormBtn from "@/components/admin/molecules/DrawerFormBtn";
import { handleApiResponse } from "@/utils/helper";
import { showSuccessToastr } from "@/utils/toastr";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import Banner from "./Banner";
import Slider from "./Slider";


const AdminSliderBanner = () => {
    const [page, setPage] = useState('home');
    const { data: imagesData, refetch, isLoading } =
        useGetDataQuery(`${SLIDER_BANNER}?page_name=${page}`, { refetchOnMountOrArgChange: true, });
    const [postApi] = usePostDataMutation();

    const [columns, setColumns] = useState<any>([]);
    const [columns2, setColumns2] = useState<any>([]);
    // const [bannerImage, setBannerImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const divRef = useRef<HTMLDivElement>(null);

    const getPostSliderImages = (col: any) => {
        return [
            ...[...col.active?.items, ...col.inactive?.items].map((i, index) => ({
                id: i.id,
                file: i.file,
                order_index: col.active?.items.includes(i) ? index : null,
                slug_id: i.slug_id,
                external_link: i.external_link,
                is_active: col.active?.items.includes(i) ? 1 : 0,
            }))
        ];
    }

    const update = async () => {
        const formData = new FormData();
        const sliderImages = getPostSliderImages(columns);
        const sliderImages2 = getPostSliderImages(columns2);

        sliderImages.forEach((data) => {
            if (data.file) formData.append('sliderFiles[]', data.file);
        });
        sliderImages2.forEach((data) => {
            if (data.file) formData.append('sliderFiles2[]', data.file);
        });
        formData.append('page_name', page);
        formData.append('sliderImages', JSON.stringify(sliderImages));
        formData.append('sliderImages2', JSON.stringify(sliderImages2));
        // formData.append('bannerImageFile', bannerImage?.file);
        // formData.append('bannerImage', JSON.stringify(bannerImage));

        const postData = {
            url: SLIDER_BANNER,
            data: formData,
            isFormData: true,
        };
        await handleApiResponse(
            postApi(postData),
            (payload: any) => {
                showSuccessToastr(payload?.message);
                refetch();
            },
            setLoading,
        );
    }

    return (
        <>
            <AdminLoading isLoading={loading || isLoading} />
            <div className="select-none p-3 min-h-[1500px]" ref={divRef}>
                <Select
                    placeholder="Chọn trang"
                    options={pageOptions}
                    value={page}
                    onChange={(v) => { setPage(v) }}
                    style={{ width: 120 }}
                />
                <Slider
                    key='slider1'
                    columns={columns}
                    setColumns={setColumns}
                    sliderImages={imagesData?.data?.sliderImages}
                    slugs={imagesData?.data?.slugs}
                    title="Slider"
                    itemHeight={90}
                />
                <div className="w-2/3">
                    <Slider
                        key='slider2'
                        columns={columns2}
                        setColumns={setColumns2}
                        sliderImages={imagesData?.data?.sliderImages2}
                        slugs={imagesData?.data?.slugs}
                        title="Banner"
                        itemHeight={110}
                    />
                </div>

                {/* <Banner
                    bannerImage={bannerImage}
                    setBannerImage={setBannerImage}
                    editImage={editImage}
                /> */}

            </div>
            <DrawerFormBtn divRef={divRef} isEdit={true} onClick={update} zIndex={50} />
        </>
    );
}

export default AdminSliderBanner;