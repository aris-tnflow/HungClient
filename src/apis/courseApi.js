import { instance } from ".";

const baseURL = "/v2/courser";

const get = async (body) => {
    const response = await instance.get(`${baseURL}?page=${body?.page || 1}&limit=${body?.limit || 9999}`)
    return response
}

const sigAdmin = async (slug) => {
    const response = await instance.get(`${baseURL}/sig-admin/${slug}`)
    return response
}

const sig = async (slug) => {
    const response = await instance.get(`${baseURL}/slug/${slug}`)
    return response
}

const add = async (body) => {
    const response = await instance.post(`${baseURL}`, body)
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

const del = async (id) => {
    const response = await instance.delete(`${baseURL}/${id}`)
    return response
}

const cart = async (body) => {
    const response = await instance.post(`${baseURL}/cart`, body)
    return response
}

const outstand = async (body) => {
    const response = await instance.post(`${baseURL}/outstand`, body)
    return response
}

const free = async (body) => {
    const response = await instance.get(`${baseURL}/free`, body)
    return response
}

const search = async (body) => {
    const response = await instance.get(`${baseURL}/search?category-course=${body.categoryCourse || ''}&price-course=${body.priceCourse || ''}`, body)
    return response
}

const checkCourseUser = async (body) => {
    const response = await instance.post(`${baseURL}/user`, body)
    return response
}

export const courseApi = {
    get,
    sig,
    add,
    put,
    putOrder,
    del,
    cart,
    sigAdmin,
    outstand,
    checkCourseUser,
    search,
    free
}

const getModuleUser = async (body) => {
    const response = await instance.get(`${baseURL}/user/module/${body.id}`, body)
    return response
}

const getModule = async (body) => {
    const response = await instance.get(`${baseURL}/admin/module/${body.id}`, body)
    return response
}

const addModule = async (body) => {
    const response = await instance.post(`${baseURL}/admin/module/${body.id}`, body)
    return response
}

const putModule = async (body) => {
    const response = await instance.put(`${baseURL}/admin/module/${body.id}/moduleId/${body.moduleId}`, body)
    return response
}

const delModule = async (body) => {
    const response = await instance.delete(`${baseURL}/admin/module/${body.id}/moduleId/${body.moduleId}`, body)
    return response
}

export const courseModuleApi = {
    getModuleUser,
    getModule,
    addModule,
    putModule,
    delModule
}

const getChildren = async (body) => {
    const response = await instance.get(`${baseURL}/admin/children/${body.id}`, body)
    return response
}

const addChildren = async (body) => {
    const response = await instance.post(`${baseURL}/admin/children/${body.id}`, body)
    return response
}

const getChildrenPage = async (body) => {
    const response = await instance.get(`${baseURL}/admin/children/${body.id}/childId/${body.childId}`)
    return response
}

const putChildren = async (body) => {
    const response = await instance.put(`${baseURL}/admin/children/${body.id}/childId/${body.childId}`, body)
    return response
}

const delChildren = async (body) => {
    const response = await instance.delete(`${baseURL}/admin/children/${body.id}/childId/${body.childId}`)
    return response
}

export const courseChildrenApi = {
    getChildren,
    getChildrenPage,
    addChildren,
    putChildren,
    delChildren
}

