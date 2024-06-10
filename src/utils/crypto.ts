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

const DEFAULT_ID_SIZE = 24;
const idAlphabet = "123456789abcdefghjkmnpqrstuvwxyz";
const idNano = customAlphabet(idAlphabet, DEFAULT_ID_SIZE);
export const generateId = (size: number = DEFAULT_ID_SIZE) => {
  return idNano(size);
};

const DEFAULT_PASSWORD_SIZE = 48;
const passwordAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
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

export const hashPassword = async (password: string) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const hashed = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 600000,
    hasher: CryptoJS.algo.SHA256,
  });

  // Convert salt and hash to strings for transmission
  const saltString = CryptoJS.enc.Hex.stringify(salt);
  const hashString = CryptoJS.enc.Hex.stringify(hashed);

  return { salt: saltString, hash: hashString };
};
