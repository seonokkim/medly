export type RootStackParamList = {
  MainBottom: undefined;
  Home: undefined;
  Document: undefined;
  Recorder: { idx: number; arrIdx: number };
  Chat: { modelName: string };
};

export type EntryStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type Message = {
  idx: number;
  text: string;
  type: "sent" | "received";
  citation: {
    name: string;
    content: string;
  }[];
};

export type Doctor = {
  idx: number;
  role: string;
  email: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Patient = {
  idx: number;
};

export type PatientRecord = {
  idx: number;
  patientId: string;
  name: string;
  dateOfBirth: Date;
  scheduledAt: Date;
  status: boolean;
  nameOfSurgery: string;
  isSaving?: boolean;
  surgeryRecord: string;
};

export type PatientDetail = {
  idx: number;
  scheduledAt: string;
  nameOfSurgery: string;
  surgeryRecord: string;
  filePath: string | null;
};
