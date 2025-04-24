import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

import Loader from "../../components/Common/Loader";

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

interface Props {
  isLoaded: boolean;
}

export default function DocumentPresenter({ isLoaded }: Props) {
  return isLoaded ? (
    <SafeContainer>
      <Text>{"Document"}</Text>
    </SafeContainer>
  ) : (
    <Loader />
  );
}
