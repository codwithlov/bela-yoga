import { NOT_UPDATED_INFORMATION } from '@/constants/ui';
import dayjs, { ManipulateType } from 'dayjs';

export const formatDate = (date_time: any, $type?: string) => {
    if (!date_time) return '';
    const dateTimeToFormat = new Date(date_time);
    if (isNaN(dateTimeToFormat.getTime())) return '';
    const dayParse = dateTimeToFormat.getDate();
    let day = dayParse < 10 ? '0' + dayParse : dayParse;
    const monthParse = dateTimeToFormat.getMonth() + 1;
    let month = monthParse < 10 ? '0' + monthParse : monthParse;

    switch ($type) {
        case 'yyyy-mm-dd': {
            let year = dateTimeToFormat.getFullYear();
            return year + '-' + month + '-' + day;
        } break;
        default: {
            let year = dateTimeToFormat.getFullYear();
            return day + '/' + month + '/' + year;
        } break;
    }
}

export const formatDateTime = (date_time: string, format: string = 'YYYY/MM/DD HH:mm:ss') => {
    if (!date_time) return '';
    return dayjs(date_time).format(format);
}

export const formatTime = (time: string): string => {
    if (!time) {
        return NOT_UPDATED_INFORMATION;
    }
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

export const getPastDate = (amount: number, unit?: ManipulateType) => {
    return dayjs().subtract(amount, unit || 'day').format("YYYY-MM-DD HH:mm:ss");
}

export const isBeforeNow = (date_time: string) => {
    return dayjs().isBefore(dayjs(date_time));
}