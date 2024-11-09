import { genericSlice, genericThunk } from '~/redux/utils';
import { orderApi } from '~/apis/orderApi';

const name = 'revenue'

export const getRevenueApi = genericThunk(`${name}/get`, orderApi.revenue);

const revenueSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getRevenueApi],
});

export default revenueSlice.reducer;

