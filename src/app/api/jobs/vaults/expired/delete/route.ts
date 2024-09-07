import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";

export const POST = async () => {
  try {
    await vaultService.deleteExpiredVaults();
    return Response.json(null);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return Response.json(response, { status });
  }
};
