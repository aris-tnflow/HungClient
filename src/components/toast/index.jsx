import { notification, Spin } from "antd";

const toastNotification = (key = '', type, message, description, duration = 3) => {
    notification[type]({
        key: key,
        message: message,
        description: description,
        placement: 'bottom',
        showProgress: true,
        pauseOnHover: false,
        duration: duration,
    });
};

export const toastSuccess = (key = '', message, description, duration) => {
    toastNotification(key, 'success', message, description, duration);
};

export const toastError = (key = '', message, description, duration) => {
    toastNotification(key, 'error', message, description, duration);
};

export const toastWarning = (key = '', message, description, duration) => {
    toastNotification(key, 'warning', message, description, duration);
};

export const toastInfo = (key = '', message, description, duration) => {
    toastNotification(key, 'info', message, description, duration);
};

export const toastLoading = (key = '', message, duration = 0) => {
    toastNotification(key, 'info', message, <Spin />, duration);
};