import React, { useRef, useState } from 'react';
import { Checkbox } from 'antd';
import { formatDate } from '@/utils/formatDate';
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';

const SelectTourForm = (props: any) => {
    const { otherInfoList, setOtherInfoList, closeDrawer, tours, setSelectedKey, isChange } = props;
    const [selectedTours, setSelectedTours] = useState([]);

    const tourIsSelected = (tourId: any) => {
        return otherInfoList.some((item: any) => item.tour_ids?.includes(tourId));
    }

    const getOptions =
        (tours || [])
            .map((item: any) => ({
                value: item?.tour_id || '',
                label: `${item?.series_code || ''} (${formatDate(item?.flight_date) || ''})`,
                disabled: tourIsSelected(item?.tour_id),
            })).sort((a: any, b: any) => Number(a.disabled) - Number(b.disabled));

    const onClick = () => {
        const newOtherInfo = {
            id: null,
            tour_ids: selectedTours,
        }
        setSelectedKey(otherInfoList.length)
        setOtherInfoList(otherInfoList.concat(newOtherInfo));
        closeDrawer();
        isChange.current = true;
    }


    const onCheckboxChange = (checkedValues: any) => {
        setSelectedTours(checkedValues);
    };

    const divRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <div ref={divRef}>
                <h4 className='mb-2'>Chọn ngày cho bài viết</h4>
                <Checkbox.Group options={getOptions} onChange={onCheckboxChange} className='!mb-2 gap-y-1.5' />
            </div>
            <DrawerFormBtn divRef={divRef} text="Áp dụng" disabled={!selectedTours || selectedTours.length === 0} onClick={onClick} />

        </>
    );
};

export default SelectTourForm;