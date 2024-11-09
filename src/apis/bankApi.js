import axios from 'axios';

const baseURL = "https://api.vietqr.io/v2/banks";

const get = async () => {
    const response = await axios.get(`${baseURL}`);
    return response.data;
}

export const bankApi = {
    get
}
