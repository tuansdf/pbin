import { Box, LoadingOverlay } from "@mantine/core";
import classes from "./screen-loading.module.scss";

type Props = {
  isLoading?: boolean;
};

export const ScreenLoading = ({ isLoading = true }: Props) => {
  if (!isLoading) return null;

  return (
    <Box className={classes["container"]}>
      <LoadingOverlay visible={isLoading} />
    </Box>
  );
};
