import { genericSlice, genericThunk } from '~/redux/utils';
import { dataSettingApi } from '~/apis/settingApi'

const name = 'apiKey';

export const getKeyApi = genericThunk(`${name}/get`, dataSettingApi.getKey);

const apiKeySlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getKeyApi],
});

export default apiKeySlice.reducer;

