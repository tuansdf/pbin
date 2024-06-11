import { LinkAdd } from "@/client/features/links/link-add";

export const metadata = {
  title: "Shorten a link",
};

export default async function Page() {
  return <LinkAdd />;
}
