"use client";

import { createVault } from "@/client/api/vault.api";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useAppStore } from "@/client/stores/app.store";
import {
  VAULT_EXPIRE_1_DAY,
  VAULT_EXPIRE_1_HOUR,
  VAULT_EXPIRE_1_MONTH,
  VAULT_EXPIRE_1_WEEK,
  VAULT_EXPIRE_1_YEAR,
  VAULT_TYPE_NOTE,
} from "@/server/features/vault/vault.constant";
import { createNoteFormSchema } from "@/server/features/vault/vault.schema";
import { CreateVaultFormValues } from "@/server/features/vault/vault.type";
import {
  encryptText,
  generateEncryptionConfigs,
  generateHashConfigs,
  generatePassword,
  hashPassword,
} from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, NativeSelect, PasswordInput, Textarea, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultFormValues: CreateVaultFormValues = {
  content: "",
  masterPassword: "",
  expiresAt: VAULT_EXPIRE_1_WEEK,
};

export const NoteAdd = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateVaultFormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(createNoteFormSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addNoteUrl } = useAppStore();

  const handleFormSubmit: SubmitHandler<CreateVaultFormValues> = async (data) => {
    try {
      setIsLoading(true);

      // generate password
      const passwordConfigs = generateHashConfigs();
      const encryptionConfigs = generateEncryptionConfigs();
      const randomPassword = generatePassword();

      // encrypt data
      const encrypted = await encryptText(data.content!, randomPassword, encryptionConfigs.nonce);
      let masterPassword = data.masterPassword ? await hashPassword(data.masterPassword, passwordConfigs) : undefined;

      const body = await createVault(
        {
          content: encrypted || "",
          masterPassword: masterPassword,
          configs: { hash: passwordConfigs, encryption: encryptionConfigs },
          expiresAt: data.expiresAt,
        },
        VAULT_TYPE_NOTE,
      );
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
            rows={20}
            withAsterisk
            {...register("content")}
            error={errors.content?.message}
          />
          <PasswordInput
            mt="md"
            label="Master password"
            autoComplete="current-password"
            description="To perform update/delete"
            {...register("masterPassword")}
            error={errors.masterPassword?.message}
          />
          <NativeSelect mt="md" label="Expires after" data={expireOptions} {...register("expiresAt")} />
          <Button mt="md" type="submit">
            Submit
          </Button>
        </form>
      </Box>
      <ScreenLoading isLoading={isLoading} />
    </>
  );
};

const expireOptions = [
  {
    value: String(VAULT_EXPIRE_1_HOUR),
    label: "1 hour",
  },
  {
    value: String(VAULT_EXPIRE_1_DAY),
    label: "1 day",
  },
  {
    value: String(VAULT_EXPIRE_1_WEEK),
    label: "1 week",
  },
  {
    value: String(VAULT_EXPIRE_1_MONTH),
    label: "1 month",
  },
  {
    value: String(VAULT_EXPIRE_1_YEAR),
    label: "1 year",
  },
];
