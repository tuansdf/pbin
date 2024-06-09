import { vaultRepository } from "@/databases/repositories/vault.repository";
import { generateRandomAndHandleCollision } from "@/utils/crypto";

export const handleVaultPublicIdCollision = async (randomFn: () => string) => {
  return await generateRandomAndHandleCollision({
    randomFn,
    checkCollisionFn: vaultRepository.existsByPublicId,
  });
};
