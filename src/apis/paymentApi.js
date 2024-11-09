import { instance } from ".";

const baseURL = "v1/payment";

const MoMo = async () => {
    const response = await instance.post(`${baseURL}/momo`)
    return response
}

const Bank = async (body) => {
    const response = await instance.post(`${baseURL}/bank`, body)
    return response
}

export const paymentApi = {
    MoMo,
    Bank
}