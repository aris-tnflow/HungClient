import { genericSlice, genericThunk } from '~/redux/utils';
import { userApi } from '~/apis/userApi';

const name = 'users'

export const getUsersApi = genericThunk(`${name}/get`, userApi.get);
export const searchUserApi = genericThunk(`${name}/search`, userApi.search);
export const delUsersApi = genericThunk(`${name}/del`, userApi.del);
export const putUsersApi = genericThunk(`${name}/put`, userApi.put);
export const putUsersNotifyApi = genericThunk(`${name}/putNotify`, userApi.putUserNotify);

const usersSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getUsersApi, searchUserApi],
    delApi: [delUsersApi],
    putApi: [putUsersApi]
});

export default usersSlice.reducer;

