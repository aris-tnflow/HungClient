import { genericSlice, genericThunk } from '~/redux/utils';
import { groupPageApi } from '~/apis/groupPageApi';

const name = 'groupPages'

export const getGroupApi = genericThunk(`${name}/get`, groupPageApi.get);
export const addGroupApi = genericThunk(`${name}/add`, groupPageApi.add);
export const delGroupApi = genericThunk(`${name}/del`, groupPageApi.del);
export const putGroupApi = genericThunk(`${name}/put`, groupPageApi.put);

const roleSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getGroupApi],
    addApi: [addGroupApi],
    delApi: [delGroupApi],
    putApi: [putGroupApi]
});

export default roleSlice.reducer;

