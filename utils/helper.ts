import { DrawerProps } from "antd";
import { formatPrice } from "./formatPrice";
import { formatDate } from "./formatDate";
import { commonCkeditorTabFields, responseMessages } from "@/constants/ui";
import { showErrorToastr, showSuccessToastr } from "./toastr";
import dayjs from 'dayjs';
import { SlugPermalink } from "@/interfaces/slugPermalink";
import moment, { Moment } from "moment";
import { IListingDetail } from "@/interfaces/listing";

export const formatSelectArray = (data: any, value = '', label = '') => {
    return (data || []).map((item: any) => ({
        value: item?.[value] || '',
        label: item?.[label] || '',
    }));
};

export const objectToArray = (obj: any) => {
    return Object.entries((obj || {})).map(([key, value]) => ({
        value: key,
        label: value,
    }));
}

export const addKeyForList = (list: any, valueName = '') => {
    return (list || []).map((item: any, index: number) => ({
        key: valueName ? item[valueName] : index,
        ...item
    }));
};

export const convertRangePickerDates = (dates: any) => {
    if (!dates) {
        return { fromDate: null, toDate: null };
    }
    const fromDate = dates[0] ? dates[0].format('YYYY-MM-DD') : '';
    const toDate = dates[1] ? dates[1].format('YYYY-MM-DD') : '';
    return { fromDate, toDate };
};

export const formatRangePickerDates = (fromDate: any, toDate: any) => {
    const formatDate = (date: any) => {
        return date ? dayjs(date) : null;
    }
    return ([formatDate(fromDate), formatDate(toDate)])
};

export const getUpdateDrawerProps = (width?: any) => {
    const drawerProps: Omit<DrawerProps, 'title' | 'open' | 'onClose'> = {
        width: width || '80%',
        height: 'max-content',
        footer: null,
        closeIcon: null,
        placement: 'right',
        destroyOnHidden: true,
    };
    return drawerProps;
}

export const formatAllPriceAndDateKey = (data: any, keyName?: any) => {
    if (!data) {
        return {};
    }
    const formatData = { ...data };
    Object.keys(data).forEach(key => {
        if (key.includes('price')) {
            formatData[key] = formatPrice(data[key]);
        } else if (key.includes('date')) {
            formatData[key] = formatDate(data[key]);
        } else if (key.includes('time')) {
            formatData[key] = data[key].split(':').slice(0, 2).join(':');
        } else if (key.includes('is_')) {
            formatData[key] = Number(data[key]);
        }
    });
    if (keyName) {
        formatData.key = formatData[keyName];
    }
    return formatData;
}

export const formatAllPriceAndDateKeyArray = (data: any, keyName?: any) => {
    return (data || []).map((i: any) => formatAllPriceAndDateKey(i, keyName))
}

export const getColumns = (columnsOptions: any, selectedColumns: any) => {
    return columnsOptions.reduce((acc: any, item: any) => {
        if ((selectedColumns || []).includes(item.key)) {
            acc.push(item);
        }
        return acc;
    }, []);
}

export const getTabContents = (record: any, field?: any) => {
    return (field || commonCkeditorTabFields).map((item: any) => ({
        ...item,
        content: record[item.key] || '',
    }))
}

export const handleApiRequest = async (apiCall: any, refetch?: any, setLoading?: any) => {
    if (setLoading) setLoading(true);
    try {
        const payload = await apiCall.unwrap();
        if (payload?.success) {
            showSuccessToastr(payload?.message);
            if (refetch) {
                refetch()
            };
        }
    } catch (error: any) {
        if (error?.status) {
            showErrorToastr(error?.data.message);
        }
    }
    finally {
        if (setLoading) setLoading(false);
    }
};

export const handleApiResponse = async (apiCall: any, successCallback: any, setLoading: any, messageApi?: any) => {
    setLoading(true);
    try {
        const payload = await apiCall.unwrap();
        if (payload?.success) {
            successCallback(payload);
        }
    } catch (error: any) {
        if (messageApi) {
            messageApi.open({
                type: 'error',
                content: getErrorMessage(error?.data?.message),
            });
        } else {
            showErrorToastr(error?.data?.message);
        }
    } finally {
        setLoading(false);
    }
};

export const calculateSelectWidth = (options: any) => {
    if (!options || options?.length === 0) return '150px';
    const longestLabel = options.reduce((acc: any, option: any) => (option.label.length > acc.length ? option.label : acc), '');
    const lengthOfLongestLabel = longestLabel.length;
    return `${lengthOfLongestLabel * 9}px`;
};

export const clickClassButton = (className: string) => {
    (document?.querySelector("." + className) as HTMLElement)?.click?.();
}

/**
 * 
 * @param value are: Object, Array, String
 * @returns 
 */
export const isEmpty = (value: any) => {
    if (!value) {
        return true;
    }
    if (typeof value === "object") {
        if (Array.isArray(value)) {
            return value.length > 0 ? false : true;
        } else {
            return Object.keys(value).length > 0 ? false : true;
        }
    } else if (typeof value === "string") {
        return value === '' ? true : false;
    }
}

export const getErrorMessage = (message: string) => {
    if (message?.includes(':')) {
        const [title, description] = message.split(":");
        message = ((responseMessages[title] ? responseMessages[title] + ': ' : '') + (responseMessages[description] || description));
    } else {
        message = responseMessages[message] || message;
    }
    return message || 'Lỗi hệ thống'
}

export const getSlug = (slugPermalink: SlugPermalink) => {
    return (slugPermalink?.parent_id && slugPermalink?.parent_id !== 0) ?
        (slugPermalink?.slug || '').split('/').pop() :
        slugPermalink?.slug || ''
}

export const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const normalizeUrl = (url: any) => {
    if (!url) return '/';
    return url.startsWith('/') ? url : `/${url}`;
};

export const appendFormData = (values: any, formData: FormData) => {
    Object.keys(values).forEach((key) => {
        if (key === 'image') {
            const imageFile = values.image?.[0]?.originFileObj || values.image?.[0]?.url;
            if (imageFile) {
                formData.append('image', imageFile);
            }
        } else {
            if (values[key]) {
                formData.append(key, values[key]);
            }
        }
    });
};

// Hàm validate kiểm tra ngày phải trước ngày hôm nay
export const validateDateBeforeToday = (
    _: unknown,
    value: Moment | null
): Promise<void> => {
    if (!value) {
        return Promise.reject(new Error('Ngày hiển thị là bắt buộc'));
    }
    if (value.isAfter(moment(), 'day')) {
        return Promise.reject(new Error('Ngày hiển thị phải trước ngày hôm nay'));
    }
    return Promise.resolve();
};

export const getSlugFromUrl = (url: string) => {
    return (url || '').replace(/^.*\/\/[^\/]+\/?/, '');
}

export const handleSortTable = (sorter: any, setSortBy: any) => {
    setSortBy(
        sorter.field ?
            `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`
            : ''
    );
};

export const generateSeriesCode = (tour: IListingDetail, prefix: string = 'DL') => {
    const timeFormat = 'HH:mm';
    const flightDate = tour.flight_date ? dayjs(tour.flight_date).format('DDMM') : '';
    const takeoff_time = tour.takeoff_time ? dayjs(tour.takeoff_time, timeFormat).format('HHmm') : '';
    const takeoff_time_back = tour.takeoff_time_back ? dayjs(tour.takeoff_time_back, timeFormat).format('HHmm') : '';
    const duration = `${tour.day_number ?? '5'}N${tour.day_number ?? '4'}D`;

    const departureFlight = `${tour.shcb || ''}.${takeoff_time}`;
    const returnFlight = `${tour.shcb_back || ''}.${takeoff_time_back}`;

    return `${prefix}.${flightDate}.${duration}.${departureFlight}.${returnFlight}`;
};
