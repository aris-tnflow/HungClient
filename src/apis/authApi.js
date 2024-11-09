import { instance } from ".";

const baseURL = "/v2/auth";

export const register = async (body) => {
  const response = await instance.post(`${baseURL}/register`, body);
  return response;
};

export const login = async (body) => {
  const response = await instance.post(`${baseURL}/login`, body);
  return response;
};

export const loginGoogle = async (body) => {
  const response = await instance.post(`${baseURL}/login-google`, body);
  return response;
};

export const reAuth = async (body) => {
  const response = await instance.post(`${baseURL}/reauth`, body);
  return response;
};

export const changePassword = async (body) => {
  const response = await instance.post(`${baseURL}/change-password`, body);
  return response;
};

export const resetPassword = (body) => {
  return instance.put(`${baseURL}/reset-password`, body);
};
