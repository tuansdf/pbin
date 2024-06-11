import { vaultRepository } from "@/server/databases/repositories/vault.repository";
import { z } from "zod";

const deleteSchema = z.object({
  password: z
    .string({
      required_error: "Invalid password",
      invalid_type_error: "Invalid password",
    })
    .min(10, "Invalid password"),
});

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id;
    if (!id) {
      throw new Error();
    }
    const parseResult = await deleteSchema.safeParseAsync(await request.json());
    console.log({ id, parseResult });
    if (!parseResult.success) {
      return Response.json({ message: parseResult.error.errors[0]?.message }, { status: 400 });
    }
    const password = parseResult.data.password || "";
    const vault = await vaultRepository.getTopByPublicIdInternal(id);
    if (vault.password !== password) {
      throw new Error();
    }
    await vaultRepository.deleteById(vault.id);
    return Response.json(null, { status: 200 });
  } catch (e) {
    return Response.json({ message: "Something Went Wrong" }, { status: 500 });
  }
};
