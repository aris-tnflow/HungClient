import { instance } from ".";

const baseURL = "/v2/order";

const search = async (body) => {
    const { page = 1, limit = 10, ...searchParams } = body || {};
    const query = new URLSearchParams(searchParams).toString();
    const response = await instance.get(`${baseURL}/search?page=${page}&limit=${limit}&${query}`);
    return response;
}

const get = async (body) => {
    const response = await instance.get(`${baseURL}?page=${body?.page || 1}&limit=${body?.limit || 10}`)
    return response
}

const getStats = async () => {
    const response = await instance.get(`${baseURL}/stats`)
    return response
}

const getWeekly = async () => {
    const response = await instance.get(`${baseURL}/weekly`)
    return response
}

const getTotal = async () => {
    const response = await instance.get(`${baseURL}/total`)
    return response
}

const sig = async (id) => {
    const response = await instance.get(`${baseURL}/${id}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

const check = async (body) => {
    const response = await instance.post(`${baseURL}/check-order`, body)
    return response
}

const delUnPaid = async () => {
    const response = await instance.delete(`${baseURL}/del-unpaid`)
    return response
}

const getOrderId = async (id) => {
    const response = await instance.get(`${baseURL}/order-id/${id}`)
    return response
}

const putOrderId = async (body) => {
    const response = await instance.put(`${baseURL}/order-id/${body.orderId}`, body)
    return response
}

const revenue = async () => {
    const response = await instance.get(`${baseURL}/revenue`)
    return response
}

export const orderApi = {
    get,
    add,
    del,
    search,
    sig,
    revenue,
    delUnPaid,
    putOrderId,
    getOrderId,
    check,
    getTotal,
    getWeekly,
    getStats,
}