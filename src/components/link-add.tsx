"use client";

import { usePasswordStore } from "@/hooks/use-password-store";
import { encryptText } from "@/utils/crypto";
import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";

export const LinkAdd = () => {
  const router = useRouter();
  const contentId = useId();
  const passwordId = useId();

  const [passwords, setPasswords] = usePasswordStore();
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const encrypted = await encryptText(content, password);
      const res = await fetch("/api/links", {
        method: "POST",
        body: JSON.stringify({ content: encrypted }),
      });
      const body = (await res.json()) as { id: string | undefined };
      setPasswords((prev) => prev?.add(password));
      router.push(`/s/${body.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Shorten a new link</h1>
      <label htmlFor={contentId}>Link</label>
      <textarea
        id={contentId}
        autoComplete="off"
        autoFocus
        rows={2}
        value={content}
        required
        minLength={1}
        onChange={(e) => setContent(e.target.value)}
      />
      <label htmlFor={passwordId}>Password</label>
      <input
        type="password"
        value={password}
        id={passwordId}
        required
        min={10}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" aria-busy={isLoading} value="Submit" disabled={isLoading} />
    </form>
  );
};
