import { vaultRepository } from "@/server/features/vault/vault.repository";
import { generateRandomAndHandleCollision } from "@/shared/utils/crypto";

export const handleVaultPublicIdCollision = async (randomFn: () => string) => {
  return await generateRandomAndHandleCollision({
    randomFn,
    checkCollisionFn: vaultRepository.existsByPublicId,
  });
};
