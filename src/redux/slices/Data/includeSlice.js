import { genericSlice, genericThunk } from '~/redux/utils';
import { includeApi } from '~/apis/includeApi';

const name = 'include'

export const getIncludeApi = genericThunk(`${name}/get`, includeApi.get);
export const addIncludeApi = genericThunk(`${name}/add`, includeApi.add);
export const delIncludeApi = genericThunk(`${name}/del`, includeApi.del);
export const putIncludeApi = genericThunk(`${name}/put`, includeApi.put);

const includeSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getIncludeApi],
    addApi: [addIncludeApi],
    delApi: [delIncludeApi],
    putApi: [putIncludeApi]
});

export default includeSlice.reducer;

