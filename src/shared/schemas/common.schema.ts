import { z } from "zod";

export const passwordSchema = z
  .string({
    required_error: "Invalid password",
    invalid_type_error: "Invalid password",
  })
  .min(10, "Invalid password");
