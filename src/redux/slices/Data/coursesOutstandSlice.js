import { genericSlice, genericThunk } from '~/redux/utils';
import { courseApi } from '~/apis/courseApi';

const name = 'outstand'

export const getCourseOutstandApi = genericThunk(`${name}/outstand`, courseApi.outstand);

const outStandSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getCourseOutstandApi],
});

export default outStandSlice.reducer;