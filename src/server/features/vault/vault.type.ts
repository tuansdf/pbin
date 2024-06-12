import { VaultTable } from "@/server/entities/vault.entity";

export type Vault = typeof VaultTable.$inferSelect;
export type VaultCreate = typeof VaultTable.$inferInsert;

export type CreateLinkRequest = {
  content: string;
};

export type CreateLinkResponse = {
  publicId?: string;
};

export type CreateNoteResponse = {
  publicId?: string;
};

export type GetVaultConfigsResponse = {
  configs: VaultConfigs;
};

export type VaultConfigs = {
  password: {
    keySize: number;
    iterations: number;
    salt: string;
  };
};

export type CreateNoteRequest = {
  content: string;
  password?: string;
  configs?: VaultConfigs;
};

export type DeleteVaultRequest = {
  password: string;
};
