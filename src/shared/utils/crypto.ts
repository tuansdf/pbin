import { DEFAULT_NOTE_ID_SIZE, DEFAULT_PASSWORD_SIZE, ID_ALPHABET } from "@/server/features/vault/vault.constant";
import { HashConfigs } from "@/server/features/vault/vault.type";
import { customAlphabet } from "nanoid";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { bytesToHex, bytesToUtf8, hexToBytes, utf8ToBytes } from "@noble/ciphers/utils";
import { randomBytes } from "@noble/ciphers/webcrypto";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha2";
import { ENV } from "@/shared/constants/env.constant";

const DEFAULT_NONCE_LENGTH = 24;
const FAKE_NONCE_LENGTH = DEFAULT_NONCE_LENGTH * 2;

export const encryptText = async (contentStr: string, passwordHex: string, nonceHex: string): Promise<string> => {
  try {
    const nonce = hexToBytes(nonceHex);
    const password = hexToBytes(passwordHex);
    const cipher = xchacha20poly1305(password, nonce);
    const content = utf8ToBytes(contentStr);
    const encrypted = cipher.encrypt(content);
    return bytesToHex(encrypted);
  } catch (e) {
    return "";
  }
};

export const decryptText = async (contentHex: string, passwordHex: string, nonceHex: string): Promise<string> => {
  try {
    const content = hexToBytes(contentHex);
    const password = hexToBytes(passwordHex);
    const nonce = hexToBytes(nonceHex);
    const cipher = xchacha20poly1305(password, nonce);
    const decrypted = cipher.decrypt(content);
    return bytesToUtf8(decrypted);
  } catch (e) {
    return "";
  }
};

export const generateEncryptionConfigs = () => {
  return {
    nonce: bytesToHex(randomBytes(DEFAULT_NONCE_LENGTH)),
  };
};
export const generateFakeEncryptionConfigs = async (base: string) => {
  base = await createBase(base + "encryption");
  return {
    nonce: (await createHash(base)).substring(0, FAKE_NONCE_LENGTH),
  };
};

const idNano = customAlphabet(ID_ALPHABET, DEFAULT_NOTE_ID_SIZE);
export const generateId = (size: number = DEFAULT_NOTE_ID_SIZE) => {
  return idNano(size);
};

export const generatePassword = (size: number = DEFAULT_PASSWORD_SIZE) => {
  return bytesToHex(randomBytes(size));
};

const DEFAULT_KEY_SIZE = 32;
const DEFAULT_SALT_SIZE = 24;
const DEFAULT_ITERATIONS = 1_000;
const DEFAULT_HASHER = "SHA-256";
const FAKE_SALT_LENGTH = DEFAULT_SALT_SIZE * 2;
export const generateHashConfigs = (): HashConfigs => {
  let iterations = DEFAULT_ITERATIONS;
  let keySize = DEFAULT_KEY_SIZE;
  let saltSize = DEFAULT_SALT_SIZE;
  let hasher = DEFAULT_HASHER;
  let salt = bytesToHex(randomBytes(saltSize));
  return { keySize, iterations, salt, hasher };
};
export const generateFakeHashConfigs = async (base: string): Promise<HashConfigs> => {
  base = await createBase(base + "hash");
  let keySize = DEFAULT_KEY_SIZE;
  let iterations = DEFAULT_ITERATIONS;
  let hasher = DEFAULT_HASHER;
  let salt = (await createHash(base)).substring(0, FAKE_SALT_LENGTH);
  return { keySize, iterations, salt, hasher };
};

export const hashPassword = async (passwordStr: string, configs: HashConfigs): Promise<string> => {
  try {
    await new Promise((r) => setTimeout(r, 1000));

    console.time("HPERF");
    const hashed = await pbkdf2Async(sha256, utf8ToBytes(passwordStr), hexToBytes(String(configs.salt)), {
      c: Number(configs.iterations),
      dkLen: Number(configs.keySize),
    });
    console.timeEnd("HPERF");

    return bytesToHex(hashed);
  } catch {
    return passwordStr;
  }
};

export const createHash = async (input: string): Promise<string> => {
  try {
    return bytesToHex(sha256(input));
  } catch {
    return "";
  }
};

const HEX_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MAX_ROUNDS = 20;
const MIN_ROUNDS = 4;
export const generateFakeContent = async (base: string): Promise<string> => {
  base = await createBase(base + "content");
  let result = await createHash(base);
  let rounds = HEX_ALPHABET.indexOf(result[0]);
  if (rounds < MIN_ROUNDS) rounds = MIN_ROUNDS;
  if (rounds > MAX_ROUNDS) rounds = MAX_ROUNDS;
  for (let i = 0; i < rounds; i++) {
    result += await createHash(result[i]); // select 1 character to shorten the hash input
  }
  return result;
};

const createBase = async (base: string) => {
  return createHash(base + ENV.SALT);
};
