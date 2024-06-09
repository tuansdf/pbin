import { Alert } from "@mantine/core";

type Props = {
  msg?: string;
};

export const ErrorMessage = ({ msg = "Something Went Wrong" }: Props) => {
  return (
    <Alert variant="light" color="red" title="Error">
      {msg}
    </Alert>
  );
};
