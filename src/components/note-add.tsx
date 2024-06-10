"use client";

import { encryptText, generatePassword } from "@/utils/crypto";
import { Box, Button, LoadingOverlay, Textarea, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  content: string;
};
const defaultFormValues: FormValues = {
  content: "",
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

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const randomPassword = generatePassword();
      const encrypted = await encryptText(data.content, randomPassword);
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
          rows={30}
          required
          error={errors.content?.message}
        />
        <Button mt="md" type="submit">
          Submit
        </Button>
      </form>
      <LoadingOverlay visible={isLoading} />
    </Box>
  );
};
