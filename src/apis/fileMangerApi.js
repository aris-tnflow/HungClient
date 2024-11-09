import axios from "axios";
import { instance } from ".";

const baseURL = "/v1/file-manager";

const allFile = async () => {
    const response = await instance.get(`${baseURL}`)
    return response
}

const delFile = async (body) => {
    const response = await instance.delete(`${baseURL}/file`, { data: body })
    return response
}

const allFileImage = async () => {
    const response = await instance.get(`${baseURL}/images`)
    return response
}

const filterFile = async (body) => {
    const response = await instance.post(`${baseURL}/filter`, body)
    return response
}

const filesInFolder = async (body) => {
    const response = await instance.post(`${baseURL}/files-in-folder`, body)
    return response
}

const getFolder = async () => {
    const response = await instance.get(`${baseURL}/folder`)
    return response
}

const addFolder = async (body) => {
    const response = await instance.post(`${baseURL}/folder`, body)
    return response
}

const putFolder = async (body) => {
    const response = await instance.put(`${baseURL}/folder`, body)
    return response
}

const delFolder = async (body) => {
    const response = await instance.delete(`${baseURL}/folder`, { data: body })
    return response
}

const dowFolder = async (body) => {
    const response = await instance.post(`${baseURL}/dow-folder`, body)
    return response
}

export const fileMangerApi = {
    allFile,
    delFile,
    allFileImage,
    filterFile,
    filesInFolder
}

export const folderMangerApi = {
    getFolder,
    addFolder,
    delFolder,
    putFolder,
    dowFolder
}