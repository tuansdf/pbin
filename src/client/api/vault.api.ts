import { mainApiInstance } from "@/client/api/main-api-instance";
import {
  CreateLinkRequest,
  CreateLinkResponse,
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteVaultRequest,
  GetVaultConfigsResponse,
} from "@/server/features/vault/vault.type";
import axios from "axios";

export const createLink = async (data: CreateLinkRequest) => {
  const response = await mainApiInstance.post<CreateLinkResponse>("/api/links", data);
  return response.data;
};

export const createNote = async (data: CreateNoteRequest) => {
  const response = await mainApiInstance.post<CreateNoteResponse>("/api/notes", data);
  return response.data;
};

export const deleteVault = async (id: string, data: DeleteVaultRequest) => {
  const res = await mainApiInstance.post<null>(`/api/vaults/${id}/delete`, data);
  return res.data;
};

export const getVaultConfigs = async (id: string) => {
  const res = await axios.get<GetVaultConfigsResponse>(`/api/vaults/${id}/configs`);
  return res.data;
};
