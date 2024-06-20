import { LinkHistory } from "@/client/features/links/link-history";
import { Title } from "@mantine/core";

export const metadata = {
  title: "URL history",
};

export default function Page() {
  return (
    <>
      <Title mb="md">URL history</Title>

      <LinkHistory />
    </>
  );
}
