import { configureStore } from "@reduxjs/toolkit";
import storage from "@react-native-async-storage/async-storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import rootReducer from "./root/rootReducer";
import signInReducer from "./signIn/signInReducer";
import homeReducer from "./home/homeReducer";
import chatReducer from "./chat/chatReducer";
import documentReducer from "./document/documentReducer";
import recorderReducer from "./recorder/recorderReducer";

const persistConfig = {
  key: "rootKey",
  storage,
  version: 1,
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    root: persistedRootReducer,
    signIn: signInReducer,
    home: homeReducer,
    chat: chatReducer,
    document: documentReducer,
    recorder: recorderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default { store, persistor };
