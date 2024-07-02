import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { encryptData, secret_key } from "../config/service";
import { BASE_URL, urlPath } from "../config/url";
import { EncryptionCode } from "../config/EncryptionCode";
import { RestfullApiService } from "../config/Api's";
let notify;

const OtpVerificationPage = ({ setIsLogedIn, checked, userDataAtLogedIn, empCode }) => {
  let numberOfDigits = 6;
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  // const [isResendClicked, setIsResendClicked]= useState(false);

  const otpBoxReference = useRef([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handlePaste(e, index) {
    e.preventDefault();

    const pastedOtp = e.clipboardData.getData("text").trim();

    if (/^\d+$/.test(pastedOtp)) {
      if (pastedOtp.length === numberOfDigits) {
        const otpDigits = pastedOtp.split("");

        setOtp(otpDigits);

        if (index < numberOfDigits - 1) {
          otpBoxReference.current[index + 1].focus();
        }
      } else {

      }
    } else {

    }
  }

  function handleChange(value, index) {
    if (value.length <= 1 && !isNaN(value) && value !== "e") {
      let newArr = [...otp];
      newArr[index] = value;
      setOtp(newArr);

      if (value && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1].focus();
      }
    } else if (value.length > 1) {
      let newDigit = value.charAt(value.length - 1);
      let newArr = [...otp];
      newArr[index] = newDigit;
      setOtp(newArr);

      if (newDigit && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1].focus();
      }
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index].value = "";
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  const isOtpValid = useMemo(() => {
    const otps = otp.filter((cur) => cur !== "");
    if (otps.length === 6) return true;
    return false;
  }, [otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoginVisible(true)

    try {
      const userData = {
        EmpCode: empCode,
        OTP: otp.join(""),
      };
      const result = await RestfullApiService(userData, "user/VerifyOTP");
      if (result?.Token !== null) {
        const userData = {
          ADUsername: result?.Result?.Table1[0]?.ADUsername,
          EmailAddress: result?.Result?.Table1[0]?.EmailAddress,
          EmpCode: result?.Result?.Table1[0]?.EmpCode,
          EmpID: result?.Result?.Table1[0]?.EmpID,
          ImageURL: result?.Result?.Table1[0]?.ImageURL,
          MobileNumber: result?.Result?.Table1[0]?.MobileNumber,
          PROFILE_ID: result?.Result?.Table1[0]?.PROFILE_ID,
          PROFILE_NM: result?.Result?.Table1[0]?.PROFILE_NM,
          Role: result?.Result?.Table1[0]?.Role,
          ShortName: result?.Result?.Table1[0]?.ShortName,
          FullName: result?.Result?.Table1[0]?.FullName
        };

        // storing menu list in session storage
        const menuList = result?.MenuList?.Table1;
        const encryptedMenuList = encryptData(menuList, secret_key);
        const encryptTitleMenuList = window.btoa("menuList");
        sessionStorage.setItem(
          encryptTitleMenuList,
          JSON.stringify(encryptedMenuList)
        );

        const encryptedData = encryptData(userData, secret_key);
        const encryptTitleUserData = window.btoa("userData");
        if (checked) {
          localStorage.setItem(
            encryptTitleUserData,
            JSON.stringify(encryptedData)
          );
        } else {
          sessionStorage.setItem(
            encryptTitleUserData,
            JSON.stringify(encryptedData)
          );
        }
        navigate(`${urlPath}Home`);
      } else {
      }

    } catch (error) {
      setOtp(new Array(numberOfDigits).fill(""));
      notify = () => toast.error("OTP Invalid. Request a new one.");
      notify();
    }
    setIsLoginVisible(false)
  };
  useEffect(() => {
    if (otpBoxReference.current.length > 0) {
      otpBoxReference.current[0].focus();
    }
  }, []);

  const [timer, setTimer] = useState(0);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    let interval;
    if (showTimer && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setShowTimer(false);
    }
    return () => clearInterval(interval);
  }, [showTimer, timer]);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [timer]);

  const handleResendClick = async (e) => {
    e.preventDefault();
    setOtp(new Array(numberOfDigits).fill(""));

    try {
      const userData = {
        EmpCode: empCode,
        Otp: 0
      };
      const result = await RestfullApiService(userData, "user/SendOTP");
      notify = () => toast.success("OTP has been resent successfully!");
      setTimer(120);
      setShowTimer(true);
      notify();
    }
    catch (error) { }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="card p-4 rounded-plus"
        style={{ backgroundColor: "rgb(253,175,23)", color: "white" }}
        id="otpdiv"
      >
        <div>
          <i
            className="fa fa-arrow-left"
            onClick={() => setIsLogedIn(false)}
          ></i>
        </div>
        <div id="edit" className="card-body p-3 text-center">
          <h4 style={{ fontWeight: "500" }}>Authenticate Yourself</h4>
          <p>OTP has been sent to your Email Id</p>
        </div>
        <div
          id="input libray"
          className=" md:gap-3 "
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "4px",
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "24px",
            letterSpacing: "-0.2",
          }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="number"
              value={digit}
              inputMode="numeric"
              maxLength={1}
              onPaste={(e) => handlePaste(e, index)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
              ref={(reference) => (otpBoxReference.current[index] = reference)}
              id="otp-input"
              className="placeholder:text-sm focus:outline-[#AFBACA] "
              style={{
                maxWidth: "58px",
                width: "100%",
                height: "53px",
                border: "1px solid rgb(253,175,23)",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "20px",
                letterSpacing: "-0.3",
                fontWeight: "500",
                lineHeight: "32px",
                color: "black",
              }}
            />
          ))}
        </div>

        <div
          id="didnt-recieved"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "12px",
          }}
        >
          <p
            style={{
              fontWeight: "400",
              fontSize: "14px",
              letterSpacing: "-0.3",
              lineHeight: "28px",
              color: "black",
            }}
          >
            Haven’t received email?
          </p>

          {timer ? (
            <p
              style={{
                fontWeight: "400",
                letterSpacing: "-0.3",
                fontSize: "14px",
              }}
              onClick={() => { }}
            >
              Resend in{" "}
              <span style={{ fontWeight: "700" }}>{formattedTimer}</span>
            </p>
          ) : (
            <p
              className="btn-link text-dark"
              onClick={(e) => {
                handleResendClick(e);
              }}
              style={{ cursor: "pointer" }}
            >
              Resend OTP
            </p>
          )}
        </div>
        {/* <button
          id="btnValidateOtp"
          type="button"
          className="btn btn-otp btn-primary text-white mb-3 waves-effect waves-themed"
          disabled={!isOtpValid}
          style={{ fontWeight: "600", fontSize: "14px" }}
          onClick={handleSubmit}
        >
          Verify
        </button> */}
        <button
          id="btnLogin"
          type="submit"
          className="btn btn-primary float-right text-white"
          disabled={isLoginVisible || !isOtpValid}
          onClick={handleSubmit}
        >
          <span
            id="loadersignin"
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            style={{ display: "none" }}
          ></span>
          {isLoginVisible ? (
            <i
              className="fa fa-spinner fa-spin"
              style={{ fontSize: "14px" }}
            ></i>
          ) : (
            <span id="labelsignin">Verify</span>
          )}
        </button>
      </form>
      <div id="spacing" className="h-16"></div>
    </>
  );
};

export default OtpVerificationPage;
