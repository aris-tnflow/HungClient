import { instance } from ".";

const baseURL = "/v2/key-bank";

const get = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const getAdmin = async () => {
    const response = await instance.get(`${baseURL}/admin`)
    return response
}

const put = async (body) => {
    const response = await instance.put(`${baseURL}/${body.id}`, body)
    return response
}

export const keyBankApi = {
    getAdmin,
    get,
    put,
}