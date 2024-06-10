"use client";

import { useAppStore } from "@/stores/app.store";
import { Alert, List } from "@mantine/core";
import { useMemo } from "react";

export const PasswordHistory = () => {
  const { passwords } = useAppStore();

  const passwordsArr = useMemo(() => {
    if (!passwords) return;
    return Array.from(passwords);
  }, [passwords]);

  if (!passwordsArr) {
    return <Alert color="blue" title="Nothing..." />;
  }

  return (
    <List>
      {passwordsArr.map((item) => {
        if (!item) return null;
        return <List.Item key={item}>{item}</List.Item>;
      })}
    </List>
  );
};
