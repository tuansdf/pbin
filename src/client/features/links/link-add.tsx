"use client";

import { createVault } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useAppStore } from "@/client/stores/app.store";
import fclasses from "@/client/styles/form.module.scss";
import { VAULT_TYPE_LINK } from "@/server/features/vault/vault.constant";
import { createLinkFormSchema } from "@/server/features/vault/vault.schema";
import { CreateVaultFormValues } from "@/server/features/vault/vault.type";
import { encryptText, generateHashConfigs, generatePassword, hashPassword } from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CopyButton, Group, PasswordInput, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultFormValues: CreateVaultFormValues = {
  content: "",
  password: "",
  masterPassword: "",
};

export const LinkAdd = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateVaultFormValues>({
    defaultValues: defaultFormValues,
    reValidateMode: "onSubmit",
    resolver: zodResolver(createLinkFormSchema),
  });
  const { addPassword, addShortUrl } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [shortLinkWithPassword, setShortLinkWithPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit: SubmitHandler<CreateVaultFormValues> = async (data) => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const hashConfigs = generateHashConfigs();
      const promises = [
        data.password ? hashPassword(data.password, hashConfigs) : generatePassword(),
        data.masterPassword ? hashPassword(data.masterPassword, hashConfigs) : undefined,
      ] as const;
      const [password, masterPassword] = await Promise.all(promises);
      const encrypted = await encryptText(data.content!, password);
      const body = await createVault(
        { content: encrypted || "", configs: { hash: hashConfigs }, password: masterPassword },
        VAULT_TYPE_LINK,
      );
      reset({ password: "" });
      addPassword(password);
      const shortLink = window.location.origin + `/s/${body.publicId}`;
      addShortUrl(shortLink);
      setShortLink(shortLink);
      setShortLinkWithPassword(shortLink + `#${password}`);
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
          <>
            <PasswordInput
              type="password"
              autoComplete="current-password"
              label="Password"
              {...register("password")}
              error={errors.password?.message}
              description="Random password will be generated when left empty"
            />
            <PasswordInput
              type="password"
              autoComplete="current-password"
              label="Master Password"
              {...register("masterPassword")}
              error={errors.masterPassword?.message}
              description="To perform update/delete"
            />
          </>
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
          <Button type="submit" w="max-content">
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
