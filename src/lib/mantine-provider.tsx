import { createTheme, MantineProvider as MantineProviderM } from "@mantine/core";
import { PropsWithChildren } from "react";

const theme = createTheme({});

type Props = PropsWithChildren;

export const MantineProvider = ({ children }: Props) => {
  return <MantineProviderM theme={theme}>{children}</MantineProviderM>;
};
