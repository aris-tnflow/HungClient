import { genericSlice, genericThunk } from '~/redux/utils';
import { keyBankApi } from '~/apis/keyBankApi';

const name = 'keyBank';

export const getKeyBankApi = genericThunk(`${name}/get`, keyBankApi.getAdmin);
export const putKeyBankApi = genericThunk(`${name}/put`, keyBankApi.put);

const bankSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getKeyBankApi],
    putApi: [putKeyBankApi],
});

export default bankSlice.reducer;

