import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../constants/BaseURL";

type UploadVoiceRecordParams = {
  accessToken: any;
  recordIdx: any;
  fileUri: any;
  fileType: any;
};
export const uploadVoiceRecord = createAsyncThunk(
  "/userRecords/uploadVoiceRecord",
  async ({
    accessToken,
    recordIdx,
    fileUri,
    fileType,
  }: UploadVoiceRecordParams) => {
    const formData = new FormData();

    // m4a 파일의 확장자에 맞게 처리
    const fileExtension = fileType.split("/")[1]; // "audio/mp4a-latm" -> "mp4a-latm"

    // fileType이 audio/mp4a-latm인 경우 .m4a 확장자로 설정
    const fileName = `record_${recordIdx}.${
      fileExtension === "mp4a-latm" ? "m4a" : fileExtension
    }`;

    formData.append("file", {
      uri: fileUri,
      type: fileType,
      name: fileName,
    } as any);

    const api = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const response = await api.post(
      `/userRecords/${recordIdx}/voice-record`,
      formData
    );

    return response.data;
  }
);

type GetRecordDetailParams = {
  accessToken: string;
  recordIdx: number;
};

export const getRecordDetail = createAsyncThunk(
  "/userRecords/:recordIdx",
  async ({ accessToken, recordIdx }: GetRecordDetailParams) => {
    const api = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await api.get(`/userRecords/${recordIdx}`);

    return response.data;
  }
);

export default { uploadVoiceRecord, getRecordDetail };
