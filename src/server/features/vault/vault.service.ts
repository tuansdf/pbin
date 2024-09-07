import { DEFAULT_LINK_ID_SIZE, DEFAULT_NOTE_ID_SIZE, VAULT_TYPE_LINK } from "@/server/features/vault/vault.constant";
import { vaultRepository } from "@/server/features/vault/vault.repository";
import { CreateVaultRequest, DeleteVaultRequest, VaultConfigs } from "@/server/features/vault/vault.type";
import { handleVaultPublicIdCollision } from "@/server/features/vault/vault.util";
import { CustomException } from "@/shared/exceptions/custom-exception";
import { generateFakeContent } from "@/shared/utils/common.util";
import { generateFakeHashConfigs, generateId, hashPassword } from "@/shared/utils/crypto";
import dayjs from "dayjs";

class VaultService {
  public create = async (data: CreateVaultRequest, type: number) => {
    const publicId = await handleVaultPublicIdCollision(() =>
      generateId(type === VAULT_TYPE_LINK ? DEFAULT_LINK_ID_SIZE : DEFAULT_NOTE_ID_SIZE),
    );
    const hashedPassword = data.masterPassword ? await hashPassword(data.masterPassword, data.configs.hash) : undefined;
    await vaultRepository.create({
      publicId,
      content: data.content,
      masterPassword: hashedPassword,
      configs: JSON.stringify(data.configs),
      expiresAt: dayjs().add(1, "year").unix(),
    });
    return { publicId };
  };

  public getTopByPublicId = async (
    id: string,
  ): Promise<{ publicId: string; content: string | null; configs?: VaultConfigs }> => {
    const vault = await vaultRepository.findTopByPublicId(id);
    if (!vault) {
      return {
        publicId: id,
        content: generateFakeContent(id),
        configs: { hash: generateFakeHashConfigs(id) },
      };
    }
    let configs = this.parseVaultConfigs(vault.configs!);

    return {
      publicId: id,
      content: vault.content,
      configs,
    };
  };

  public deleteExpiredVaults = async () => {
    await vaultRepository.deleteAllExpiresAtAfter(dayjs().unix());
  };

  private parseVaultConfigs = (configs?: string | null): VaultConfigs | undefined => {
    try {
      if (configs) {
        return JSON.parse(configs) as VaultConfigs;
      }
    } catch (e) {}
  };

  public getVaultConfigs = async (id: string): Promise<VaultConfigs> => {
    const vault = await vaultRepository.findTopByPublicId(id);
    if (!vault) {
      return {
        hash: generateFakeHashConfigs(id),
      };
    }
    const configs = this.parseVaultConfigs(vault.configs);
    if (configs) return configs;
    return {
      hash: generateFakeHashConfigs(id),
    };
  };

  public deleteTopByPublicId = async (id: string, data: DeleteVaultRequest) => {
    const vault = await vaultRepository.findTopByPublicId(id);
    if (!data.password) {
      throw new CustomException();
    }
    const reqPassword = await hashPassword(data.password, this.parseVaultConfigs(vault.configs!)?.hash!);
    if (vault.masterPassword !== reqPassword) {
      throw new CustomException();
    }
    await vaultRepository.deleteById(vault.id);
  };
}

export const vaultService = new VaultService();
