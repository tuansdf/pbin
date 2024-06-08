"use client";

import { encryptText } from "@/utils/crypto";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";

export const NoteAdd = () => {
  const router = useRouter();
  const contentId = useId();

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const randomPassword = nanoid();
      const encrypted = await encryptText(content, randomPassword);
      const res = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ content: encrypted }),
      });
      const body = (await res.json()) as { id: string | undefined };
      router.push(`/n/${body.id}#${randomPassword}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add a new note</h1>
      <label htmlFor={contentId}>Content</label>
      <textarea
        id={contentId}
        autoComplete="off"
        autoFocus
        rows={30}
        value={content}
        required
        minLength={1}
        onChange={(e) => setContent(e.target.value)}
      />
      <input type="submit" aria-busy={isLoading} value="Submit" disabled={isLoading} required minLength={8} />
    </form>
  );
};
