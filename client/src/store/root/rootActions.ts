import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../constants/BaseURL";

type getUserLogsByPatientIdParams = {
  patientId: number;
};

export const getUserLogsByPatientId = createAsyncThunk(
  "/users/getRecords/:patientId",
  async ({ patientId }: getUserLogsByPatientIdParams) => {
    const api = axios.create({
      baseURL,
      /** @todo Auth 추가 */
      // headers: {
      //   Accept: "application/json",
      //   Authorization: `Bearer ${token}`,
      // },
    });
    const response = await api.get(`/users/getRecords/${patientId}`);

    console.log(response);

    return response.data;
  }
);

type loginParams = {
  phoneNumber: string;
  password: string;
};

export const login = createAsyncThunk(
  "/auth/login",
  async ({ phoneNumber, password }: loginParams) => {
    const api = axios.create({
      baseURL,
    });

    const response = await api.post(`/auth/login/`, {
      phone: phoneNumber,
      password,
    });

    return response.data;
  }
);

export default { getUserLogsByPatientId, login };
