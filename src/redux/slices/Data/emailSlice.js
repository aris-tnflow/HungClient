import { genericSlice, genericThunk } from '~/redux/utils';
import { emailApi } from '~/apis/emailAPi';

const name = 'email'

export const getEmailApi = genericThunk(`${name}/get`, emailApi.get);
export const addEmailApi = genericThunk(`${name}/add`, emailApi.add);
export const delEmailApi = genericThunk(`${name}/del`, emailApi.del);
export const putEmailApi = genericThunk(`${name}/put`, emailApi.put);

const emailSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getEmailApi],
    addApi: [addEmailApi],
    delApi: [delEmailApi],
    putApi: [putEmailApi]
});

export default emailSlice.reducer;