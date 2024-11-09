import { createSlice } from '@reduxjs/toolkit';

export const languageSlice = createSlice({
    name: 'language',
    initialState: {
        currentLanguage: 'vi_VN', // English as default language
    },
    reducers: {
        setLanguage: (state, action) => {
            state.currentLanguage = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
