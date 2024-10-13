import { vaultRepository } from "@/server/features/vault/vault.repository";
import { handleRetry } from "@/shared/utils/common.util";

export const handleVaultPublicIdCollision = async (randomFn: () => string) => {
  return await handleRetry({
    resultFn: randomFn,
    shouldRetryFn: vaultRepository.existsByPublicId,
  });
};
