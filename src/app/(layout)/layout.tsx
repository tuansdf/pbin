import { AppShell } from "@/components/layouts/app-shell";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
