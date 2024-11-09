import { instance } from ".";

const baseURL = "/v2/setting";

const getKey = async (body) => {
    const response = await instance.get(`${baseURL}/${body}`)
    return response
}

const get = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const put = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

export const dataSettingApi = {
    getKey,
    get,
    put
}