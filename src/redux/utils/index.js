import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toastError, toastLoading, toastSuccess } from '~/components/toast';

export const genericSlice = ({
    name,
    initialState,
    getApi = [],
    addApi = [],
    delApi = [],
    addFileApi = [],
    delFileApi = [],
    putApi = [],
    reducers,
}) => {
    return createSlice({
        name,
        initialState,
        reducers: {
            ...reducers,
        },
        extraReducers: (builder) => {
            if (Array.isArray(getApi)) {
                getApi.forEach(api => {
                    builder
                        .addCase(api.pending, (state) => { state.loading = true; })
                        .addCase(api.fulfilled, (state, action) => {
                            state[name] = action.payload;
                            state.loading = false;
                            state.error = false;
                        })
                        .addCase(api.rejected, (state, action) => {
                            state[name] = action.payload;
                            state.loading = false;
                            state.error = true;
                        });
                });
            }

            if (Array.isArray(addApi)) {
                addApi.forEach(api => {
                    builder
                        .addCase(api.pending, (state) => { state.loading = true; })
                        .addCase(api.fulfilled, (state, action) => {
                            state[name].newData.unshift(action.payload.newData);
                            state.loading = false;
                            state.error = false;
                        })
                        .addCase(api.rejected, (state) => {
                            state.loading = false;
                            state.error = true;
                        });
                });
            }

            if (Array.isArray(delApi)) {
                delApi.forEach(api => {
                    builder
                        .addCase(api.pending, (state) => { state.loading = true; })
                        .addCase(api.fulfilled, (state, action) => {
                            state[name].newData = state[name].newData.filter(data => data._id !== action.payload._id);
                            state.loading = false;
                            state.error = false;
                        })
                        .addCase(api.rejected, (state) => {
                            state.loading = false;
                            state.error = true;
                        });
                });
            }

            if (Array.isArray(addFileApi)) {
                addFileApi.forEach(api => {
                    builder
                        .addCase(api.pending, (state) => { state.loading = true; })
                        .addCase(api.fulfilled, (state, action) => {
                            state[name].newData.children.unshift(action.payload.newData);
                            state.loading = false;
                            state.error = false;
                        })
                        .addCase(api.rejected, (state) => {
                            state.loading = false;
                            state.error = true;
                        });
                });
            }

            if (Array.isArray(delFileApi)) {
                delFileApi.forEach(api => {
                    builder
                        .addCase(api.pending, (state) => { state.loading = true; })
                        .addCase(api.fulfilled, (state, action) => {
                            state[name].newData.children = state[name].newData.children.filter(data => data._id !== action.payload._id);
                            state.loading = false;
                            state.error = false;
                        })
                        .addCase(api.rejected, (state) => {
                            state.loading = false;
                            state.error = true;
                        });
                });
            }

            if (Array.isArray(putApi)) {
                putApi.forEach(api => {
                    builder
                        .addCase(api.pending, (state) => { state.loading = true; })
                        .addCase(api.fulfilled, (state, action) => {
                            state.loading = false;
                            state.error = false;
                            const index = state[name].newData.findIndex(data => data._id === action.payload.newData._id);
                            if (index !== -1) {
                                state[name].newData[index] = action.payload.newData;
                            }
                        })
                        .addCase(api.rejected, (state) => {
                            state.loading = false;
                            state.error = true;
                        });
                });
            }
        },
    });
};

export const genericThunk = (key, api) => createAsyncThunk(key, async (body, thunkAPI) => {
    try {
        const data = await api(body);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const genericDispatch = (dispatch, apiCall, onSuccess, onError) => {
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    toastLoading(time, 'Đang Cập Nhật...');
    return dispatch(apiCall)
        .then((result) => {
            if (result.error) {
                toastError(time, 'Cập Nhật Thất Bại!', result.payload);
                if (onError) onError(result);
            } else {
                toastSuccess(time, 'Cập Nhật Thành Công!', 'Dữ liệu đã được cập nhật');
                if (onSuccess) onSuccess(result);
            }
            return result;
        })

};

