import AES from "crypto-js/aes";
import utf8enc from "crypto-js/enc-utf8";

export const encryptText = async (content: string, password: string) => {
  return AES.encrypt(content, password).toString();
};

export const decryptText = async (content: string, password: string) => {
  const bytes = AES.decrypt(content, password);
  return bytes.toString(utf8enc);
};
