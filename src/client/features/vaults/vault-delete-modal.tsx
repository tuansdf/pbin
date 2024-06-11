import { deleteVault, getVaultConfigs } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { useDisclosure } from "@/client/hooks/use-disclosure";
import { hashPassword } from "@/shared/utils/crypto";
import { toObject } from "@/shared/utils/query-string";
import { Box, Button, LoadingOverlay, Modal, PasswordInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

type Props = {
  id: string;
};

export const VaultDeleteModal = ({ id }: Props) => {
  const [opened, { close, open }] = useDisclosure();

  return (
    <>
      <Button onClick={open} color="red">
        Delete
      </Button>

      <Modal opened={opened} onClose={close} title="Delete">
        {opened && <VaultDeleteModalContent id={id} />}
      </Modal>
    </>
  );
};

type FormValues = {
  password: string;
};
const defaultFormValues: FormValues = {
  password: "",
};

const VaultDeleteModalContent = ({ id }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });
  const configsQuery = useSWR(`vaults.${id}.configs`, () => getVaultConfigs(id));

  const passwordConfig = useMemo(() => {
    return toObject(configsQuery.data?.passwordConfig || "");
  }, [configsQuery.data]);

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (!passwordConfig || !Object.keys(passwordConfig).length) {
        throw new Error();
      }
      const password = await hashPassword(data.password, passwordConfig);
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
          required
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
        <Button type="submit">Submit</Button>
      </form>

      {isError && <ErrorMessage mt="md" />}

      <LoadingOverlay visible={isLoading || configsQuery.isLoading} />
    </Box>
  );
};
