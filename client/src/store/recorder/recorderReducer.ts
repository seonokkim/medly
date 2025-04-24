import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRecordDetail, uploadVoiceRecord } from "./recorderActions";
import { PatientDetail } from "../../types/types";

export interface RecorderState {
  isLoaded: boolean;
  isSaving: boolean;
  patientDetail: PatientDetail;
  recordingUri: string | null;
}

const initialState: RecorderState = {
  isLoaded: false,
  isSaving: false,
  patientDetail: {
    idx: 0,
    scheduledAt: new Date().toISOString(),
    nameOfSurgery: "",
    surgeryRecord: "",
    filePath: null,
  },
  recordingUri: null,
};

export const recorderSlice = createSlice({
  name: "recorder",
  initialState,
  reducers: {
    resetRecorder: (state) => {
      state.isLoaded = false;
      state.isSaving = false;
      state.patientDetail = {
        idx: 0,
        scheduledAt: new Date().toISOString(),
        nameOfSurgery: "",
        surgeryRecord: "",
        filePath: null,
      };
      state.recordingUri = null;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setRecordingUriInReducer: (state, action: PayloadAction<string | null>) => {
      state.recordingUri = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadVoiceRecord.fulfilled, (state, action) => {
      console.log("uploadVoiceRecord.fulfilled", action);
    });
    builder.addCase(uploadVoiceRecord.rejected, (_, action) => {
      console.error("uploadVoiceRecord.rejected", action);
    });
    builder.addCase(getRecordDetail.fulfilled, (state, action) => {
      console.log("getRecordDetail.fulfilled", action);

      state.isLoaded = true;
      state.patientDetail = {
        ...action.payload,
        scheduledAt: new Date(action.payload.scheduledAt).toLocaleString(
          "ko-KR"
        ),
      };
      state.recordingUri = action.payload.filePath;
    });
    builder.addCase(getRecordDetail.rejected, (_, action) => {
      console.error("getRecordDetail.rejected", action);
    });
  },
});

export const {
  resetRecorder,
  setIsLoaded,
  setIsSaving,
  setRecordingUriInReducer,
} = recorderSlice.actions;

export default recorderSlice.reducer;
