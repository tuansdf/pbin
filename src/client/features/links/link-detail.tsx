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
): Promise<{ status: "success"; raw: string; password: string; url: string } | { status: "fail" }> => {
  if (!content || !passwords?.size) return { status: "fail" };
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
      return { status: "fail" };
    } else {
      const url = new URL(decryptedContent);
      return { status: "success", raw: decryptedContent, password: decryptPassword, url: url.toString() };
    }
  } catch (e) {
    return { status: "fail" };
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
    if (result.status === "success") {
      window.location.href = result.url;
      return;
    }
    if (result.status === "fail") {
      openPasswordModal();
    }
    setIsLoading(false);
  }, [item.content, passwords, openPasswordModal]);

  const handleFormSubmit: SubmitHandler<DecryptVaultFormValues> = async (data) => {
    setIsError(false);
    setIsLoading(true);
    const shortUrl = window.location.origin + window.location.pathname;
    const rawResult = await decryptContent(item.content || "", new Set([data.password]));
    if (rawResult.status === "success") {
      addPassword(rawResult.password);
      addShortUrl(shortUrl);
      window.location.href = rawResult.url;
      return;
    }
    const password = await hashPasswordNoSalt(data.password, item.configs?.password);
    const hashedResult = await decryptContent(item.content || "", new Set([password]));
    if (hashedResult.status === "success") {
      addPassword(hashedResult.password);
      addShortUrl(shortUrl);
      window.location.href = hashedResult.url;
      return;
    }
    if (hashedResult.status === "fail") {
      setIsError(true);
      openPasswordModal();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    autoDecryptContent();
  }, [autoDecryptContent]);

  return (
    <>
      {isError && !isPasswordOpen && <ErrorMessage mt="md" />}

      <Modal
        opened={isPasswordOpen}
        onClose={() => {}}
        title="Decrypt this link"
        withCloseButton={false}
        transitionProps={{ transition: "fade", duration: 0 }}
      >
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
