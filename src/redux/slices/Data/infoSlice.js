import { genericSlice, genericThunk } from '~/redux/utils';
import { infoApi } from '~/apis/infoApi';

const name = 'info';

export const getInfoApi = genericThunk(`${name}/get`, infoApi.get);
export const putInfoApi = genericThunk(`${name}/put`, infoApi.put);

const infoSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getInfoApi],
    putApi: [putInfoApi],
});

export default infoSlice.reducer;

