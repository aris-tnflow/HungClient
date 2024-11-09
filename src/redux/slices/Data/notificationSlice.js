import { genericSlice, genericThunk } from '~/redux/utils';
import { notificationApi } from '~/apis/notificationApi';

const name = 'notification';

export const getNotifyApi = genericThunk(`${name}/get`, notificationApi.get);
export const addNotifyApi = genericThunk(`${name}/add`, notificationApi.add);
export const putNotifyApi = genericThunk(`${name}/put`, notificationApi.put);
export const delNotifyApi = genericThunk(`${name}/del`, notificationApi.del);

const notificationSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getNotifyApi],
    addApi: [addNotifyApi],
    putApi: [putNotifyApi],
    delApi: [delNotifyApi],
    reducers: {
        resetLoading: (state) => {
            state.loading = true;
        },
        removeNotify: (state, action) => {
            const id = action.payload;
            state[name].newData = state[name].newData.filter(notify => notify._id !== id);
        },
    }
});

export const { removeNotify, resetLoading } = notificationSlice.actions;

export default notificationSlice.reducer;
