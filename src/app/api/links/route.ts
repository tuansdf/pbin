import { createLinkSchema } from "@/server/features/vault/vault.schema";
import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";

export const POST = async (request: Request) => {
  try {
    const data = await createLinkSchema.parseAsync(await request.json());
    const result = await vaultService.createLink(data);
    return Response.json(result);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return Response.json(response, { status });
  }
};
