import React, { CSSProperties, FC, useContext, useState } from "react";
import { DotLoader, ClockLoader } from "react-spinners";
import { ModalContext } from "../context/modal.context";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const LoadingSpinner: FC<{}> = () => {
  const { isLoading } = useContext(ModalContext);

  //--------------------------------------------------------------------------------
  let [color, _] = useState("#35dfa5");

  return (
    <div
      className={`sweet-loading ${
        !isLoading ? "hidden" : "block"
      } fixed z-50 inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50`}
    >
      <DotLoader
        color={color}
        loading={isLoading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingSpinner;
