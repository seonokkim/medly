import React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import Loader from "../../components/Common/Loader";
import { PatientDetail } from "../../types/types";

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const ScrollViewContainer = styled.View`
  flex: 0.9;
`;

const BackButton = styled.TouchableOpacity``;

const SaveButton = styled.TouchableOpacity``;

const Header = styled.View`
  flex-direction: row;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
`;

const TitleContainer = styled.View`
  padding-left: 20px;
`;

const ScheduledDate = styled.Text`
  font-size: 14px;
  color: #666;
  margin-vertical: 10px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Status = styled.View<{ completed: boolean }>`
  align-self: flex-start;
  background-color: ${({ completed }: { completed: boolean }) =>
    completed ? "#ddd" : "#7b6ef6"};
  padding: 6px 12px;
  border-radius: 5px;
  margin-top: 10px;
`;

const StatusText = styled.Text<{ completed: boolean }>`
  color: ${({ completed }: { completed: boolean }) =>
    completed ? "#666" : "#fff"};
  font-size: 14px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #ddd;
  margin-vertical: 15px;
  margin-horizontal: 20px;
`;

const SummaryContainer = styled.View`
  padding-horizontal: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
`;

const FloatingButton = styled.TouchableOpacity<{ isSaving: boolean }>`
  position: absolute;
  bottom: 20px;
  align-self: center;
  width: 60px;
  height: 60px;
  background-color: ${({ isSaving }: { isSaving: boolean }) =>
    isSaving ? "#ccc" : "#7b6ef6"};
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.4);
  shadow-offset: 0px 6px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 10;
  opacity: ${({ isSaving }: { isSaving: boolean }) => (isSaving ? 0.6 : 1)};
`;
interface Props {
  isLoaded: boolean;
  recording: any;
  recordingUri: any;
  isPlaying: boolean;
  isSaving: boolean;
  patientDetail: PatientDetail;
  isLoadingFile: boolean;
  goBack: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  playSound: (uri: string) => void;
  pauseSound: () => void;
  saveAudioFileToServer: () => void;
}

export default function RecordingConsentScreen({
  isLoaded,
  recording,
  recordingUri,
  isPlaying,
  isSaving,
  patientDetail,
  isLoadingFile,
  goBack,
  startRecording,
  stopRecording,
  playSound,
  pauseSound,
  saveAudioFileToServer,
}: Props) {
  return isLoaded ? (
    <SafeContainer>
      <Header>
        <BackButton onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </BackButton>
        {recordingUri && !isSaving && !patientDetail.filePath && (
          <SaveButton onPress={saveAudioFileToServer} disabled={isSaving}>
            <Ionicons name="save" size={24} color="#000" />
          </SaveButton>
        )}
        {isSaving && (
          <SaveButton onPress={saveAudioFileToServer} disabled={isSaving}>
            <ActivityIndicator size="small" color="#000" />
          </SaveButton>
        )}
      </Header>
      <ScrollViewContainer>
        <ScrollView>
          <TitleContainer>
            <ScheduledDate>{`Scheduled: ${patientDetail.scheduledAt}`}</ScheduledDate>
            <Title>{patientDetail.nameOfSurgery}</Title>
            <Status completed={patientDetail.filePath}>
              <StatusText completed={patientDetail.filePath}>
                {patientDetail.filePath ? "설명 완료" : "설명 필요"}
              </StatusText>
            </Status>
          </TitleContainer>
          <Divider />
          <SummaryContainer>
            <SectionTitle>{"Summary"}</SectionTitle>
            <Description>
              {isSaving
                ? "내용을 요약 중 입니다."
                : patientDetail.surgeryRecord === ""
                ? "아직 설명이 녹음되지 않았습니다."
                : JSON.parse(patientDetail.surgeryRecord).summary}
            </Description>
            <SectionTitle>{"Detail"}</SectionTitle>
            <Description>
              {isSaving
                ? "내용을 요약 중 입니다."
                : patientDetail.surgeryRecord === ""
                ? "아직 설명이 녹음되지 않았습니다."
                : JSON.parse(patientDetail.surgeryRecord).detail}
            </Description>
          </SummaryContainer>
        </ScrollView>
      </ScrollViewContainer>

      {!recordingUri && (
        <FloatingButton
          onPress={recording ? stopRecording : startRecording}
          disabled={isSaving}
          isSaving={isSaving}
        >
          <Ionicons name={recording ? "stop" : "mic"} size={28} color="#fff" />
        </FloatingButton>
      )}

      {recordingUri && (
        <FloatingButton
          onPress={isPlaying ? pauseSound : () => playSound(recordingUri)}
          disabled={isSaving || isLoadingFile}
          isSaving={isSaving}
        >
          <Ionicons
            name={isPlaying ? "pause" : isLoadingFile ? "hourglass" : "play"}
            size={28}
            color="#fff"
          />
        </FloatingButton>
      )}
    </SafeContainer>
  ) : (
    <Loader />
  );
}
