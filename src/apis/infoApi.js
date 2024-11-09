import { instance } from ".";

const baseURL = "/v2/info";

const get = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

export const infoApi = {
    get,
    put,
}