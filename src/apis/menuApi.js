import { instance } from ".";

const baseURL = '/v2/menu'

const allMenu = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const updateMenu = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

export const menuApi = {
    allMenu,
    updateMenu,
}