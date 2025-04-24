import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

import { GREY_COLOR } from "../../constants/Colors";

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoaderText = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: ${GREY_COLOR};
`;

export default function Loader() {
  return (
    <SafeContainer>
      <ActivityIndicator color={GREY_COLOR} />
      <LoaderText>{"불러오는중..."}</LoaderText>
    </SafeContainer>
  );
}
