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

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 21);
export const generateId = (size: number = 21) => {
  return nanoid(size);
};
