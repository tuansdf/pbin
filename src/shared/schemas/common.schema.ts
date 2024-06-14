import { z } from "zod";

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Invalid password",
  })
  .min(10, "Must have at least 10 characters");

export const stringOrUndefined = z.string().transform((v) => v || undefined);
