import { Dimensions, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  width,
  height,
  headerHeight: StatusBar.currentHeight,
};
