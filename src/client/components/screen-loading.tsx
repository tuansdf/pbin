"use client";

import { LoadingOverlay } from "@mantine/core";
import { createPortal } from "react-dom";
import classes from "./screen-loading.module.scss";

type Props = {
  isLoading?: boolean;
};

export const ScreenLoading = ({ isLoading = true }: Props) => {
  if (!isLoading) return null;

  return (
    <>
      {createPortal(
        <div className={classes["container"]}>
          <LoadingOverlay visible={isLoading} />
        </div>,
        document.body,
      )}
    </>
  );
};
