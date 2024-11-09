import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, reAuth, register, loginGoogle } from "~/apis/authApi";
import { toastError } from "~/components/toast";

export const loginAuth = createAsyncThunk("login", async (body, thunkAPI) => {
  try {
    const data = (await login(body)).data
    return data;
  } catch (error) {
    toastError('auth', "Đăng Nhập Không Thành Công!", error.message);
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const reLoginAuth = createAsyncThunk("reauth", async (body, thunkAPI) => {
  try {
    const data = (await reAuth(body)).data;
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const registerAuth = createAsyncThunk("register", async (body, thunkAPI) => {
  try {
    const data = (await register(body)).data;
    return data;
  } catch (error) {
    toastError('auth', error.message, "Vui lòng đăng ký lại!");
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const loginGoogleAuth = createAsyncThunk("loginGoogle", async (body, thunkAPI) => {
  try {
    const data = (await loginGoogle(body)).data;
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    isAuthenticated: false,
    loading: true,
  },
  reducers: {
    logoutAuth: (state, action) => {
      state.user = {};
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(reLoginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginGoogleAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reLoginAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginGoogleAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registerAuth.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(reLoginAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = {};
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(loginGoogleAuth.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
export const { logoutAuth } = authSlice.actions;

