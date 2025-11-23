import { UserKeypair } from "@/types/keypair";
import api from "./api";

export const generateKeypair = async (): Promise<UserKeypair> => {
  const response = await api.get<UserKeypair>("/keypair/generate");
  return response.data;
};