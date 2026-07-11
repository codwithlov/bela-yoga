import { responseMessages } from '@/constants/ui';
import { toast } from 'react-toastify';
import { getErrorMessage } from './helper';

export const showSuccessToastr = (message: string, useResponseMessage?: boolean) => {
    message = responseMessages[message] || message;
    toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const showErrorToastr = (message: string) => {
    message = getErrorMessage(message);
    toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
