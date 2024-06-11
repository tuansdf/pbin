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

export const createNoteSchema = z
  .object({
    content: z
      .string({
        required_error: "Invalid content",
        invalid_type_error: "Invalid content",
      })
      .min(1, "Missing content"),
    password: passwordSchema.optional(),
    passwordConfig: z
      .string({
        required_error: "Invalid password config",
        invalid_type_error: "Invalid password config",
      })
      .min(1, "Missing password")
      .optional(),
  })
  .refine(
    (data) => {
      return !(!!data.password && !data.passwordConfig);
    },
    {
      message: "Missing password config",
    },
  );

export const deleteVaultSchema = z.object({
  password: passwordSchema,
});
