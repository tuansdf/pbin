"use client";

import { useDisclosure } from "@/hooks/use-disclosure";
import { AppShell as AppShellM, Burger, NavLink } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import classes from "./app-shell.module.scss";

type Props = PropsWithChildren;

export const AppShell = ({ children }: Props) => {
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <AppShellM
      header={{ height: 52 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShellM.Header className={classes["header"]}>
        <Burger opened={opened} onClick={toggle} size="sm" />
        <div>Pbin</div>
      </AppShellM.Header>

      <AppShellM.Navbar p="sm">
        <NavLink href="/n/add" label="Create a note" component={Link} active={pathname === "/n/add"} onClick={close} />
        <NavLink href="/s/add" label="Shorten a link" component={Link} active={pathname === "/s/add"} onClick={close} />
      </AppShellM.Navbar>

      <AppShellM.Main>{children}</AppShellM.Main>
    </AppShellM>
  );
};
