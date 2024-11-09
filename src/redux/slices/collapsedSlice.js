import { createSlice } from '@reduxjs/toolkit';

export const collapsedSlice = createSlice({
    name: 'collapsed',
    initialState: {
        collapsedMode: false,
    },
    reducers: {
        toggleCompact: (state) => {
            state.collapsedMode = !state.collapsedMode;
        },
    },
});

export const { toggleCompact } = collapsedSlice.actions;

export default collapsedSlice.reducer;
