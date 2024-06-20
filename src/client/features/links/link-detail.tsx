"use client";

import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useDisclosure } from "@/client/hooks/use-disclosure";
import { useAppStore } from "@/client/stores/app.store";
import { decryptVaultFormSchema } from "@/server/features/vault/vault.schema";
import { DecryptVaultFormValues, VaultConfigs } from "@/server/features/vault/vault.type";
import { decryptTextWithPassword, hashPasswordNoSalt } from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, PasswordInput } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  item: {
    content: string | null;
    configs?: VaultConfigs;
  };
};

const defaultFormValues: DecryptVaultFormValues = {
  password: "",
};

const decryptContent = async (
  content: string,
  passwords: Set<string | null | undefined>,
  configs?: {
    onSuccess?: (password: string) => void;
  },
): Promise<boolean> => {
  if (!content || !passwords?.size) return false;
  try {
    const promises: ReturnType<typeof decryptTextWithPassword>[] = [];
    passwords?.forEach((password) => {
      if (!password) return;
      promises.push(decryptTextWithPassword(content, password));
    });
    const decryptedResult = await Promise.allSettled(promises);
    let decryptedContent = "";
    let decryptPassword = "";
    decryptedResult.forEach((x, i) => {
      if (x.status !== "fulfilled" || x.value.error) return;
      decryptedContent = x.value.content;
      decryptPassword = x.value.password;
    });
    if (!decryptedContent) {
      return false;
    } else {
      const url = new URL(decryptedContent);
      configs?.onSuccess?.(decryptPassword);
      await new Promise((r) => setTimeout(r, 200));
      window.location.href = url.toString();
      return true;
    }
  } catch (e) {
    return false;
  }
};

export const LinkDetail = ({ item }: Props) => {
  const { passwords, addPassword, addShortUrl } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isPasswordOpen, { open: openPasswordModal }] = useDisclosure(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DecryptVaultFormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(decryptVaultFormSchema),
  });

  const autoDecryptContent = useCallback(async () => {
    setIsLoading(true);
    const passwordOnHash = window.location.hash.slice(1);
    const result = await decryptContent(item.content || "", new Set(passwords).add(passwordOnHash) || new Set());
    setIsLoading(false);
    if (!result) {
      openPasswordModal();
    }
  }, [item.content, passwords, openPasswordModal]);

  const handleFormSubmit: SubmitHandler<DecryptVaultFormValues> = async (data) => {
    setIsError(false);
    setIsLoading(true);
    const password = await hashPasswordNoSalt(data.password, item.configs?.password);
    const result = await decryptContent(item.content || "", new Set([password]), {
      onSuccess: (password) => {
        addPassword(password);
        addShortUrl(window.location.origin + window.location.pathname);
      },
    });
    setIsLoading(false);
    if (!result) {
      setIsError(true);
      openPasswordModal();
    }
  };

  useEffect(() => {
    autoDecryptContent();
  }, [autoDecryptContent]);

  return (
    <>
      {isError && !isPasswordOpen && <ErrorMessage mt="md" />}

      <Modal opened={isPasswordOpen} onClose={() => {}} title="Decrypt this link">
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <PasswordInput label="Password" {...register("password")} error={errors.password?.message} withAsterisk />
          <Button type="submit" mt="xs">
            Submit
          </Button>
          {isError && <ErrorMessage mt="xs" />}
        </Box>
      </Modal>

      <ScreenLoading isLoading={isLoading} />
    </>
  );
};
