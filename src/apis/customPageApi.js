import { instance } from ".";

const baseURL = '/v1/custom-page'

const getSingleMasonry = async (slug) => {
    const response = await instance.get(`${baseURL}/masonry/${slug}`)
    return response
}

const addMasonry = async (body) => {
    const response = await instance.post(`${baseURL}/masonry`, body)
    return response
}

const updateMasonry = async (slug, body) => {
    const response = await instance.put(`${baseURL}/masonry/${slug}`, body)
    return response
}

const delMasonry = async (slug) => {
    const response = await instance.delete(`${baseURL}/masonry-slug/${slug}`)
    return response
}

export const masonryPageApi = {
    getSingleMasonry,
    addMasonry,
    delMasonry,
    updateMasonry
}