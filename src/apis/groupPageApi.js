import { instance } from ".";

const baseURL = "/v2/group-page";

const get = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

const check = async (body) => {
    const response = await instance.get(`${baseURL}/check/${body}`)
    return response
}

export const groupPageApi = {
    get,
    add,
    put,
    del,
    check
}