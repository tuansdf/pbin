"use client";

import { createLink } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useAppStore } from "@/client/stores/app.store";
import fclasses from "@/client/styles/form.module.scss";
import { createLinkFormSchema } from "@/server/features/vault/vault.schema";
import { CreateLinkFormValues } from "@/server/features/vault/vault.type";
import { encryptText, generatePassword, generatePasswordConfigs, hashPasswordNoSalt } from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CopyButton, Group, PasswordInput, TextInput, Title } from "@mantine/core";
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
    setValue,
    getValues,
  } = useForm<CreateLinkFormValues>({
    defaultValues: defaultFormValues,
    reValidateMode: "onSubmit",
    resolver: zodResolver(createLinkFormSchema),
  });
  const { addPassword, addShortUrl } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [shortLinkWithPassword, setShortLinkWithPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit: SubmitHandler<CreateLinkFormValues> = async (data) => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const passwordConfigs = generatePasswordConfigs();
      const hashedPassword = await hashPasswordNoSalt(data.password, passwordConfigs);
      const encrypted = await encryptText(data.content, hashedPassword);
      const body = await createLink({ content: encrypted || "", configs: { password: passwordConfigs } });
      reset({ password: "" });
      addPassword(hashedPassword);
      const shortLink = window.location.origin + `/s/${body.publicId}`;
      addShortUrl(shortLink);
      setShortLink(shortLink);
      setShortLinkWithPassword(shortLink + `#${hashedPassword}`);
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

  const handlePreSubmit = () => {
    if (!getValues("content")) return;
    setValue("password", generatePassword());
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
        <Title>Shorten a URL</Title>
        <TextInput
          autoComplete="off"
          autoFocus
          withAsterisk
          label="Long URL"
          readOnly={isSubmitted}
          {...register("content")}
          error={errors.content?.message}
        />
        {!isSubmitted && (
          <PasswordInput
            type="password"
            autoComplete="current-password"
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            description="Random password will be generated when left empty"
          />
        )}
        {isSubmitted && (
          <>
            <TextInput readOnly label="Short URL" value={shortLink} />
            <Group>
              <Button component="a" href={shortLink} target="_blank" variant="default">
                Open
              </Button>
              <CopyButton value={shortLink}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "blue"} onClick={copy}>
                    {copied ? "Copied URL" : "Copy URL"}
                  </Button>
                )}
              </CopyButton>
              <CopyButton value={shortLinkWithPassword}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "blue"} onClick={copy}>
                    {copied ? "Copied URL" : "Copy URL (password embed)"}
                  </Button>
                )}
              </CopyButton>
            </Group>
          </>
        )}
        {!isSubmitted && (
          <Button type="submit" w="max-content" onClick={handlePreSubmit}>
            Submit
          </Button>
        )}
        {isSubmitted && (
          <Button type="reset" w="max-content" onClick={resetForm}>
            Shorten another
          </Button>
        )}
      </Card>

      <ScreenLoading isLoading={isLoading} />

      {!!errorMessage && <ErrorMessage msg={errorMessage} />}
    </>
  );
};
