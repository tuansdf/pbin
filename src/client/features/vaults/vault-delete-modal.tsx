import { deleteVault, getVaultConfigs } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useDisclosure } from "@/client/hooks/use-disclosure";
import { deleteVaultSchema } from "@/server/features/vault/vault.schema";
import { hashPassword } from "@/shared/utils/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, LoadingOverlay, Modal, PasswordInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

type Props = {
  id: string;
};

export const VaultDeleteModal = ({ id }: Props) => {
  const [opened, { close, open }] = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button onClick={open} color="red">
        Delete
      </Button>

      <Modal opened={opened} onClose={close} title="Delete">
        {opened && <VaultDeleteModalContent id={id} isLoading={isLoading} setIsLoading={setIsLoading} />}
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
} & Props;

const VaultDeleteModalContent = ({ id, isLoading, setIsLoading }: ContentProps) => {
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
  const configsQuery = useSWR(`vaults.${id}.configs`, () => getVaultConfigs(id));

  const configs = configsQuery.data?.configs;

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (!configs || !Object.keys(configs).length) {
        throw new Error();
      }
      const password = await hashPassword(data.password, configs.password);
      if (password.error) {
        throw new Error();
      }
      await deleteVault(id, { password: password.hash });
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

      <LoadingOverlay visible={configsQuery.isLoading} />
    </Box>
  );
};
