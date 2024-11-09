import { genericSlice, genericThunk } from '~/redux/utils';
import { pluginScriptApi } from '~/apis/pluginsScripApi';

const name = 'pluginsScript'

export const getPluginsScriptApi = genericThunk(`${name}/get`, pluginScriptApi.get);
export const addPageApi = genericThunk(`${name}/add`, pluginScriptApi.add);
export const delPageApi = genericThunk(`${name}/del`, pluginScriptApi.del);
export const putPageApi = genericThunk(`${name}/put`, pluginScriptApi.put);

const roleSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getPluginsScriptApi],
    addApi: [addPageApi],
    delApi: [delPageApi],
    putApi: [putPageApi]
});

export default roleSlice.reducer;

