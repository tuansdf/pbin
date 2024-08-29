import { deleteVault } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useDisclosure } from "@/client/hooks/use-disclosure";
import { deleteVaultSchema } from "@/server/features/vault/vault.schema";
import { HashConfigs } from "@/server/features/vault/vault.type";
import { hashPassword } from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, PasswordInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  id: string;
  hashConfigs?: HashConfigs;
};

export const VaultDeleteModal = ({ id, hashConfigs }: Props) => {
  const [opened, { close, open }] = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button onClick={open} color="red">
        Delete
      </Button>

      <Modal opened={opened} onClose={close} title="Delete">
        {opened && (
          <VaultDeleteModalContent
            id={id}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            hashConfigs={hashConfigs}
          />
        )}
      </Modal>

      <ScreenLoading isLoading={isLoading} />
    </>
  );
};

type FormValues = {
  password: string;
};
const defaultFormValues: FormValues = {
  password: "",
};

type ContentProps = {
  isLoading: boolean;
  setIsLoading: (a: boolean) => void;
  hashConfigs?: HashConfigs;
} & Props;

const VaultDeleteModalContent = ({ id, isLoading, setIsLoading, hashConfigs }: ContentProps) => {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(deleteVaultSchema),
  });

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const password = await hashPassword(data.password, hashConfigs!);
      await deleteVault(id, { password });
      router.push("/n-add");
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <PasswordInput
          autoFocus
          label="Password"
          mb="md"
          autoComplete="current-password"
          withAsterisk
          {...register("password")}
          error={errors.password?.message}
        />
        <Button type="submit">Submit</Button>
      </form>

      {isError && <ErrorMessage mt="md" />}
    </Box>
  );
};
