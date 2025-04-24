import React from "react";
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 50px;
  font-weight: 300;
  color: #d3d3d3;
  text-align: center;
  margin-bottom: 40px;
`;

const Input = styled.TextInput`
  width: 85%;
  height: 50px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
`;

const LoginButton = styled.TouchableOpacity`
  width: 85%;
  height: 50px;
  background-color: #7f7fee;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-top: 30px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const LinksContainer = styled.View`
  margin-top: 30px;
  flex-direction: row;
  justify-content: center;
`;

const LinkText = styled.Text`
  font-size: 14px;
  color: #666;
  margin: 0 5px;
`;

interface Props {
  phoneNumber: string;
  password: string;
  isLoginBtnLoading: boolean;
  setPhoneNumber: (text: string) => void;
  setPassword: (text: string) => void;
  clickLoginBtn: () => void;
}

export default function SignInScreen({
  phoneNumber,
  password,
  isLoginBtnLoading,
  setPhoneNumber,
  setPassword,
  clickLoginBtn,
}: Props) {
  return (
    <SafeContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ContentContainer>
            <Title>Listen back{"\n"}Heal better</Title>
            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={(text: string) => setPhoneNumber(text)}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text: string) => setPassword(text)}
            />
            <LoginButton onPress={clickLoginBtn} disabled={isLoginBtnLoading}>
              <ButtonText>
                {isLoginBtnLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  "Login"
                )}
              </ButtonText>
            </LoginButton>
            <LinksContainer>
              <LinkText>Privacy Policy</LinkText>
              <Text>|</Text>
              <LinkText>Terms of Use</LinkText>
            </LinksContainer>
          </ContentContainer>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}
