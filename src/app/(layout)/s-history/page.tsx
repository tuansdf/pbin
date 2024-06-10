import { LinkHistory } from "@/components/links/link-history";
import { Title } from "@mantine/core";

export const metadata = {
  title: "Link history",
};

export default function Page() {
  return (
    <>
      <Title mb="md">Link history</Title>

      <LinkHistory />
    </>
  );
}
