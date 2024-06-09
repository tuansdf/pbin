"use client";

import { ErrorMessage } from "@/components/error";
import { Loading } from "@/components/loading";
import { usePasswordStore } from "@/hooks/use-password-store";
import { decryptText } from "@/utils/crypto";
import { useCallback, useEffect, useState } from "react";

type Props = {
  item: {
    content: string | null;
  };
};

export const LinkDetail = ({ item }: Props) => {
  const [passwords] = usePasswordStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const decryptContent = useCallback(async () => {
    if (!item.content || !passwords?.size) return;
    try {
      setIsError(false);
      setIsLoading(true);
      const promises: Promise<string | undefined>[] = [];
      passwords?.forEach((password) => {
        promises.push(decryptText(item.content || "", password));
      });
      const decrypteds = await Promise.allSettled(promises);
      const decrypted = decrypteds.find((x) => x.status === "fulfilled" && !!x.value);
      const content = decrypted?.status === "fulfilled" ? decrypted.value || "" : "";
      const url = new URL(content);
      window.location.href = url.toString();
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [item.content, passwords]);

  useEffect(() => {
    decryptContent();
  }, [decryptContent]);

  if (isLoading) return <Loading isLoading={isLoading} />;
  if (isError) return <ErrorMessage />;

  return <></>;
};
