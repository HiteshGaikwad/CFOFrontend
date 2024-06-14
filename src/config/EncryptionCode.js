import CryptoJS from "crypto-js";

const key = "8080808080808080";
const iv = "8080808080808080";

export const EncryptionCode = (value) => {
  const keyParsed = CryptoJS.enc.Utf8.parse(key);
  const ivParsed = CryptoJS.enc.Utf8.parse(iv);
  const response = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(value),
    keyParsed,
    {
      keySize: 128 / 8,
      iv: ivParsed,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  return response;
};