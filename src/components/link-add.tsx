"use client";

import { ErrorMessage } from "@/components/error";
import { usePasswordStore } from "@/hooks/use-password-store";
import fclasses from "@/styles/form.module.scss";
import { encryptText } from "@/utils/crypto";
import { Button, Card, CopyButton, LoadingOverlay, PasswordInput, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import classes from "./link-add.module.scss";

type FormValues = {
  content: string;
  password: string;
};
const defaultFormValues: FormValues = {
  content: "",
  password: "",
};

export const LinkAdd = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    reValidateMode: "onSubmit",
  });
  const [passwords, setPasswords] = usePasswordStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const encrypted = await encryptText(data.content, data.password);
      const res = await fetch("/api/links", {
        method: "POST",
        body: JSON.stringify({ content: encrypted }),
      });
      if (!res.ok) {
        return setErrorMessage("Something Went Wrong");
      }
      const body = (await res.json()) as { id: string | undefined };
      reset({ password: "" });
      setPasswords((prev) => prev?.add(data.password));
      const shortLink = window.location.origin + `/s/${body.id}`;
      setShortLink(shortLink);
    } catch (e) {
      setErrorMessage("Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setShortLink("");
  };

  const isSubmitted = !!shortLink;

  return (
    <>
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
        mb="1rem"
      >
        <Title>Shorten a link</Title>
        <TextInput
          autoComplete="off"
          autoFocus
          required
          label="Long link"
          readOnly={isSubmitted}
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
                return "Must be a valid URL";
              }
            },
          })}
          error={errors.content?.message}
        />
        {!isSubmitted && (
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
        )}
        {isSubmitted && (
          <>
            <TextInput readOnly label="Short link" value={shortLink} />
            <div className={classes["buttons"]}>
              <Button component="a" href={shortLink} target="_blank" variant="default">
                Open
              </Button>
              <CopyButton value={shortLink}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "blue"} onClick={copy}>
                    {copied ? "Copied url" : "Copy url"}
                  </Button>
                )}
              </CopyButton>
            </div>
          </>
        )}
        {!isSubmitted && (
          <Button type="submit" w="max-content">
            Submit
          </Button>
        )}
        {isSubmitted && (
          <Button type="reset" w="max-content" onClick={resetForm}>
            Make another
          </Button>
        )}

        <LoadingOverlay visible={isLoading} />
      </Card>

      {!!errorMessage && <ErrorMessage msg={errorMessage} />}
    </>
  );
};
