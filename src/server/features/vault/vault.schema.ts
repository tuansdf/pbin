import { passwordSchema } from "@/shared/schemas/common.schema";
import { z } from "zod";

export const createLinkSchema = z.object({
  content: z
    .string({
      required_error: "Invalid content",
      invalid_type_error: "Invalid content",
    })
    .min(1, "Missing content"),
});

const vaultConfigsSchema = z.object({
  password: z
    .object({
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
    })
    .optional(),
});

export const createNoteSchema = z
  .object({
    content: z
      .string({
        required_error: "Invalid content",
        invalid_type_error: "Invalid content",
      })
      .min(1, "Missing content"),
    password: passwordSchema.optional(),
    configs: vaultConfigsSchema.optional(),
  })
  .refine(
    (data) => {
      return !(!!data.password && !data.configs);
    },
    {
      message: "Missing password config",
    },
  );

export const deleteVaultSchema = z.object({
  password: passwordSchema,
});
