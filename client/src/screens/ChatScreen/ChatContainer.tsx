import { useEffect, useRef } from "react";
import { Keyboard, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";

import ChatPresenter from "./ChatPresenter";
import { AppDispatch, RootState } from "../../store/store";
import {
  sendMessage,
  resetChat,
  setInputText,
  setIsModalVisible,
  setModalText,
} from "../../store/chat/chatReducer";
import { RootStackParamList } from "../../types/types";
import { getAnswer, getChatList } from "../../store/chat/chatActions";

type Props = StackScreenProps<RootStackParamList, "Chat">;

export default function ChatContainer({ navigation, route }: Props) {
  const { accessToken, doctor } = useSelector((state: RootState) => state.root);

  const { isLoaded, messages, inputText, isModalVisible, modalText } =
    useSelector((state: RootState) => state.chat);

  const flatListRef = useRef<FlatList>(null);

  const { modelName } = route.params;

  const dispatch: AppDispatch = useDispatch();

  const actSetInputText = (text: string) => {
    dispatch(setInputText(text));
  };

  const pressBackBtn = () => {
    navigation.goBack();
  };

  const pressSendBtn = async () => {
    if (doctor) {
      dispatch(
        sendMessage([
          { idx: messages.length + 1, text: inputText, type: "sent" },
          {
            idx: messages.length + 1,
            text: "답변을 기다리는중...",
            type: "received",
          },
        ])
      );
      flatListRef.current?.scrollToEnd({ animated: true });
      setTimeout(() => {
        Keyboard.dismiss();
      }, 100);

      await actGetAnswer();
    }
  };

  const actGetAnswer = async () => {
    if (doctor) {
      await dispatch(
        getAnswer({
          accessToken,
          doctorIdx: doctor.idx,
          model: modelName,
          query: inputText,
        })
      );

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const actGetChatList = async () => {
    if (doctor) {
      await dispatch(getChatList({ accessToken, doctorIdx: doctor.idx }));

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const actSetIsModalVisible = (state: boolean) => {
    dispatch(setIsModalVisible(state));
  };

  const clickCitationBtn = (text: string) => {
    dispatch(setModalText(text));
    dispatch(setIsModalVisible(true));
  };

  useEffect(() => {
    actGetChatList();

    return () => {
      dispatch(resetChat());
    };
  }, []);

  return (
    <ChatPresenter
      isLoaded={isLoaded}
      messages={messages}
      inputText={inputText}
      flatListRef={flatListRef}
      modelName={modelName}
      isModalVisible={isModalVisible}
      modalText={modalText}
      pressBackBtn={pressBackBtn}
      actSetInputText={actSetInputText}
      pressSendBtn={pressSendBtn}
      actSetIsModalVisible={actSetIsModalVisible}
      clickCitationBtn={clickCitationBtn}
    />
  );
}
