import { VaultTable } from "@/server/entities/vault.entity";

export type Vault = typeof VaultTable.$inferSelect;
export type VaultCreate = typeof VaultTable.$inferInsert;

export type CreateLinkFormValues = {
  content: string;
  password: string;
};

export type CreateNoteFormValues = {
  content: string;
  password?: string;
};

export type CreateLinkRequest = {
  content: string;
  configs: VaultConfigs;
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
  password: PasswordConfigs;
};

export type PasswordConfigs = {
  keySize: number;
  iterations: number;
  salt: string;
};

export type CreateNoteRequest = {
  content: string;
  password?: string;
  configs: VaultConfigs;
};

export type DeleteVaultRequest = {
  password: string;
};
