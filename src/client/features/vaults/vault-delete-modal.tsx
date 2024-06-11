import { ErrorMessage } from "@/client/components/error";
import { useDisclosure } from "@/client/hooks/use-disclosure";
import { SearchObject } from "@/shared/types/common.type";
import { hashPassword } from "@/shared/utils/crypto";
import { toObject } from "@/shared/utils/query-string";
import { Box, Button, LoadingOverlay, Modal, PasswordInput } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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

const getPasswordConfig = async (id: string) => {
  const res = await axios.get<{ passwordConfig: string }>(`/api/vaults/${id}/configs`);
  return res.data;
};

const deleteVault = async (id: string, password: string) => {
  const res = await axios.post<null>(`/api/vaults/${id}/delete`, { password });
  return res.data;
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
  const [passwordConfig, setPasswordConfig] = useState<SearchObject>();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const getConfig = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const res = await getPasswordConfig(id);
      setPasswordConfig(toObject(res.passwordConfig));
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getConfig();
  }, [id]);

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
      await deleteVault(id, password.hash);
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

      <LoadingOverlay visible={isLoading} />
    </Box>
  );
};
