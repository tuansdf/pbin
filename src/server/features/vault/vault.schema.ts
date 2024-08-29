import {
  CreateVaultFormValues,
  CreateVaultRequest,
  DecryptVaultFormValues,
  DeleteVaultRequest,
  HashConfigs,
  VaultConfigs,
} from "@/server/features/vault/vault.type";
import { passwordSchema, stringOrUndefined } from "@/shared/schemas/common.schema";
import { z } from "zod";

const passwordConfigsSchema: z.ZodType<HashConfigs> = z.object(
  {
    keySize: z.number({
      required_error: "Invalid key size",
      invalid_type_error: "Invalid key size",
    }),
    iterations: z.number({
      required_error: "Invalid iterations",
      invalid_type_error: "Invalid iterations",
    }),
    salt: z
      .string({
        required_error: "Invalid salt",
        invalid_type_error: "Invalid salt",
      })
      .min(1, "Invalid salt"),
  },
  {
    required_error: "Password configs is required",
    invalid_type_error: "Invalid password configs",
  },
);

const vaultConfigsSchema: z.ZodType<VaultConfigs> = z.object(
  {
    hash: passwordConfigsSchema,
  },
  { required_error: "Configs is required", invalid_type_error: "Invalid configs" },
);

const contentSchema = z
  .string({
    required_error: "Invalid content",
    invalid_type_error: "Invalid content",
  })
  .min(1, "Missing content");
const urlSchema = z
  .string({
    required_error: "Invalid URL",
    invalid_type_error: "Invalid URL",
  })
  .url("Invalid URL");

export const createVaultRequestSchema: z.ZodType<CreateVaultRequest> = z.object({
  content: contentSchema,
  password: passwordSchema.optional(),
  configs: vaultConfigsSchema,
});

export const deleteVaultSchema: z.ZodType<DeleteVaultRequest> = z.object({
  password: passwordSchema,
});

export const createLinkFormSchema: z.ZodType<CreateVaultFormValues> = z.object({
  content: urlSchema,
  password: passwordSchema,
});

export const createNoteFormSchema: z.ZodType<CreateVaultFormValues> = z.object({
  content: contentSchema,
  password: stringOrUndefined.pipe(passwordSchema.optional()),
});

export const decryptVaultFormSchema: z.ZodType<DecryptVaultFormValues> = z.object({
  password: passwordSchema,
});
