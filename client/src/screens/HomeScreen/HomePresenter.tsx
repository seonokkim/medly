import React from "react";
import { FlatList, Modal, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import Loader from "../../components/Common/Loader";
import { PatientRecord } from "../../types/types";
import { Model } from "../../constants/Enums";

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const Header = styled.View`
  height: 60px;
  padding-horizontal: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderBtn = styled.TouchableOpacity``;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #7b6ef6;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  margin-horizontal: 20px;
  margin-bottom: 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 10px;
  color: #aaa;
`;

const PatientItem = styled.View`
  margin-horizontal: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const PatientItemUpperView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
`;

const PatientName = styled.Text`
  font-size: 24px;
  font-weight: 500;
`;

const StatusButton = styled.TouchableOpacity`
  background-color: ${(props: { completed: string }) =>
    props.completed ? "#ddd" : "#7b6ef6"};
  padding: 8px 12px;
  border-radius: 5px;
`;

const StatusText = styled.Text`
  color: ${(props: { completed: string }) =>
    props.completed ? "#666" : "#fff"};
  font-size: 14px;
`;

const PatientItemBelowView = styled.View`
  margin-bottom: 15px;
`;

const PatientInfo = styled.Text`
  font-size: 16px;
  font-weight: 300;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #7b6ef6;
  border-radius: 30px;
  align-items: center;
  justify-content: center;

  shadow-color: rgba(0, 0, 0, 0.4);
  shadow-offset: 0px 6px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;

  elevation: 10;
`;

const ModalContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  align-items: center;
`;

const ModalButton = styled.TouchableOpacity`
  margin-top: ${(props: { marginTop?: number }) => props.marginTop || 0}px;
`;

const ModalButtonText = styled.Text`
  font-size: 18px;
`;

interface Props {
  isLoaded: boolean;
  patients: PatientRecord[];
  modalVisible: boolean;
  isRefreshing: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clickChatBtn: () => void;
  actLogout: () => void;
  navigateToRecorderScreen: (idx: number, arrIdx: number) => void;
  actSetModalVisible: (state: boolean) => void;
  clickModelName: (modelName: string) => void;
  preloadHome: () => void;
}

export default function HomePresenter({
  isLoaded,
  patients,
  modalVisible,
  isRefreshing,
  searchQuery,
  setSearchQuery,
  clickChatBtn,
  actLogout,
  navigateToRecorderScreen,
  actSetModalVisible,
  clickModelName,
  preloadHome,
}: Props) {
  const renderPatientItem = ({
    item,
    index,
  }: {
    item: PatientRecord;
    index: number;
  }) => (
    <TouchableWithoutFeedback
      onPress={() => navigateToRecorderScreen(item.idx, index)}
    >
      <PatientItem>
        <PatientItemUpperView>
          <PatientName>{item.name}</PatientName>
          <StatusButton completed={item.surgeryRecord !== ""} disabled={true}>
            <StatusText completed={item.surgeryRecord !== ""}>
              {item.surgeryRecord !== "" ? "설명 완료" : "설명 필요"}
            </StatusText>
          </StatusButton>
        </PatientItemUpperView>
        <PatientItemBelowView>
          <PatientInfo>{`ID: ${item.patientId}`}</PatientInfo>
          <PatientInfo>{`Birth Date: ${new Date(
            item.dateOfBirth
          ).toLocaleDateString("ko-KR")}`}</PatientInfo>
          <PatientInfo>{`Scheduled: ${new Date(
            item.scheduledAt
          ).toLocaleDateString("ko-KR")}`}</PatientInfo>
          <PatientInfo>{`Name of Surgery: ${item.nameOfSurgery}`}</PatientInfo>
        </PatientItemBelowView>
      </PatientItem>
    </TouchableWithoutFeedback>
  );

  return isLoaded ? (
    <SafeContainer>
      <Header>
        <HeaderBtn onPress={actLogout}>
          <Title>Patients</Title>
        </HeaderBtn>
      </Header>
      <SearchContainer>
        <Ionicons name="search" size={20} color="#aaa" />
        <SearchInput
          placeholder="환자 검색"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Ionicons
            name="close-circle"
            size={20}
            color="#aaa"
            onPress={() => setSearchQuery("")}
          />
        ) : null}
      </SearchContainer>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.idx.toString()}
        refreshing={isRefreshing}
        renderItem={renderPatientItem}
        onRefresh={preloadHome}
      />
      <FloatingButton onPress={clickChatBtn}>
        <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
      </FloatingButton>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => actSetModalVisible(false)}
      >
        <ModalContainer onPress={() => actSetModalVisible(false)}>
          <ModalContent>
            <ModalButton onPress={() => clickModelName(Model.ModelA)}>
              <ModalButtonText>{Model.ModelA}</ModalButtonText>
            </ModalButton>
            <ModalButton
              onPress={() => clickModelName(Model.ModelB)}
              marginTop={10}
            >
              <ModalButtonText>{Model.ModelB}</ModalButtonText>
            </ModalButton>
            <ModalButton
              onPress={() => clickModelName(Model.ModelC)}
              marginTop={10}
            >
              <ModalButtonText>{Model.ModelC}</ModalButtonText>
            </ModalButton>
            <ModalButton
              onPress={() => clickModelName(Model.ModelD)}
              marginTop={10}
            >
              <ModalButtonText>{Model.ModelD}</ModalButtonText>
            </ModalButton>
            <ModalButton
              onPress={() => clickModelName(Model.ModelE)}
              marginTop={10}
            >
              <ModalButtonText>{Model.ModelE}</ModalButtonText>
            </ModalButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </SafeContainer>
  ) : (
    <Loader />
  );
}
