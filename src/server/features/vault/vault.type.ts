import { VaultTable } from "@/server/entities/vault.entity";

export type Note = typeof VaultTable.$inferSelect;

export type CreateLinkRequest = {
  content: string;
};

export type CreateNoteRequest = {
  content: string;
  password?: string;
  passwordConfig?: string;
};

export type DeleteVaultRequest = {
  password: string;
};
