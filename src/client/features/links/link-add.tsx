"use client";

import { createLink } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import classes from "@/client/features/links/link-add.module.scss";
import { useAppStore } from "@/client/stores/app.store";
import fclasses from "@/client/styles/form.module.scss";
import { createLinkFormSchema } from "@/server/features/vault/vault.schema";
import { CreateLinkFormValues } from "@/server/features/vault/vault.type";
import { encryptText, generatePasswordConfigs, hashPasswordValue } from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CopyButton, PasswordInput, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultFormValues: CreateLinkFormValues = {
  content: "",
  password: "",
};

export const LinkAdd = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateLinkFormValues>({
    defaultValues: defaultFormValues,
    reValidateMode: "onSubmit",
    resolver: zodResolver(createLinkFormSchema),
  });
  const { addPassword, addShortUrl } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit: SubmitHandler<CreateLinkFormValues> = async (data) => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const passwordConfigs = generatePasswordConfigs();
      const hashedPassword = await hashPasswordValue(data.password, passwordConfigs);
      const encrypted = await encryptText(data.content, hashedPassword);
      const body = await createLink({ content: encrypted || "", configs: { password: passwordConfigs } });
      reset({ password: "" });
      addPassword(hashedPassword);
      const shortLink = window.location.origin + `/s/${body.publicId}`;
      addShortUrl(shortLink);
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
        mb="md"
      >
        <Title>Shorten a link</Title>
        <TextInput
          autoComplete="off"
          autoFocus
          withAsterisk
          label="Long link"
          readOnly={isSubmitted}
          {...register("content")}
          error={errors.content?.message}
        />
        {!isSubmitted && (
          <PasswordInput
            type="password"
            autoComplete="current-password"
            withAsterisk
            label="Password"
            {...register("password")}
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
      </Card>

      <ScreenLoading isLoading={isLoading} />

      {!!errorMessage && <ErrorMessage msg={errorMessage} />}
    </>
  );
};
