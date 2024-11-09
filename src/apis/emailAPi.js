import { instance } from ".";

const baseURL = "/v2/email";

const send = async (body) => {
    const response = await instance.post(`${baseURL}/send`, body)
    return response
}

const sendForgot = async (body) => {
    const response = await instance.post(`${baseURL}/forgot-password`, body)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const get = async (body) => {
    const response = await instance.get(`${baseURL}`, body)
    return response
}

const sig = async (body) => {
    const response = await instance.get(`${baseURL}/${body.id}`, body)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

const del = async (body) => {
    const response = await instance.delete(`${baseURL}/${body.id}`, body)
    return response
}

export const emailApi = {
    send,
    sendForgot,
    get,
    sig,
    add,
    put,
    del
}