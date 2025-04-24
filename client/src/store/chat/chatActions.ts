import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../constants/BaseURL";
import { Model } from "../../constants/Enums";

type getChatListParams = {
  accessToken: string;
  doctorIdx: number;
};

export const getChatList = createAsyncThunk(
  "/chats/:doctorIdx",
  async ({ accessToken, doctorIdx }: getChatListParams) => {
    const api = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await api.get(`/chats/${doctorIdx}`);

    return response.data;
  }
);

type getAnswerParams = {
  accessToken: string;
  doctorIdx: number;
  model: string;
  query: string;
};

export const getAnswer = createAsyncThunk(
  "/chats",
  async ({ accessToken, doctorIdx, model, query }: getAnswerParams) => {
    const api = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (model === Model.ModelA || model === Model.ModelB) {
      const response = await api.post(`/chats`, {
        doctorIdx,
        model: "문헌 검색",
        messages: query,
        mode: model === Model.ModelA ? "faq" : "doc",
      });
      return response.data;
    }

    const response = await api.post(`/chats`, {
      doctorIdx,
      model,
      messages: query,
    });

    return response.data;
  }
);

export default { getChatList, getAnswer };
