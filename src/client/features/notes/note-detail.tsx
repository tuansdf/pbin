"use client";

import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { VaultDeleteModal } from "@/client/features/vaults/vault-delete-modal";
import { VaultConfigs } from "@/server/features/vault/vault.type";
import { decryptText } from "@/shared/utils/crypto";
import { Button, Group, Textarea } from "@mantine/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Props = {
  item: {
    content: string | null;
    configs?: VaultConfigs;
  };
};

export const NoteDetail = ({ item }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [decrypted, setDecrypted] = useState<string | undefined>();
  const { id } = useParams<{ id: string }>();

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

  if (isLoading) return <ScreenLoading isLoading={isLoading} />;
  if (isError) return <ErrorMessage />;

  return (
    <>
      <Group mb="md">
        <Button component={Link} href="/n-add">
          New paste
        </Button>
        <VaultDeleteModal id={id} hashConfigs={item.configs?.hash} />
      </Group>
      <form>{decrypted ? <Textarea value={decrypted} readOnly rows={30} /> : <ErrorMessage />}</form>
    </>
  );
};
