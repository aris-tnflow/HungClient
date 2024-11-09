/* eslint-disable no-undef */
export const id_layout = '66cd8ec69bd4c9535d92a267'
export const id_info = '66f39a64dda5bb6dc8edafb6'
export const id_keyBank = '66f3b16b327e2d2f20f2de85'
export const forgotPass = '66fe2747d0a2531a5b9bb9f4'

export const TYPE_EMPLOYEE = {
    admin: "admin",
    user: "user",
    adminControl: "admin-control",
};

export const baseURL = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:8082" //https://api.tnflow.site  http://localhost:8082
    : process.env.BUILD_MODE === 'production'
        ? import.meta.env.VITE_API_URL : '';

export const baseClient = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:5173"
    : process.env.BUILD_MODE === 'production'
        ? import.meta.env.VITE_CLIENT_URL : '';
