import { genericSlice, genericThunk } from '~/redux/utils'
import { courseApi } from '~/apis/courseApi'

const name = 'cartDetail';

export const getCartDetailApi = genericThunk(`${name}/get`, courseApi.cart);

const cartDetailSlice = genericSlice({
    name: name,
    initialState: {
        cartDetail: [],
        loading: true,
        error: false,
    },
    reducers: {
        removeFromCartDetail: (state, action) => {
            state.cartDetail = state.cartDetail.filter((item) => item._id !== action.payload);
        },
        addToCartDetail: (state, action) => {
            const itemExists = state.cartDetail.some(item => {
                return item._id === action.payload._id;
            });
            if (!itemExists) {
                state.cartDetail.push(action.payload);
            }
        },
        clearCartDetail: (state) => {
            state.cartDetail = [];;
        },
    },
    getApi: [getCartDetailApi],
});
export const { removeFromCartDetail, addToCartDetail, clearCartDetail } = cartDetailSlice.actions;
export default cartDetailSlice.reducer;
