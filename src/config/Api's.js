import { EncryptionCode } from "./EncryptionCode";
import { getToken, isUserAuthenticated } from "./service";
import { BASE_URL } from "./url";

let token;
if (isUserAuthenticated()) {
  token = getToken();
}

//API call
export async function RestfullApiService(data, endPoint) {
  const respose = await fetch(BASE_URL + `${endPoint}`, {
    method: "POST",
    body: EncryptionCode(JSON.stringify(data)),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await respose.json();
  return result;
}

export async function saveUserHistory(data, endPoint) {
  try {
    const result = await RestfullApiService(data, endPoint);
  } catch (error) {
  }
}
// parameters to saveuserHistory API
// const val={
//   EmployeeCode: userData?.EmpID,
//   Activity: "Record Inserted in RPT Company Master - A/C Code: " + newRPTCompanyMaster?.Account_Code?.toUpperCase() + " By " + userData?.FullName,
//   PageUrl: window.location.pathname,
//   TableName: "RPT Company Master",
//   ActionFor: newRPTCompanyMaster?.Account_Code?.toUpperCase(),
//   ipaddress: ip
// }