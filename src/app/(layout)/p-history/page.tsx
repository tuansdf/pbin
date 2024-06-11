import { PasswordHistory } from "@/client/features/passwords/password-history";
import { Title } from "@mantine/core";

export const metadata = {
  title: "Password history",
};

export default function Page() {
  return (
    <>
      <Title mb="md">Password history</Title>

      <PasswordHistory />
    </>
  );
}
