import { genericSlice, genericThunk } from '~/redux/utils';
import { orderApi } from '~/apis/orderApi';

const name = 'order';

export const getOrderApi = genericThunk(`${name}/get`, orderApi.get);
export const searchPageApi = genericThunk(`${name}/search`, orderApi.search);

const roleSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getOrderApi, searchPageApi],
});

export default roleSlice.reducer;

