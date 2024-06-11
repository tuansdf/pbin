"use client";

import { useAppStore } from "@/client/stores/app.store";
import { Alert, List } from "@mantine/core";
import { useMemo } from "react";

export const LinkHistory = () => {
  const { shortUrls } = useAppStore();

  const shortUrlsArr = useMemo(() => {
    if (!shortUrls) return;
    return Array.from(shortUrls);
  }, [shortUrls]);

  if (!shortUrlsArr) {
    return <Alert color="blue" title="Nothing..." />;
  }

  return (
    <List>
      {shortUrlsArr.map((item) => {
        if (!item) return null;
        return (
          <List.Item key={item}>
            <a target="_blank" href={item}>
              {item}
            </a>
          </List.Item>
        );
      })}
    </List>
  );
};
