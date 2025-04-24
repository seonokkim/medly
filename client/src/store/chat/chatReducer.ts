import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types/types";
import { getAnswer, getChatList } from "./chatActions";

export interface ChatState {
  isLoaded: boolean;
  messages: Message[];
  inputText: string;
  isModalVisible: boolean;
  modalText: string;
}

const initialState: ChatState = {
  isLoaded: true,
  messages: [],
  inputText: "",
  isModalVisible: false,
  modalText: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.isLoaded = true;
      state.messages = [];
      state.inputText = "";
      state.isModalVisible = false;
      state.modalText = "";
    },
    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },
    sendMessage: (state, action) => {
      state.messages.push(...action.payload);
      state.inputText = "";
    },
    setIsModalVisible: (state, action) => {
      state.isModalVisible = action.payload;
    },
    setModalText: (state, action) => {
      state.modalText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChatList.fulfilled, (state, action) => {
      console.log("getChatList.fulfilled", action);
      state.messages = action.payload;
    });
    builder.addCase(getChatList.rejected, (_, action) => {
      console.error("getChatList.rejected", action);
    });
    builder.addCase(getAnswer.fulfilled, (state, action) => {
      console.log("getAnswer.fulfilled", action);
      state.messages[state.messages.length - 1].text = action.payload[1].text;
      state.messages[state.messages.length - 1].citation =
        action.payload[1].citation || [];
    });
    builder.addCase(getAnswer.rejected, (_, action) => {
      console.error("getAnswer.rejected", action);
    });
  },
});

export const {
  resetChat,
  setIsLoaded,
  setMessages,
  setInputText,
  sendMessage,
  setIsModalVisible,
  setModalText,
} = chatSlice.actions;

export default chatSlice.reducer;
