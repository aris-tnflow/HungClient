import axios from "axios";
import { toastError } from "~/components/toast";
import { baseURL } from "~/utils";

const date = new Date();

export const instanceFile = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

instanceFile.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instanceFile.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    toastError(date, 'Có Lỗi Xảy Ra!', error.response.data.message)
    return Promise.reject(error.response.data);
  }
);
