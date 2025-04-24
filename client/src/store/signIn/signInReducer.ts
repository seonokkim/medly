import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login } from "../root/rootActions";

export interface SignInState {
  isLoginBtnLoading: boolean;
}

const initialState: SignInState = {
  isLoginBtnLoading: false,
};

export const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    setIsLoginBtnLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoginBtnLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      console.log("login.fulfilled(SignIn)", action);
      state.isLoginBtnLoading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      console.error("login.rejected(SignIn)", action);
      state.isLoginBtnLoading = false;
    });
  },
});

export const { setIsLoginBtnLoading } = signInSlice.actions;

export default signInSlice.reducer;
