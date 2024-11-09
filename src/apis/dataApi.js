import { instance } from ".";

const baseURL = "/v2/data";

const backup = async () => {
    const response = await instance.post(`${baseURL}/backup`)
    return response
}

const restore = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

const getDataMediaUsage = async (body) => {
    const response = await instance.get(`${baseURL}/media`, body)
    return response
}

const getDataUsage = async (body) => {
    const response = await instance.get(`${baseURL}/usage`, body)
    return response
}

const dowBackupFile = async (body) => {
    const response = await instance.post(`${baseURL}/dow-file`, body)
    return response
}

const dowBackupData = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
    return response
}

export const dataApi = {
    backup,
    restore,
    getDataMediaUsage,
    dowBackupFile,
    dowBackupData,
    getDataUsage
}