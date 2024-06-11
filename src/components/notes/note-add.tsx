"use client";

import { useAppStore } from "@/stores/app.store";
import { encryptText, generatePassword, hashPassword } from "@/utils/crypto";
import { toString } from "@/utils/query-string";
import { Box, Button, LoadingOverlay, PasswordInput, Textarea, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  content: string;
  password: string;
};
const defaultFormValues: FormValues = {
  content: "",
  password: "",
};

export const NoteAdd = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addNoteUrl } = useAppStore();

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const randomPassword = generatePassword();
      const encrypted = await encryptText(data.content, randomPassword);
      let password: undefined | Awaited<ReturnType<typeof hashPassword>> = undefined;
      if (!!data.password) {
        password = await hashPassword(data.password, {});
      }
      const res = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({
          content: encrypted,
          password: password?.hash,
          passwordConfig: toString(password?.config || {}),
        }),
      });
      if (res.ok) {
        const body = (await res.json()) as { id: string | undefined };
        const link = `/n/${body.id}#${randomPassword}`;
        addNoteUrl(window.location.origin + link);
        router.push(link);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Title mb="md">Create a note</Title>
        <Textarea
          {...register("content", {
            minLength: {
              value: 1,
              message: "Required",
            },
            required: {
              value: true,
              message: "Required",
            },
          })}
          label="Content"
          autoComplete="off"
          autoFocus
          rows={24}
          required
          error={errors.content?.message}
        />
        <PasswordInput
          mt="md"
          label="Master password"
          autoComplete="current-password"
          description="To edit or delete it later"
          {...register("password", {
            minLength: {
              value: 10,
              message: "Must have at least 10 characters",
            },
          })}
          error={errors.password?.message}
        />
        <Button mt="md" type="submit">
          Submit
        </Button>
      </form>
      <LoadingOverlay visible={isLoading} />
    </Box>
  );
};
