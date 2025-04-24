import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import HomePresenter from "./HomePresenter";
import { RootStackParamList } from "../../types/types";
import { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../store/root/rootReducer";
import { getPatientList } from "../../store/home/homeActions";
import {
  resetHome,
  setIsRefreshing,
  setModalVisible,
} from "../../store/home/homeReducer";

type Props = StackScreenProps<RootStackParamList, "Home">;

export default function HomeContainer({ navigation }: Props) {
  const { accessToken } = useSelector((state: RootState) => state.root);

  const { isLoaded, patients, modalVisible, isRefreshing } = useSelector(
    (state: RootState) => state.home
  );

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dispatch: AppDispatch = useDispatch();

  const preloadHome = () => {
    dispatch(setIsRefreshing(true));
    dispatch(getPatientList({ accessToken }));
  };

  const clickChatBtn = () => {
    actSetModalVisible(true);
  };

  const actLogout = () => {
    dispatch(logout());
  };

  const navigateToRecorderScreen = (idx: number, arrIdx: number) => {
    navigation.navigate("Recorder", { idx, arrIdx });
  };

  const actSetModalVisible = (state: boolean) => {
    dispatch(setModalVisible(state));
  };

  const clickModelName = (modelName: string) => {
    actSetModalVisible(false);
    navigation.navigate("Chat", { modelName });
  };

  useEffect(() => {
    preloadHome();

    return () => {
      dispatch(resetHome());
    };
  }, [dispatch]);

  return (
    <HomePresenter
      isLoaded={isLoaded}
      patients={filteredPatients}
      modalVisible={modalVisible}
      isRefreshing={isRefreshing}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      clickChatBtn={clickChatBtn}
      actLogout={actLogout}
      navigateToRecorderScreen={navigateToRecorderScreen}
      actSetModalVisible={actSetModalVisible}
      clickModelName={clickModelName}
      preloadHome={preloadHome}
    />
  );
}
