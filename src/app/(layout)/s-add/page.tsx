import { LinkAdd } from "@/client/features/links/link-add";

export const metadata = {
  title: "Shorten a URL",
};

export default async function Page() {
  return <LinkAdd />;
}
