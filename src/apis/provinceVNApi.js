import { instance } from ".";

const baseURL = "/v1/provinces";

const province = async () => {
    const response = await instance.get(`${baseURL}`);
    return response;
}

const district = async (id) => {
    const response = await instance.get(`${baseURL}/district/${id}`);
    return response;
}

const ward = async (id) => {
    const response = await instance.get(`${baseURL}/ward/${id}`);
    return response;
}

export const provinceApi = {
    province,
    district,
    ward
}
