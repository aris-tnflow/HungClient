import { genericSlice, genericThunk } from '~/redux/utils';
import { courseApi } from '~/apis/courseApi';

const name = 'courses'

export const getCourseApi = genericThunk(`${name}/get`, courseApi.get);
export const addCourseApi = genericThunk(`${name}/add`, courseApi.add);
export const delCourseApi = genericThunk(`${name}/del`, courseApi.del);
export const putCourseApi = genericThunk(`${name}/put`, courseApi.put);
export const putOrderCourseApi = genericThunk(`${name}/put-order`, courseApi.putOrder);

const coursesSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getCourseApi, putOrderCourseApi],
    addApi: [addCourseApi],
    delApi: [delCourseApi],
    putApi: [putCourseApi]
});

export default coursesSlice.reducer;