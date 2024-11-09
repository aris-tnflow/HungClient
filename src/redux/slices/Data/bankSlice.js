import { genericSlice, genericThunk } from '~/redux/utils';
import { bankApi } from '~/apis/bankApi'

const name = 'bank';

export const getBankApi = genericThunk(`${name}/get`, bankApi.get);

const bankSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getBankApi],
});

export default bankSlice.reducer;

