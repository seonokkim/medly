import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../constants/BaseURL";

type getPatientListParams = {
  accessToken: string;
};

export const getPatientList = createAsyncThunk(
  "/userRecords",
  async ({ accessToken }: getPatientListParams) => {
    const api = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const response = await api.get(`/userRecords`);

    return response.data;
  }
);

export default { getPatientList };
