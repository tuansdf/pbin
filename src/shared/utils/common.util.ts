import { createHash } from "@/shared/utils/crypto";

const base64urlAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export const generateFakeContent = (base: string): string => {
  let result = createHash(base);
  // plus 2 in case not found, divide by 6 to reduce the number of rounds
  const rounds = Math.ceil((base64urlAlphabet.indexOf(result[0]) + 2) / 6);
  for (let i = 0; i < rounds; i++) {
    result += createHash(result.substring(0, 10)); // shorten the hash input
  }
  return result;
};
