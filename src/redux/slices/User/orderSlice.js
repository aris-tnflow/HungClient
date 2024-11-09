import { genericSlice, genericThunk } from '~/redux/utils';
import { orderApi } from '~/apis/orderApi';

const name = 'orderUser'

export const getOrderUserApi = genericThunk(`${name}/get`, orderApi.sig);

const orderUserSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getOrderUserApi],
});

export default orderUserSlice.reducer;


