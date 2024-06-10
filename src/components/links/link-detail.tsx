"use client";

import { ErrorMessage } from "@/components/error";
import { ScreenLoading } from "@/components/screen-loading";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useAppStore } from "@/stores/app.store";
import { decryptText } from "@/utils/crypto";
import { Box, Button, Modal, PasswordInput } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  item: {
    content: string | null;
  };
};

type FormValues = {
  password: string;
};
const defaultFormValues: FormValues = {
  password: "",
};

export const LinkDetail = ({ item }: Props) => {
  const { passwords, addPassword } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isPasswordOpen, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure(false);
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const decryptContent = useCallback(async () => {
    const content = item.content;
    if (!content) {
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (!passwords?.size) {
      openPasswordModal();
      setIsLoading(false);
      return;
    }
    try {
      setIsError(false);
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      const promises: Promise<string | undefined>[] = [];
      passwords?.forEach((password) => {
        if (!password) return;
        promises.push(decryptText(content, password));
      });
      const decrypteds = await Promise.allSettled(promises);
      const decrypted = decrypteds.find((x) => x.status === "fulfilled" && !!x.value);
      const dcontent = decrypted?.status === "fulfilled" ? decrypted.value || "" : "";
      if (!dcontent) {
        openPasswordModal();
      } else {
        const url = new URL(dcontent);
        window.location.href = url.toString();
      }
    } catch (e) {
      openPasswordModal();
    } finally {
      setIsLoading(false);
    }
  }, [item.content, passwords, openPasswordModal]);

  useEffect(() => {
    decryptContent();
  }, [decryptContent]);

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    const content = item.content;
    if (!content) {
      return setIsError(true);
    }
    try {
      setIsLoading(true);
      setIsError(false);
      await new Promise((r) => setTimeout(r, 800));
      const decrypted = await decryptText(content, data.password);
      if (!decrypted) {
        setIsError(true);
      } else {
        addPassword(data.password);
        const url = new URL(decrypted);
        window.location.href = url.toString();
      }
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={openPasswordModal}>Open link</Button>

      {isError && !isPasswordOpen && <ErrorMessage mt="md" />}

      <Modal opened={isPasswordOpen} onClose={closePasswordModal} title="Decrypt this link">
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <PasswordInput
            label="Password"
            {...register("password", {
              required: {
                value: true,
                message: "Required",
              },
              minLength: {
                value: 10,
                message: "Must have at least 10 characters",
              },
            })}
            required
          />
          <Button type="submit" mt="xs">
            Submit
          </Button>
          {isError && <ErrorMessage mt="xs" />}
        </Box>
      </Modal>

      {isLoading && <ScreenLoading isLoading={isLoading} />}
    </>
  );
};
