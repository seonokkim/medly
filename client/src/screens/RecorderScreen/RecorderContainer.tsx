import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { Audio } from "expo-av";

import { RootStackParamList } from "../../types/types";
import RecorderPresenter from "./RecorderPresenter";
import { RootState, AppDispatch } from "../../store/store";
import {
  getRecordDetail,
  uploadVoiceRecord,
} from "../../store/recorder/recorderActions";
import {
  resetRecorder,
  setIsSaving,
  setRecordingUriInReducer,
} from "../../store/recorder/recorderReducer";
import { setRecorderIsSaving } from "../../store/home/homeReducer";

type Props = StackScreenProps<RootStackParamList, "Recorder">;

export default function RecorderContainer({ navigation, route }: Props) {
  const { accessToken } = useSelector((state: RootState) => state.root);

  const { patients } = useSelector((state: RootState) => state.home);

  const { isLoaded, isSaving, patientDetail, recordingUri } = useSelector(
    (state: RootState) => state.recorder
  );

  const [recording, setRecording] = useState<Audio.Recording | undefined>(
    undefined
  );

  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);

  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [exsound, setSound] = useState<Audio.Sound | undefined>(undefined);

  const [isPlaying, setIsPlaying] = useState(false);

  const { idx, arrIdx } = route.params;

  const dispatch: AppDispatch = useDispatch();

  const goBack = () => {
    pauseSound();
    navigation.goBack();
  };

  const setRecordingUri = (uri: string | null) => {
    dispatch(setRecordingUriInReducer(uri));
  };

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      console.log("Recording started", recording);
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      setRecordingUri(uri);
      setRecording(undefined);
    } else {
      console.error("Recording is undefined");
    }
  }

  async function playSound(uri: string) {
    if (exsound) {
      await exsound.playAsync();
      setIsPlaying(true);
      return;
    }
    if (isLoadingFile) {
      return;
    }
    setIsLoadingFile(true);
    const { sound } = await Audio.Sound.createAsync({ uri });
    setIsLoadingFile(false);
    setSound(sound);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status) {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          setIsPlaying(false);
          setSound(undefined);
        }
      }
    });
    setIsPlaying(true);
  }

  async function pauseSound() {
    if (exsound) {
      await exsound.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function saveAudioFileToServer() {
    if (!recordingUri) {
      return;
    }

    try {
      const recordIdx = idx;
      const fileType = "audio/mp4a-latm";

      dispatch(setIsSaving(true));
      dispatch(setRecorderIsSaving({ idx, isSaving: true }));

      await dispatch(
        uploadVoiceRecord({
          accessToken,
          recordIdx,
          fileUri: recordingUri,
          fileType,
        })
      );

      console.log("Audio file uploaded successfully!");
      dispatch(setIsSaving(false));
      dispatch(setRecorderIsSaving({ idx, isSaving: false }));
    } catch (error) {
      console.error("Failed to upload audio file", error);
      dispatch(setIsSaving(false));
      dispatch(setRecorderIsSaving({ idx, isSaving: false }));
    }
  }

  useEffect(() => {
    dispatch(setIsSaving(patients[arrIdx].isSaving ? true : false));
    dispatch(getRecordDetail({ accessToken, recordIdx: idx }));

    return () => {
      dispatch(resetRecorder());
    };
  }, [patients]);

  return (
    <RecorderPresenter
      isLoaded={isLoaded}
      recording={recording}
      recordingUri={recordingUri}
      isPlaying={isPlaying}
      isSaving={isSaving}
      patientDetail={patientDetail}
      isLoadingFile={isLoadingFile}
      goBack={goBack}
      startRecording={startRecording}
      stopRecording={stopRecording}
      playSound={playSound}
      pauseSound={pauseSound}
      saveAudioFileToServer={saveAudioFileToServer}
    />
  );
}
