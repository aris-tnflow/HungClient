import { createSlice } from '@reduxjs/toolkit';

export const compactSlice = createSlice({
    name: 'compact',
    initialState: {
        compactMode: false,
    },
    reducers: {
        toggleCompact: (state) => {
            state.compactMode = !state.compactMode;
        },
    },
});

export const { toggleCompact } = compactSlice.actions;

export default compactSlice.reducer;
