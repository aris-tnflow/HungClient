import { instance } from ".";

const baseURL = "/v1/user";

const search = async (body) => {
    const searchParams = new URLSearchParams(body || {});
    const query = searchParams.toString();
    const response = await instance.get(`${baseURL}/search?${query}`);
    return response;
}

const get = async (body) => {
    const response = await instance.get(`${baseURL}?page=${body?.page || 1}&limit=${body?.limit || 10}`)
    return response
}

const getSig = async (id) => {
    const response = await instance.get(`${baseURL}/${id}`)
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

const putUser = async (body) => {
    const response = await instance.put(`${baseURL}/user/${body.id}`, body)
    return response
}

const putCourseByEmails = async (body) => {
    const response = await instance.put(`${baseURL}/emails`, body)
    return response
}

const putUserNotify = async (body) => {
    const response = await instance.put(`${baseURL}/notify/${body.id}`, body)
    return response
}

const putPassWord = async (body) => {
    const response = await instance.put(`${baseURL}/password`, body)
    return response
}

const putUserForgot = async (body) => {
    const response = await instance.put(`${baseURL}/user/forgot-password`, body)
    return response
}

const putVideo = async (body) => {
    const response = await instance.put(`${baseURL}/video/${body.id}`, body)
    return response
}

const putVideoUser = async (body) => {
    const response = await instance.put(`${baseURL}/video-user`, body)
    return response
}

const checkEmail = async (body) => {
    const response = await instance.post(`${baseURL}/check-email`, body)
    return response
}

const checkDataOld = async (body) => {
    const response = await instance.post(`${baseURL}/check-data-old`, body)
    return response
}

const checkCode = async (body) => {
    const response = await instance.post(`${baseURL}/check-code`, body)
    return response
}

export const userApi = {
    get,
    getSig,
    del,
    put,
    putUser,
    putUserNotify,
    putVideoUser,
    putUserForgot,
    putCourseByEmails,
    putVideo,
    checkEmail,
    checkCode,
    checkDataOld,
    putPassWord,
    search
}