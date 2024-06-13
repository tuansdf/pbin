"use client";

import { createNote } from "@/client/api/vault.api";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useAppStore } from "@/client/stores/app.store";
import { createNoteFormSchema } from "@/server/features/vault/vault.schema";
import { CreateNoteFormValues } from "@/server/features/vault/vault.type";
import { encryptText, generatePassword, generatePasswordConfigs, hashPasswordValue } from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, PasswordInput, Textarea, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultFormValues: CreateNoteFormValues = {
  content: "",
  password: undefined,
};

export const NoteAdd = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateNoteFormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(createNoteFormSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addNoteUrl } = useAppStore();

  const handleFormSubmit: SubmitHandler<CreateNoteFormValues> = async (data) => {
    try {
      setIsLoading(true);

      // generate password
      const passwordConfigs = generatePasswordConfigs();
      let randomPassword = generatePassword();

      // encrypt data
      const encrypted = await encryptText(data.content, randomPassword);
      let masterPassword = data.password ? await hashPasswordValue(data.password, passwordConfigs) : undefined;

      const body = await createNote({
        content: encrypted || "",
        password: masterPassword,
        configs: { password: passwordConfigs },
      });
      const link = `/n/${body.publicId}#${randomPassword}`;
      addNoteUrl(window.location.origin + link);
      router.push(link);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box pos="relative">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Title mb="md">Create a note</Title>
          <Textarea
            label="Content"
            autoComplete="off"
            autoFocus
            rows={24}
            withAsterisk
            {...register("content")}
            error={errors.content?.message}
          />
          <PasswordInput
            mt="md"
            label="Master password"
            autoComplete="current-password"
            description="To edit or delete it later"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button mt="md" type="submit">
            Submit
          </Button>
        </form>
      </Box>
      <ScreenLoading isLoading={isLoading} />
    </>
  );
};
