import { genericSlice, genericThunk } from '../utils';
import { layoutApi } from '~/apis/layoutApi';

const name = 'menu';

export const getMenuApi = genericThunk(`${name}/get`, layoutApi.getLayout);

const menuSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getMenuApi],
});

export default menuSlice.reducer;
