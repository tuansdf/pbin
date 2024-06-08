import { vaultRepository } from "@/databases/repositories/vault.repository";
import { generateId } from "@/utils/crypto";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1),
});

const DEFAULT_ID_SIZE = 8;

export const POST = async (request: Request) => {
  const parseResult = await createSchema.safeParseAsync(await request.json());
  if (!parseResult.success) {
    return Response.json({ message: "Missing link" }, { status: 400 });
  }
  const content = parseResult.data.content || "";
  const publicId = generateId(DEFAULT_ID_SIZE);
  await vaultRepository.create({ content, publicId });
  return Response.json({ id: publicId });
};
