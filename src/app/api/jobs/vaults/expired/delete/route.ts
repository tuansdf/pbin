import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const result = await vaultService.deleteExpiredVaults();
    return Response.json({ message: result, status: 200 }, { status: 200 });
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return Response.json(response, { status });
  }
};
