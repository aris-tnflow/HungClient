import { instance } from ".";
const baseURL = '/v2/pages'

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

const getGroupPage = async (body) => {
    const response = await instance.get(`${baseURL}/group-page/${body.slug}?page=${body?.page || 1}&limit=${body?.limit || 10}`)
    return response
}

const add = async (data) => {
    const response = await instance.post(`${baseURL}`, data)
    return response
}

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

const putOrder = async (body) => {
    const response = await instance.put(`${baseURL}/order`, body)
    return response
}

const copy = async (id) => {
    const response = await instance.post(`${baseURL}/${id}`)
    return response
}

const sig = async (slug) => {
    const response = await instance.get(`${baseURL}/slug/${slug}`)
    return response
}

const sigEdit = async (slug) => {
    const response = await instance.get(`${baseURL}/page-edit/${slug}`)
    return response
}

export const pagesApi = {
    get,
    getGroupPage,
    add,
    del,
    sig,
    put,
    putOrder,
    search,
    copy,
    sigEdit
}