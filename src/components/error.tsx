type Props = {
  msg?: string;
};

export const ErrorMessage = ({ msg = "Something Went Wrong" }: Props) => {
  return <article style={{ color: "#ef4444" }}>{msg}</article>;
};
