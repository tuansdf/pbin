import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id;
    const result = await vaultService.getTopByPublicId(id);
    return Response.json({ passwordConfig: result.passwordConfig });
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return Response.json(response, { status });
  }
};
