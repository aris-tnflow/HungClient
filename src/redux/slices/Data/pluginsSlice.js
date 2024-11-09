import { genericSlice, genericThunk } from '~/redux/utils';
import { pluginsApi } from '~/apis/pluginsApi';

const name = 'plugins'

export const getPluginsApi = genericThunk(`${name}/get`, pluginsApi.get);
export const addPluginsApi = genericThunk(`${name}/add`, pluginsApi.add);
export const putPluginsApi = genericThunk(`${name}/put`, pluginsApi.put);
export const delPluginsApi = genericThunk(`${name}/del`, pluginsApi.del);

const categoryCoursesSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getPluginsApi],
    addApi: [addPluginsApi],
    putApi: [putPluginsApi],
    delApi: [delPluginsApi],
});

export default categoryCoursesSlice.reducer;


