"use client";

import { useDisclosure } from "@/client/hooks/use-disclosure";
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
        <NavLink
          href="/create-note"
          label="Create a note"
          component={Link}
          active={pathname === "/create-note"}
          onClick={close}
        />
        <NavLink
          href="/note-history"
          label="Note history"
          component={Link}
          active={pathname === "/note-history"}
          onClick={close}
        />
        <NavLink
          href="/create-link"
          label="Shorten a URL"
          component={Link}
          active={pathname === "/create-link"}
          onClick={close}
        />
        <NavLink
          href="/mask-link"
          label="Mask a URL"
          component={Link}
          active={pathname === "/mask-link"}
          onClick={close}
        />
        <NavLink
          href="/link-history"
          label="URL history"
          component={Link}
          active={pathname === "/link-history"}
          onClick={close}
        />
        <NavLink
          href="/password-history"
          label="Password history"
          component={Link}
          active={pathname === "/password-history"}
          onClick={close}
        />
      </AppShellM.Navbar>

      <AppShellM.Main>{children}</AppShellM.Main>
    </AppShellM>
  );
};
