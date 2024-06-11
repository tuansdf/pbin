import { vaultRepository } from "@/databases/repositories/vault.repository";
import { handleVaultPublicIdCollision } from "@/databases/utils/vault.util";
import { generateId } from "@/utils/crypto";
import { z } from "zod";

const createSchema = z
  .object({
    content: z
      .string({
        required_error: "Invalid content",
        invalid_type_error: "Invalid content",
      })
      .min(1, "Missing content"),
    password: z
      .string({
        required_error: "Invalid password",
        invalid_type_error: "Invalid password",
      })
      .min(10, "Invalid password")
      .optional(),
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

const DEFAULT_ID_SIZE = 24;

export const POST = async (request: Request) => {
  try {
    const parseResult = await createSchema.safeParseAsync(await request.json());
    if (!parseResult.success) {
      return Response.json({ message: parseResult.error.errors[0]?.message }, { status: 400 });
    }
    const { content, passwordConfig, password } = parseResult.data;
    const publicId = await handleVaultPublicIdCollision(() => generateId(DEFAULT_ID_SIZE));
    await vaultRepository.create({ content, publicId, password, passwordConfig });
    return Response.json({ id: publicId });
  } catch (e) {
    return Response.json({ message: "Something Went Wrong" }, { status: 500 });
  }
};
