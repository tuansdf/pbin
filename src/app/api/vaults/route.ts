import { createVaultRequestSchema } from "@/server/features/vault/vault.schema";
import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const data = await createVaultRequestSchema.parseAsync(await request.json());
    const result = await vaultService.create(data, Number(searchParams.get("type")));
    return Response.json(result);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return Response.json(response, { status });
  }
};
