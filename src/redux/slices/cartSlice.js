// src/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { courseApi } from '~/apis/courseApi';
import { genericThunk } from '../utils';

export const fetchItems = genericThunk(`cart/fetchItems`, courseApi.get);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        courses: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        addToCart: (state, action) => {
            const itemExists = state.cart.some(item => item === action.payload._id);
            if (!itemExists) {
                state.cart.push(action.payload._id);
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(itemId => itemId !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        clearCart: (state) => {
            state.cart = [];
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courses = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
