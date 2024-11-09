import { genericSlice, genericThunk } from '~/redux/utils';
import { notificationApi } from '~/apis/notificationApi';

const name = 'notificationPublic';

export const getNotifyPublicApi = genericThunk(`${name}/get`, notificationApi.get);

const notificationSlice = genericSlice({
    name: name,
    initialState: {
        [name]: [],
        loading: true,
        error: false,
    },
    getApi: [getNotifyPublicApi],
    reducers: {
        removeNotifyPublic: (state, action) => {
            const id = action.payload;
            state[name].newData = state[name].newData.filter(notify => notify._id !== id);
        },
    }
});

export const { removeNotifyPublic } = notificationSlice.actions;

export default notificationSlice.reducer;
