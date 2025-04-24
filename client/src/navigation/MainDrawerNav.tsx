import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSelector } from "react-redux";

import MainStackNav from "./MainStackNav";
import EntryStackNav from "./EntryStackNav";
import { RootState } from "../store/store";

const Drawer = createDrawerNavigator();

export default function MainDrawerNav() {
  const { doctor, patient } = useSelector((state: RootState) => state.root);

  const isLoggedIn = doctor || patient;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
    >
      {isLoggedIn ? (
        <Drawer.Screen name="MainStack" component={MainStackNav} />
      ) : (
        <Drawer.Screen name="EntryStack" component={EntryStackNav} />
      )}
    </Drawer.Navigator>
  );
}
