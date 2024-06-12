import { z } from "zod";

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Invalid password",
  })
  .min(10, "Invalid password");
