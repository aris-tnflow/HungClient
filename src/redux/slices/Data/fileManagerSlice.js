import { genericSlice, genericThunk } from '~/redux/utils';
import { fileMangerApi, folderMangerApi } from '~/apis/fileMangerApi';

const name = 'file'

export const getFileInFoldersApi = genericThunk(`${name}/get`, fileMangerApi.filesInFolder);
export const delFileInFoldersApi = genericThunk(`${name}/del`, fileMangerApi.delFile);

export const addFolderInFoldersApi = genericThunk(`${name}/addFolder`, folderMangerApi.addFolder);
export const delFolderInFoldersApi = genericThunk(`${name}/delolder`, folderMangerApi.delFolder);

const fileSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getFileInFoldersApi],
    addFileApi: [addFolderInFoldersApi],
    delFileApi: [delFileInFoldersApi, delFolderInFoldersApi],
});

export default fileSlice.reducer;