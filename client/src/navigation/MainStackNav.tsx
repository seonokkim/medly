import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { RootStackParamList } from "../types/types";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import DocumentScreen from "../screens/DocumentScreen";
import RecorderScreen from "../screens/RecorderScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function MainStackNav() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Document" component={DocumentScreen} />
      <Stack.Screen name="Recorder" component={RecorderScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
