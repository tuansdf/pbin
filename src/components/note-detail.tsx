"use client";

import { ErrorMessage } from "@/components/error";
import { Loading } from "@/components/loading";
import { decryptText } from "@/utils/crypto";
import { useCallback, useEffect, useState } from "react";

type Props = {
  item: {
    content: string | null;
  };
};

export const NoteDetail = ({ item }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [decrypted, setDecrypted] = useState<string | undefined>();

  const decryptContent = useCallback(async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const password = window.location.hash?.substring(1);
      if (!password) return "";
      const decrypted = await decryptText(item.content || "", password);
      setDecrypted(decrypted || "");
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [item.content]);

  useEffect(() => {
    decryptContent();
  }, [decryptContent]);

  if (isLoading) return <Loading isLoading={isLoading} />;
  if (isError) return <ErrorMessage />;

  return <form>{decrypted ? <textarea value={decrypted} readOnly rows={30} /> : <ErrorMessage />}</form>;
};
