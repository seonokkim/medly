import React, { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";

import { RootStackParamList } from "../../types/types";
import DocumentPresenter from "./DocumentPresenter";

type Props = StackScreenProps<RootStackParamList, "Document">;

export default function DocumentContainer({}: Props) {
  useEffect(() => {
    return () => {};
  }, []);

  return <DocumentPresenter isLoaded={true} />;
}
