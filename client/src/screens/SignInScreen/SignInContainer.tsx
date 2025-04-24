import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SignInPresenter from "./SignInPresenter";
import { AppDispatch, RootState } from "../../store/store";
import { login } from "../../store/root/rootActions";
import { setIsLoginBtnLoading } from "../../store/signIn/signInReducer";

export default function SignInContainer() {
  const { isLoginBtnLoading } = useSelector((state: RootState) => state.signIn);

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const dispatch: AppDispatch = useDispatch();

  const clickLoginBtn = async () => {
    if (!phoneNumber || !password) {
      alert("전화번호와 비밀번호를 입력해주세요");
      return;
    }

    const phoneNumberRegex = /^[0-9]{10,11}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      alert("유효한 전화번호를 입력 해주세요.");
      return;
    }

    if (password.length < 8) {
      alert("비밀번호를 최소 8자리 이상 입력 해주세요.");
      return;
    }

    dispatch(setIsLoginBtnLoading(true));

    const response = await dispatch(login({ phoneNumber, password }));

    if (response.meta.requestStatus === "rejected") {
      alert("비밀번호가 틀렸거나 해당 번호가 존재하지 않습니다.");
    }
  };

  return (
    <SignInPresenter
      phoneNumber={phoneNumber}
      password={password}
      isLoginBtnLoading={isLoginBtnLoading}
      setPhoneNumber={setPhoneNumber}
      setPassword={setPassword}
      clickLoginBtn={clickLoginBtn}
    />
  );
}
