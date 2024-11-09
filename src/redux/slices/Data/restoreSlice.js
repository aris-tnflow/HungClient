import { genericSlice, genericThunk } from '~/redux/utils';
import { fileMangerApi } from '~/apis/fileMangerApi';

const name = 'restore'

export const getFileInFolderApi = genericThunk(`${name}/get`, fileMangerApi.filesInFolder);

const categoryCoursesSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getFileInFolderApi],
});

export default categoryCoursesSlice.reducer;


