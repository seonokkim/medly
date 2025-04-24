import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DocumentState {
  isLoaded: boolean;
}

const initialState: DocumentState = {
  isLoaded: false,
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    resetDocument: (state) => {
      state.isLoaded = false;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { resetDocument, setIsLoaded } = documentSlice.actions;

export default documentSlice.reducer;
