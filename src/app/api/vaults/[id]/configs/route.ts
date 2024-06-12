import { vaultService } from "@/server/features/vault/vault.service";
import { GetVaultConfigsResponse } from "@/server/features/vault/vault.type";
import { exceptionUtils } from "@/shared/exceptions/exception.util";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id;
    const result = await vaultService.getTopByPublicIdInternal(id);
    return Response.json({ configs: JSON.parse(result.configs || "{}") } satisfies GetVaultConfigsResponse);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return Response.json(response, { status });
  }
};
