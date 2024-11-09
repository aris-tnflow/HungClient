import { instance } from ".";

const baseURL = '/v1/layout'

const getLayout = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const getLayoutEdit = async () => {
    const response = await instance.get(`${baseURL}/edit`)
    return response
}

const putLayout = async (id, body) => {
    const response = await instance.put(`${baseURL}/${id}`, body)
    return response
}

export const layoutApi = {
    getLayout,
    getLayoutEdit,
    putLayout,
}