export const floatRoute = (pathname) => {
    return pathname.startsWith('/admin/page-custom');
};

export const adminRoute = (pathname) => {
    return pathname.startsWith('/admin');
};