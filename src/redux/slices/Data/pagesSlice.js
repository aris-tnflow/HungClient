import { genericSlice, genericThunk } from '~/redux/utils';
import { pagesApi } from '~/apis/pagesApi';

const name = 'pages';

export const getPageApi = genericThunk(`${name}/get`, pagesApi.get);
export const searchPageApi = genericThunk(`${name}/search`, pagesApi.search);
export const addPageApi = genericThunk(`${name}/add`, pagesApi.add);
export const delPageApi = genericThunk(`${name}/del`, pagesApi.del);
export const putPageApi = genericThunk(`${name}/put`, pagesApi.put);
export const putOrderApi = genericThunk(`${name}/putOrder`, pagesApi.putOrder);
export const copyPageApi = genericThunk(`${name}/copy`, pagesApi.copy);

const pageSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getPageApi, putOrderApi, searchPageApi],
    addApi: [addPageApi, copyPageApi],
    delApi: [delPageApi],
    putApi: [putPageApi],
});

export default pageSlice.reducer;

