import { DEFAULT_LINK_ID_SIZE, DEFAULT_NOTE_ID_SIZE } from "@/server/features/vault/vault.constant";
import { vaultRepository } from "@/server/features/vault/vault.repository";
import { CreateLinkRequest, CreateNoteRequest, DeleteVaultRequest } from "@/server/features/vault/vault.type";
import { handleVaultPublicIdCollision } from "@/server/features/vault/vault.util";
import { CustomException } from "@/shared/exceptions/custom-exception";
import { generateId } from "@/shared/utils/crypto";

class VaultService {
  public createLink = async (data: CreateLinkRequest) => {
    const publicId = await handleVaultPublicIdCollision(() => generateId(DEFAULT_LINK_ID_SIZE));
    await vaultRepository.create({ content: data.content, publicId });
    return { publicId };
  };

  public createNote = async (data: CreateNoteRequest) => {
    const publicId = await handleVaultPublicIdCollision(() => generateId(DEFAULT_NOTE_ID_SIZE));
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
    return vault;
  };

  public getTopByPublicIdInternal = async (id: string) => {
    const vault = await vaultRepository.getTopByPublicIdInternal(id);
    if (!vault) {
      throw new CustomException();
    }
    return vault;
  };

  public deleteVaultByPublicId = async (id: string, data: DeleteVaultRequest) => {
    const vault = await vaultRepository.getTopByPublicIdInternal(id);
    if (vault.password !== data.password) {
      throw new CustomException();
    }
    await vaultRepository.deleteById(vault.id);
  };
}

export const vaultService = new VaultService();
