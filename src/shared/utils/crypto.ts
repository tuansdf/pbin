import { DEFAULT_NOTE_ID_SIZE, DEFAULT_PASSWORD_SIZE } from "@/server/features/vault/vault.constant";
import { HashConfigs } from "@/server/features/vault/vault.type";
import CryptoJS from "crypto-js";
import { customAlphabet } from "nanoid";

export const encryptText = async (content: string, password: string): Promise<string> => {
  try {
    return CryptoJS.AES.encrypt(content, password).toString();
  } catch (e) {
    return "";
  }
};

export const decryptText = async (content: string, password: string): Promise<string> => {
  try {
    const bytes = CryptoJS.AES.decrypt(content, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return "";
  }
};

const idAlphabet = "123456789abcdefghjkmnpqrstuvwxyz";
const idNano = customAlphabet(idAlphabet, DEFAULT_NOTE_ID_SIZE);
export const generateId = (size: number = DEFAULT_NOTE_ID_SIZE) => {
  return idNano(size);
};

const passwordAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const passwordNano = customAlphabet(passwordAlphabet, DEFAULT_PASSWORD_SIZE);
export const generatePassword = (size: number = DEFAULT_PASSWORD_SIZE) => {
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

const DEFAULT_KEY_SIZE = 128 / 8;
const DEFAULT_SALT_SIZE = 256 / 32;
const DEFAULT_ITERATIONS = 100_000;
const DEFAULT_HASHER = "SHA256";
export const generateHashConfigs = (): HashConfigs => {
  let keySize = DEFAULT_KEY_SIZE;
  let iterations = DEFAULT_ITERATIONS;
  let saltSize = DEFAULT_SALT_SIZE;
  let hasher = DEFAULT_HASHER;
  let salt = CryptoJS.enc.Base64url.stringify(CryptoJS.lib.WordArray.random(saltSize));
  return { keySize, iterations, salt, hasher };
};

export const hashPassword = async (password: string, configs: HashConfigs): Promise<string> => {
  try {
    await new Promise((r) => setTimeout(r, 1000));

    let hasher = CryptoJS.algo.SHA256;
    switch (configs.hasher) {
      case "SHA1":
        hasher = CryptoJS.algo.SHA1;
        break;
      case "SHA256":
        hasher = CryptoJS.algo.SHA256;
        break;
      case "SHA512":
        hasher = CryptoJS.algo.SHA512;
        break;
    }
    const hashed: CryptoJS.lib.WordArray = CryptoJS.PBKDF2(password, configs.salt!, {
      keySize: configs.keySize,
      iterations: configs.iterations,
      hasher,
    });

    return CryptoJS.enc.Base64url.stringify(hashed);
  } catch (e) {
    return password;
  }
};
