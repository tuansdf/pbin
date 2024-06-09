import AES from "crypto-js/aes";
import utf8enc from "crypto-js/enc-utf8";
import { customAlphabet } from "nanoid";

export const encryptText = async (content: string, password: string): Promise<string | undefined> => {
  try {
    return AES.encrypt(content, password).toString();
  } catch (e) {}
};

export const decryptText = async (content: string, password: string): Promise<string | undefined> => {
  try {
    const bytes = AES.decrypt(content, password);
    return bytes.toString(utf8enc);
  } catch (e) {}
};

const DEFAULT_ID_SIZE = 21;
const idAlphabet = "123456789abcdefghjkmnpqrstuvwxyz";
const idNano = customAlphabet(idAlphabet, DEFAULT_ID_SIZE);
export const generateId = (size: number = DEFAULT_ID_SIZE) => {
  return idNano(size);
};

const DEFAULT_PASSWORD_SIZE = 32;
const passwordAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
const passwordNano = customAlphabet(passwordAlphabet, DEFAULT_PASSWORD_SIZE);
export const generatePassword = (size = DEFAULT_PASSWORD_SIZE) => {
  return passwordNano(size);
};
