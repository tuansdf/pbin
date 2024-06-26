import { AppShell } from "@/client/components/layouts/app-shell";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
