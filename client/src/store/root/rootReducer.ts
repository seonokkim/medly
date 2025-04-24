import { AppStateStatus } from "react-native";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { getUserLogsByPatientId, login } from "./rootActions";
import { AppState, Screens } from "../../constants/Enums";
import { Doctor, Patient } from "../../types/types";
import { getPatientList } from "../home/homeActions";

export interface RootState {
  appState: AppStateStatus;
  currentScreen: string;
  accessToken: string;
  doctor: Doctor | undefined;
  patient: Patient | undefined;
}

const initialState: RootState = {
  appState: AppState.Unknown,
  currentScreen: Screens.Home,
  accessToken: "",
  doctor: undefined,
  patient: undefined,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<AppStateStatus>) => {
      state.appState = action.payload;
    },
    setCurrentScreen: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload;
    },
    logout: (state) => {
      state.accessToken = "";
      state.doctor = undefined;
      state.patient = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      console.log("login.fulfilled(root)", action);
      state.accessToken = action.payload.access_token;

      if (action.payload.doctor) {
        state.doctor = action.payload.doctor;
      } else if (action.payload.patient) {
        state.patient = action.payload.patient;
      }
    });
    builder.addCase(login.rejected, (_, action) => {
      console.error("login.rejected(root)", action);
    });
    builder.addCase(getUserLogsByPatientId.fulfilled, (_, action) => {
      console.log("getUserLogsByPatientId.fulfilled", action);
    });
    builder.addCase(getUserLogsByPatientId.rejected, (_, action) => {
      console.error("getUserLogsByPatientId.rejected", action);
    });
    builder.addCase(getPatientList.rejected, (state, action) => {
      console.error("getPatientList(root).rejected", action);

      state.accessToken = "";
      state.doctor = undefined;
      state.patient = undefined;
    });
  },
});

export const { setAppState, setCurrentScreen, logout } = rootSlice.actions;

export default rootSlice.reducer;
