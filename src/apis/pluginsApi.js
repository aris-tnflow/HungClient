import { instance } from ".";

const baseURL = '/v2/plugins'

const get = async (body) => {
    const response = await instance.get(`${baseURL}?page=${body?.page || 1}&limit=${body?.limit || 10}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body._id}`, body)
    return response
}

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

export const pluginsApi = {
    get,
    add,
    put,
    del
}