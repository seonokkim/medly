import { Platform } from "react-native";

const isPlatformAndroid = Platform.OS === "android";

const ANDROID_URL = "http://10.0.2.2:3000/";
const IOS_URL = "http://192.168.35.150:3000/";

export const baseURL = isPlatformAndroid ? ANDROID_URL : IOS_URL;
