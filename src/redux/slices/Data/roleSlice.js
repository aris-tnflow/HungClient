import { genericSlice, genericThunk } from '~/redux/utils';
import { roleApi } from '~/apis/roleApi';

const name = 'roles'

export const getRoleApi = genericThunk(`${name}/get`, roleApi.get);
export const addRoleApi = genericThunk(`${name}/add`, roleApi.add);
export const delRoleApi = genericThunk(`${name}/del`, roleApi.del);
export const putRoleApi = genericThunk(`${name}/put`, roleApi.put);

const roleSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getRoleApi],
    addApi: [addRoleApi],
    delApi: [delRoleApi],
    putApi: [putRoleApi]
});

export default roleSlice.reducer;
