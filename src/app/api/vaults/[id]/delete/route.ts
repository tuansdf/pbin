import { deleteVaultSchema } from "@/server/features/vault/vault.schema";
import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id;
    const data = await deleteVaultSchema.parseAsync(await request.json());
    await vaultService.deleteTopByPublicId(id, data);
    return Response.json(null);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return Response.json(response, { status });
  }
};
