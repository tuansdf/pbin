"use client";

import { decryptText } from "@/utils/crypto";
import { useEffect, useState } from "react";

type Props = {
  note: {
    content: string | null;
  };
};

export const Note = ({ note }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [decrypted, setDecrypted] = useState<string>("");

  useEffect(() => {
    decryptContent();
  }, [note.content]);

  const decryptContent = async () => {
    try {
      setIsLoading(true);
      const password = window.location.hash?.substring(1);
      if (!password) return "";
      const decrypted = await decryptText(note.content || "", password);
      setDecrypted(decrypted);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form>
      {!!decrypted ? (
        <textarea value={decrypted} readOnly rows={30} />
      ) : (
        <article style={{ color: "#ef4444" }} aria-busy={isLoading}>
          {!isLoading && <b>CANNOT EXTRACT CONTENT</b>}
        </article>
      )}
    </form>
  );
};
