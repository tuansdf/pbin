import { DEFAULT_LINK_ID_SIZE, DEFAULT_NOTE_ID_SIZE, VAULT_TYPE_LINK } from "@/server/features/vault/vault.constant";
import { vaultRepository } from "@/server/features/vault/vault.repository";
import { CreateVaultRequest, DeleteVaultRequest, VaultConfigs } from "@/server/features/vault/vault.type";
import { handleVaultPublicIdCollision } from "@/server/features/vault/vault.util";
import { CustomException } from "@/shared/exceptions/custom-exception";
import { generateId, hashPassword } from "@/shared/utils/crypto";

class VaultService {
  public create = async (data: CreateVaultRequest, type: number) => {
    const publicId = await handleVaultPublicIdCollision(() =>
      generateId(type === VAULT_TYPE_LINK ? DEFAULT_LINK_ID_SIZE : DEFAULT_NOTE_ID_SIZE),
    );
    const hashedPassword = data.password ? await hashPassword(data.password, data.configs.hash) : undefined;
    await vaultRepository.create({
      publicId,
      content: data.content,
      password: hashedPassword,
      configs: JSON.stringify(data.configs),
    });
    return { publicId };
  };

  public getTopByPublicId = async (id: string) => {
    const vault = await vaultRepository.getTopByPublicId(id);
    if (!vault) {
      throw new CustomException();
    }
    let configs = this.parseVaultConfigs(vault.configs!);

    return {
      publicId: id,
      content: vault.content,
      configs,
    };
  };

  private parseVaultConfigs = (configs?: string): VaultConfigs | undefined => {
    try {
      if (configs) {
        return JSON.parse(configs) as VaultConfigs;
      }
    } catch (e) {}
  };

  public deleteTopByPublicId = async (id: string, data: DeleteVaultRequest) => {
    const vault = await vaultRepository.getTopByPublicId(id);
    const reqPassword = await hashPassword(data.password, this.parseVaultConfigs(vault.configs!)?.hash!);
    if (vault.password !== reqPassword) {
      throw new CustomException();
    }
    await vaultRepository.deleteById(vault.id);
  };
}

export const vaultService = new VaultService();
