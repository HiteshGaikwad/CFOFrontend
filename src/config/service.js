import { AES, enc } from "crypto-js";
import { BASE_URL } from "./url";

export function isUserAuthenticated() {
  let token = getToken();
  if (token !== "") {
    return true;
  } else {
    return false;
  }
}
export const secret_key = process.env.REACT_APP_SECRET_KEY;

export function getToken() {
  let token = "";

  if (
    sessionStorage.getItem("dXNlckRhdGE=") ||
    localStorage.getItem("dXNlckRhdGE=")
  ) {
    if (!sessionStorage.getItem("dXNlckRhdGE=")) {
      const encryptedUserData = JSON.parse(
        localStorage.getItem("dXNlckRhdGE=")
      );
      const decryptedUserData = decryptData(encryptedUserData, secret_key);
      token = decryptedUserData.Token;
    } else {
      const encryptedUserData = JSON.parse(
        sessionStorage.getItem("dXNlckRhdGE=")
      );
      const decryptedUserData = decryptData(encryptedUserData, secret_key);
      // const userData= JSON.parse(sessionStorage.getItem('userData'))
      token = decryptedUserData.Token;
    }
  }
  return token;
}

export function getUserDataFromStorage() {
  let userData = {};
  if (
    sessionStorage.getItem("dXNlckRhdGE=") ||
    localStorage.getItem("dXNlckRhdGE=")
  ) {
    let encryptedUserData = null;
    if (!sessionStorage.getItem("dXNlckRhdGE=")) {
      encryptedUserData = JSON.parse(localStorage.getItem("dXNlckRhdGE="));
    } else {
      encryptedUserData = JSON.parse(sessionStorage.getItem("dXNlckRhdGE="));
    }
    userData = decryptData(encryptedUserData, secret_key);
  }
  return userData;
}

export function encryptData(data, secret_key) {
  return AES.encrypt(JSON.stringify(data), secret_key).toString();
}

export function decryptData(encryptedData, secretKey) {
  const bytes = AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(enc.Utf8));
}

export function removeDataFromStorage() {
  if (
    sessionStorage.getItem("dXNlckRhdGE=") ||
    localStorage.getItem("dXNlckRhdGE=")
  ) {
    if (!sessionStorage.getItem("dXNlckRhdGE=")) {
      localStorage.removeItem("dXNlckRhdGE=");
      // localStorage.removeItem("dXNlckRhdGE=");
    } else {
      sessionStorage.removeItem("dXNlckRhdGE=");
      sessionStorage.removeItem("bWVudUxpc3Q=");
    }
  }
}

export const getClientIP = async () => {
  try {
    const res = await fetch("https://api.ipify.org/?format=json");
    const result = await res.json();
    return result?.ip;
  } catch (error) {}
};