"use client";

import { ErrorMessage } from "@/components/error";
import { ScreenLoading } from "@/components/screen-loading";
import { useDisclosure } from "@/hooks/use-disclosure";
import { usePasswordStore } from "@/hooks/use-password-store";
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
  const [passwords] = usePasswordStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isPasswordOpen, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure(false);
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const decryptContent = useCallback(async () => {
    const content = item.content;
    if (!content) {
      return setIsError(true);
    }
    if (!passwords?.size) {
      return openPasswordModal();
    }
    try {
      setIsError(false);
      setIsLoading(true);
      const promises: Promise<string | undefined>[] = [];
      passwords?.forEach((password) => {
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
      const decrypted = await decryptText(content, data.password);
      if (!decrypted) {
        setIsError(true);
      } else {
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

      {isError && !isPasswordOpen && <ErrorMessage mt="1rem" />}

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
          <Button type="submit" mt="0.5rem">
            Submit
          </Button>
          {isError && <ErrorMessage mt="0.5rem" />}
        </Box>
      </Modal>

      <ScreenLoading isLoading={isLoading} />
    </>
  );
};
