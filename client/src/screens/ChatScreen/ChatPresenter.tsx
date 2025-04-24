import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { Message } from "../../types/types";
import Loader from "../../components/Common/Loader";

const Header = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const IconButton = styled.TouchableOpacity`
  padding: 16px;
`;

const MessageBubble = styled.View<{ type: string }>`
  background-color: ${(props: { type: string }) =>
    props.type === "sent" ? "#1E1E1E" : "#EAEAEA"};
  padding: 12px 16px;
  border-radius: 16px;
  margin-vertical: 6px;
  align-self: ${(props: { type: string }) =>
    props.type === "sent" ? "flex-end" : "flex-start"};
  max-width: 75%;
`;

const MessageText = styled.Text<{ type: string }>`
  color: ${(props: { type: string }) =>
    props.type === "sent" ? "#fff" : "#333"};
  font-size: 16px;
`;

const InputContainer = styled.View`
  min-height: 60px;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const MessageInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
`;

const SendButton = styled.TouchableOpacity`
  background-color: #7b6ef6;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const CitationBtn = styled.TouchableOpacity`
  background-color: #eaeaea;
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 6px;
  margin-right: 6px;
`;

const CitationText = styled.Text``;

const ModalView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalText = styled.Text`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  font-size: 16px;
  text-align: center;
`;

interface Props {
  isLoaded: boolean;
  messages: Message[];
  inputText: string;
  flatListRef: React.RefObject<FlatList>;
  modelName: string;
  isModalVisible: boolean;
  modalText: string;
  pressBackBtn: () => void;
  actSetInputText: (text: string) => void;
  pressSendBtn: () => void;
  actSetIsModalVisible: (state: boolean) => void;
  clickCitationBtn: (text: string) => void;
}

const ChatScreen = ({
  isLoaded,
  messages,
  inputText,
  flatListRef,
  modelName,
  isModalVisible,
  modalText,
  pressBackBtn,
  actSetInputText,
  pressSendBtn,
  actSetIsModalVisible,
  clickCitationBtn,
}: Props) => {
  return isLoaded ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView>
        <Header>
          <IconButton onPress={pressBackBtn}>
            <Ionicons name="close" size={24} color="black" />
          </IconButton>
          <Title>{modelName}</Title>
          <IconButton disabled={true}>
            <Ionicons name="share-social-outline" size={24} color="black" />
          </IconButton>
        </Header>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => `${item.type}_${item.idx}`}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          renderItem={({ item }) => (
            <>
              <MessageBubble type={item.type}>
                <MessageText type={item.type}>{item.text}</MessageText>
              </MessageBubble>
              {item.type === "received" &&
                item.citation &&
                item.citation.length > 0 && (
                  <ScrollView
                    style={{
                      maxWidth: "75%",
                    }}
                    horizontal
                  >
                    {item.citation.map(
                      (list: { name: string; content: string }) => (
                        <CitationBtn
                          key={list.name}
                          onPress={() => clickCitationBtn(list.content)}
                        >
                          <CitationText>{list.name}</CitationText>
                        </CitationBtn>
                      )
                    )}
                  </ScrollView>
                )}
            </>
          )}
          initialNumToRender={messages.length}
        />
        <InputContainer>
          <MessageInput
            placeholder="Write your message"
            placeholderTextColor="#aaa"
            multiline
            value={inputText}
            onChangeText={actSetInputText}
          />
          <SendButton onPress={pressSendBtn} disabled={inputText === ""}>
            <Ionicons name="send" size={20} color="#fff" />
          </SendButton>
        </InputContainer>
      </SafeAreaView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => actSetIsModalVisible(false)}
      >
        <ModalView>
          <ModalText>{modalText}</ModalText>
          <Ionicons
            name="close"
            size={24}
            color="black"
            onPress={() => actSetIsModalVisible(false)}
          />
        </ModalView>
      </Modal>
    </KeyboardAvoidingView>
  ) : (
    <Loader />
  );
};

export default ChatScreen;
