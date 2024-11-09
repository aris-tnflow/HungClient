import { genericSlice, genericThunk } from '~/redux/utils';
import { courseApi } from '~/apis/courseApi';

const name = 'courseUser'

export const getCourseUserApi = genericThunk(`${name}/get`, courseApi.cart);

const courseUserSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getCourseUserApi],
});

export default courseUserSlice.reducer;


