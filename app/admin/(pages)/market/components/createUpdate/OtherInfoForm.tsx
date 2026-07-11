import { useDeleteMutation } from "@/services/api/common";
import { useState } from "react";
import { CloseOutlined } from '@ant-design/icons';
import { MARKET } from "@/constants/route";
import { showErrorToastr, showSuccessToastr } from "@/utils/toastr";
import { Button, Checkbox, Drawer } from "antd";
import { formatDate } from "@/utils/formatDate";
import { AdminLoading } from "@/components/admin/atoms/Loading";
import ShowCreateDrawer from "@/components/admin/organisms/ShowCreateDrawer";
import SelectTourForm from "./SelectToursForm";
import OtherInfoMenu from "./OtherInfoMenu";
import { useConfirm } from "@/components/admin/atoms/useConfirm";
import CkeditorTabs from "@/components/admin/organisms/CkeditorTabs";
import dayjs from 'dayjs';

const OtherInfoForm = (props: any) => {
    const { otherInfoList, setOtherInfoList, tours, fields, getFormValue, isChange } = props;
    const { handleConfirm, confirmModal } = useConfirm();

    const [loadingState, setLoadingState] = useState<any>(false);
    const [datesDrawer, setDatesDrawer] = useState<any>(false);
    const [selectedKey, setSelectedKey] = useState<any>(0);

    const [deleteApi] = useDeleteMutation();

    const confirmDelete = (index: any) => {
        handleConfirm(
            'Xác nhận xóa bài viết ' + index,
            () => deleteOtherInfo(index)
        );
    }
    const handleUpdateTours = (value: any, action: 'add' | 'remove') => {
        if (action === 'remove' && otherInfoList?.[selectedKey]?.tour_ids.length === 1) {
            confirmDelete(selectedKey);
        } else {
            setOtherInfoList((prevList: any) =>
                prevList.map((item: any, index: any) =>
                    index === selectedKey
                        ? {
                            ...item,
                            tour_ids: action === 'add'
                                ? [...item.tour_ids, value]
                                : item.tour_ids.filter((tour_id: any) => tour_id !== value)
                        }
                        : item
                )
            );
        }
        if (selectedKey > -1) {
            isChange.current = true;
        }
    };

    const deleteOtherInfo = async (index: any) => {
        const id = otherInfoList?.[index]?.id
        const updateState = () => {
            const updatedList = otherInfoList.filter((_: any, i: any) => i !== index)
            setOtherInfoList(updatedList);
            setSelectedKey(0);
        }
        if (!id) {
            updateState();
            return;
        }
        setLoadingState(true);
        const body = {
            url: MARKET + '/other-info/' + id,
        }

        await deleteApi(body)
            .unwrap()
            .then((payload: any) => {
                if (payload?.success) {
                    showSuccessToastr(payload?.message);
                    updateState();
                }
            })
            .catch((error: any) => {
                if (error?.status) {
                    showErrorToastr(error?.data.message);
                }
            })
        setLoadingState(false);
        if (selectedKey > -1) {
            isChange.current = true;
        }
    };

    const tourIsSelected = (tourId: any) => {
        return otherInfoList.some((item: any) => item.tour_ids?.includes(tourId));
    }
    const isSelectedByCurrentMarket = (tourId: any) => {
        return otherInfoList?.[selectedKey]?.tour_ids?.includes(tourId);
    }

    const tourOptions = [...(tours || []), ...(otherInfoList?.[selectedKey]?.tours || [])]
        .filter((item: any) => {
            return isSelectedByCurrentMarket(item?.tour_id)
                || !tourIsSelected(item?.tour_id);
        })
        .map((item: any) => {
            return {
                value: item?.tour_id || '',
                label: `${item?.series_code || ''} (${formatDate(item?.flight_date) || ''})`,
                isSelected: isSelectedByCurrentMarket(item?.tour_id),
                disabled: !item?.flight_date || dayjs(item?.flight_date, 'YYYY-MM-DD').isBefore(dayjs().startOf('day'))
            };
        })
        .sort((a: any, b: any) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0))
        .sort((a: any, b: any) => (b.disabled ? 0 : 1) - (a.disabled ? 0 : 1));

    const articleMenu =
        <div className="relative my-2 mr-2 w-52">
            <div className="sticky top-14">
                <ShowCreateDrawer
                    title='Thêm bài viết tuyến tour'
                    btnText='Thêm bài viết'
                    width="550px"
                    destroyOnHidden={true}
                >
                    {(closeDrawer) => (
                        <SelectTourForm
                            isChange={isChange}
                            closeDrawer={closeDrawer}
                            otherInfoList={otherInfoList}
                            setOtherInfoList={setOtherInfoList}
                            tours={tours}
                            setSelectedKey={setSelectedKey}
                        />
                    )}
                </ShowCreateDrawer>
                <div className="mt-2" />
                <OtherInfoMenu
                    otherInfoList={otherInfoList}
                    setSelectedKey={setSelectedKey}
                    selectedKey={selectedKey}
                    confirmDelete={confirmDelete}
                    getFormValue={getFormValue}
                    openDatesDrawer={() => setDatesDrawer(true)}
                />
            </div>
        </div>

    return (
        <section>
            <AdminLoading isLoading={loadingState} />
            <div className="flex-1">
                <CkeditorTabs
                    fields={fields}
                    getFormValue={getFormValue}
                    selectedKey={selectedKey}
                    stickyTab
                    articleMenu={articleMenu}
                    histories={otherInfoList?.[selectedKey]?.histories}
                />
            </div>
            <Drawer
                title={'Chọn ngày cho bài viết ' + selectedKey}
                open={datesDrawer}
                width="550px"
                height="max-content"
                footer={null}
                closeIcon={null}
                className="custom-scrollbar"
                placement="right"
                destroyOnHidden
                onClose={() => setDatesDrawer(false)}
            >
                <div>
                    {selectedKey !== 0 &&
                        <div className="flex flex-wrap rounded-lg gap-2 mb-1 mt-3">
                            {tourOptions.map((option: any, index: any) => (
                                option.isSelected ?
                                    <div
                                        key={index}
                                        className={`flex items-center py-1 px-2 gap-2 rounded-md ${option.disabled ? 'bg-gray-200' : 'bg-blue-100'} `}
                                    >
                                        <Checkbox
                                            checked={true}
                                            onClick={() => handleUpdateTours(option.value, 'remove')}
                                            disabled={option.disabled}
                                        />
                                        {option.label}
                                        <CloseOutlined
                                            className="cursor-pointer"
                                            onClick={option.disabled ? undefined : () => handleUpdateTours(option.value, 'remove')}
                                        />
                                    </div>
                                    :
                                    <Button
                                        key={index}
                                        className="!px-2 gap-2"
                                        disabled={option.disabled}
                                        onClick={() => handleUpdateTours(option.value, 'add')}
                                    >
                                        <Checkbox checked={false} />
                                        {option.label}
                                    </Button>
                            ))}

                        </div>
                    }
                </div>
                {confirmModal}
            </Drawer>
            {confirmModal}
        </section>
    )
}

export default OtherInfoForm;