import { genericSlice, genericThunk } from '~/redux/utils';
import { categoryCourseApi } from '~/apis/categoryCourseApi';

const name = 'categoryCourses'

export const getCategoryCouresApi = genericThunk(`${name}/get`, categoryCourseApi.get);
export const addCategoryCouresApi = genericThunk(`${name}/add`, categoryCourseApi.add);
export const delCategoryCouresApi = genericThunk(`${name}/del`, categoryCourseApi.del);
export const putCategoryCouresApi = genericThunk(`${name}/put`, categoryCourseApi.put);

const categoryCoursesSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getCategoryCouresApi],
    addApi: [addCategoryCouresApi],
    delApi: [delCategoryCouresApi],
    putApi: [putCategoryCouresApi]
});

export default categoryCoursesSlice.reducer;


