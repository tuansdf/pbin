import { DEFAULT_SALT } from "@/server/features/vault/vault.constant";
import { PasswordConfigs, PasswordConfigsInput } from "@/server/features/vault/vault.type";
import CryptoJS from "crypto-js";
import { customAlphabet } from "nanoid";

export const encryptText = async (content: string, password: string): Promise<string | undefined> => {
  try {
    return CryptoJS.AES.encrypt(content, password).toString();
  } catch (e) {}
};

export const decryptText = async (content: string, password: string): Promise<string | undefined> => {
  try {
    const bytes = CryptoJS.AES.decrypt(content, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {}
};

export const decryptTextWithPassword = async (
  content: string,
  password: string,
): Promise<{ error: false; password: string; content: string } | { error: true }> => {
  try {
    const bytes = CryptoJS.AES.decrypt(content, password);
    return { error: false, content: bytes.toString(CryptoJS.enc.Utf8), password };
  } catch (e) {
    return { error: true };
  }
};

const DEFAULT_ID_SIZE = 24;
const idAlphabet = "123456789abcdefghjkmnpqrstuvwxyz";
const idNano = customAlphabet(idAlphabet, DEFAULT_ID_SIZE);
export const generateId = (size: number = DEFAULT_ID_SIZE) => {
  return idNano(size);
};

const DEFAULT_PASSWORD_SIZE = 48;
const passwordAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const passwordNano = customAlphabet(passwordAlphabet, DEFAULT_PASSWORD_SIZE);
export const generatePassword = (size = DEFAULT_PASSWORD_SIZE) => {
  return passwordNano(size);
};

export const generateRandomAndHandleCollision = async ({
  randomFn,
  checkCollisionFn,
  maxRetries = 100,
}: {
  randomFn: () => string;
  checkCollisionFn: (text: string) => Promise<boolean>; // true: collision, false: no collision
  maxRetries?: number;
}) => {
  let retryCount = 0;
  let random = "";
  while (!random) {
    if (retryCount > maxRetries) {
      throw new Error("Cannot generate ID");
    }
    let temp = "";
    try {
      temp = randomFn();
      const isCollision = await checkCollisionFn(temp);
      if (!isCollision) {
        random = temp;
      } else {
        console.error("Collision: " + temp);
      }
    } catch (e) {
      console.error("Collision: " + temp);
    }
    retryCount++;
  }
  return random;
};

export const generatePasswordConfigs = (config?: PasswordConfigsInput): PasswordConfigs => {
  let keySize = Number(config?.keySize) || 128 / 8;
  let saltSize = 256 / 32;
  let iterations = Number(config?.iterations) || 600_000;
  let salt = config?.salt || CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(saltSize));
  return { keySize, iterations, salt };
};

const executeHashPassword = async (
  password: string,
  configs?: PasswordConfigsInput,
): Promise<{ configs: PasswordConfigs; error: false; hash: string } | { error: true }> => {
  try {
    await new Promise((r) => setTimeout(r, 1000));
    const { keySize, iterations, salt } = generatePasswordConfigs(configs);

    const hashed: CryptoJS.lib.WordArray = await new Promise((r) =>
      r(
        CryptoJS.PBKDF2(password, salt, {
          keySize: keySize,
          iterations: iterations,
          hasher: CryptoJS.algo.SHA256,
        }),
      ),
    );

    // Convert salt and hash to strings for transmission
    const hashString = CryptoJS.enc.Hex.stringify(hashed);

    return {
      error: false,
      hash: hashString,
      configs: { keySize, iterations, salt },
    };
  } catch (e) {
    return {
      error: true,
    };
  }
};

export const hashPassword = async (password: string, configs?: PasswordConfigs): Promise<string> => {
  const result = await executeHashPassword(password, configs);
  if (result.error) {
    return password;
  }
  return result.hash;
};

export const hashPasswordNoSalt = async (password: string, configs?: PasswordConfigsInput) => {
  if (!configs) configs = {};
  configs.salt = DEFAULT_SALT;
  const result = await executeHashPassword(password, configs);
  if (result.error) {
    return password;
  }
  return result.hash;
};
