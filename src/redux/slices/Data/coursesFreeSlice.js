import { genericSlice, genericThunk } from '~/redux/utils';
import { courseApi } from '~/apis/courseApi';

const name = 'free'

export const getCourseFreeApi = genericThunk(`${name}/free`, courseApi.free);

const freeSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getCourseFreeApi],
});

export default freeSlice.reducer;