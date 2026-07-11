'use client';
import React, { useEffect, useState } from 'react'
import { MARKET } from '@/constants/route';
import { Drawer } from 'antd';
import { useGetDataQuery } from '@/services/api/common';
import { showErrorToastr } from '@/utils/toastr';
import OtherInfoMenu from '../createUpdate/OtherInfoMenu';
import { getTabContents } from '@/utils/helper';
import { marketCkeditorTabFields } from '@/constants/ui';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { formatDate } from '@/utils/formatDate';
import HtmlContent from '@/components/admin/organisms/HtmlContent';

const ArticleDrawer = (props: any) => {
    const { openDrawer, closeDrawer, marketId } = props;
    const [otherInfoList, setOtherInfoList] = useState<any>([]);
    const [selectedKey, setSelectedKey] = useState<any>(0);
    const [content, setContent] = useState<any>(0);
    const [datesDrawer, setDatesDrawer] = useState<any>(false);

    const { data: marketData, isFetching } = useGetDataQuery(
        `${MARKET}/detail/${marketId}`,
        { refetchOnMountOrArgChange: true, skip: !marketId || !openDrawer });

    useEffect(() => {
        if (!marketData?.data?.market_id && openDrawer && !isFetching) {
            showErrorToastr('Có lỗi xảy ra');
            closeDrawer();
        } else if (marketData) {
            const otherInfos = marketData.data?.other_infos || [];
            setOtherInfoList(otherInfos);
        }
    }, [closeDrawer, isFetching, marketData, openDrawer])

    useEffect(() => {
        const temp = marketCkeditorTabFields.reduce((acc: any, field) => {
            acc[field.key] = otherInfoList?.[selectedKey]?.[field.key];
            return acc;
        }, {});
        setContent(temp);
    }, [otherInfoList, selectedKey])

    const articleMenu =
        <div>
            <div className="w-52" />
            <div className='fixed w-48'>
                <OtherInfoMenu
                    otherInfoList={otherInfoList}
                    setSelectedKey={setSelectedKey}
                    selectedKey={selectedKey}
                    className=" mt-3 min-h-60 "
                    openDatesDrawer={() => setDatesDrawer(true)}
                />
            </div>
        </div>

    const formattedDates = [...(otherInfoList?.[selectedKey]?.tours || [])]
        .sort((a: any, b: any) => new Date(a.flight_date).getTime() - new Date(b.flight_date).getTime())
        .map((item: any) => {
            return `${item.series_code} (${formatDate(item.flight_date)})`;
        });

    return (
        <Drawer
            title={"Bài viết tuyến tour: " + (marketData?.data?.tour_name || '')}
            open={openDrawer}
            width="90%"
            height="max-content"
            footer={null}
            closeIcon={null}
            placement='right'
            destroyOnHidden
            className="sgt_drawer sgt_drawer_tour_detail custom-scrollbar"
            onClose={() => { setSelectedKey(0); closeDrawer(); }}
        >
            <AdminLoading isLoading={isFetching} />

            <HtmlContent
                multiple
                tabContents={getTabContents(content, marketCkeditorTabFields)}
                articleMenu={articleMenu}
            />
            <Drawer
                title={'Ngày áp dụng bài viết ' + selectedKey}
                open={datesDrawer}
                width="500px"
                height="max-content"
                footer={null}
                closeIcon={null}
                className="custom-scrollbar"
                placement="right"
                destroyOnHidden
                onClose={() => setDatesDrawer(false)}
            >
                <div>
                    {(formattedDates || []).map((item: any, index: any) =>
                        <p key={index} className='mt-2'>{item}</p>
                    )}
                </div>
            </Drawer>
        </Drawer>
    )
}

export default ArticleDrawer