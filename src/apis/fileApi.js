import { instanceFile } from "./indexFile";
import { instance } from "./index";
const baseURL = '/v2/file'

const uploadFile = async (body) => {
    const response = await instanceFile.post(`${baseURL}`, body)
    return response
}

const fileBase64 = async (body) => {
    const response = await instance.post(`${baseURL}/base64`, body)
    return response
}

const file3D = async (body) => {
    const response = await instanceFile.post(`${baseURL}/3d`, body)
    return response
}

const video = async (body) => {
    const response = await instanceFile.post(`${baseURL}/video`, body)
    return response
}

export const fileApi = {
    uploadFile,
    fileBase64,
    file3D,
    video
}