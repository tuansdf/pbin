"use client";

import { usePasswordStore } from "@/hooks/use-password-store";
import fclasses from "@/styles/form.module.scss";
import { encryptText } from "@/utils/crypto";
import { Button, Card, LoadingOverlay, PasswordInput, TextInput, Title } from "@mantine/core";
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

export const LinkAdd = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    reValidateMode: "onSubmit",
  });
  const [passwords, setPasswords] = usePasswordStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const encrypted = await encryptText(data.content, data.password);
      const res = await fetch("/api/links", {
        method: "POST",
        body: JSON.stringify({ content: encrypted }),
      });
      const body = (await res.json()) as { id: string | undefined };
      setPasswords((prev) => prev?.add(data.password));
      router.push(`/s/${body.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      pos="relative"
      withBorder
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className={fclasses["form"]}
      maw="30rem"
    >
      <Title>Shorten a link</Title>
      <TextInput
        autoComplete="off"
        autoFocus
        required
        label="Link"
        {...register("content", {
          minLength: {
            value: 1,
            message: "Required",
          },
          required: {
            value: true,
            message: "Required",
          },
          validate: (v) => {
            try {
              new URL(v);
            } catch (e) {
              return "Must be a valid link";
            }
          },
        })}
        error={errors.content?.message}
      />
      <PasswordInput
        type="password"
        autoComplete="current-password"
        required
        label="Password"
        {...register("password", {
          minLength: {
            value: 10,
            message: "Must have at least 10 characters",
          },
          required: {
            value: true,
            message: "Required",
          },
        })}
        error={errors.password?.message}
      />
      <Button type="submit" w="max-content">
        Submit
      </Button>

      <LoadingOverlay visible={isLoading} />
    </Card>
  );
};
