import { genericSlice, genericThunk } from '~/redux/utils';
import { folderMangerApi } from '~/apis/fileMangerApi';

const name = 'folder'

export const getFoldersApi = genericThunk(`${name}/get`, folderMangerApi.getFolder);
// export const addCourseApi = genericThunk(`${name}/add`, courseApi.add);
// export const delCourseApi = genericThunk(`${name}/del`, courseApi.del);
// export const putCourseApi = genericThunk(`${name}/put`, courseApi.put);
// export const putOrderCourseApi = genericThunk(`${name}/put-order`, courseApi.putOrder);

const folderSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getFoldersApi],
    // addApi: [addCourseApi],
    // delApi: [delCourseApi],
    // putApi: [putCourseApi]
});

export default folderSlice.reducer;