import { DEFAULT_LINK_ID_SIZE, DEFAULT_NOTE_ID_SIZE, VAULT_TYPE_LINK } from "@/server/features/vault/vault.constant";
import { vaultRepository } from "@/server/features/vault/vault.repository";
import { CreateVaultRequest, DeleteVaultRequest, VaultConfigs } from "@/server/features/vault/vault.type";
import { handleVaultPublicIdCollision } from "@/server/features/vault/vault.util";
import { CustomException } from "@/shared/exceptions/custom-exception";
import { generateId } from "@/shared/utils/crypto";

class VaultService {
  public create = async (data: CreateVaultRequest, type: number) => {
    const publicId = await handleVaultPublicIdCollision(() =>
      generateId(type === VAULT_TYPE_LINK ? DEFAULT_LINK_ID_SIZE : DEFAULT_NOTE_ID_SIZE),
    );
    await vaultRepository.create({
      publicId,
      content: data.content,
      password: data.password,
      configs: JSON.stringify(data.configs),
    });
    return { publicId };
  };

  public getTopByPublicId = async (id: string) => {
    const vault = await vaultRepository.getTopByPublicId(id);
    if (!vault) {
      throw new CustomException();
    }
    let configs: VaultConfigs | undefined = undefined;
    try {
      if (vault.configs) {
        configs = JSON.parse(vault.configs) as VaultConfigs;
      }
    } catch (e) {}

    return {
      publicId: id,
      content: vault.content,
      configs,
    };
  };

  public deleteTopByPublicId = async (id: string, data: DeleteVaultRequest) => {
    const vault = await vaultRepository.getTopByPublicId(id);
    if (vault.password !== data.password) {
      throw new CustomException();
    }
    await vaultRepository.deleteById(vault.id);
  };
}

export const vaultService = new VaultService();
