import { instance } from ".";

const baseURL = "/v1/contact";

const get = async (body) => {
    const response = await instance.get(`${baseURL}/${body.filename}`, body)
    return response
}

const del = async (body) => {
    const response = await instance.delete(`${baseURL}`, { data: body })
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}`, body)
    return response
}

export const contactApi = {
    get,
    del,
    put
}