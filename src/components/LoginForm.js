import React, { useState } from "react";
import backGround from "../assets/images/pattern-1.svg";
import loginLogo from "../assets/images/user_assets/logo_full.png";
import navLogo from "../assets/images/user_assets/logo.png";
import { BASE_URL } from "../config/url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpVerificationPage from "./OtpVerificationPage";
import { EncryptionCode } from "../config/EncryptionCode";
import { RestfullApiService } from "../config/Api's";
// import { useDispatch } from 'react-redux';
// import { addMenuList } from '../redux/MenuListSlice';

const LoginForm = () => {
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [userDataAtLogedIn, setUserDataAtLogedIn] = useState({});
  const [empCode, setEmpCode] = useState('');
  let notify;
  // const dispatch= useDispatch();

  const [err, setErr] = useState({
    username: "",
    password: "",
  });

  const pageStyle = {
    // backgroundImage: `url("BondUI"+${backGround})`,
    backgroundImage: `url(${backGround})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    backgroundAttachment: "fixed",
    height: "auto",
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // setIsLogedIn(true);
    const form = e.target;
    const formData = new FormData(form);
    let formObj = Object.fromEntries(formData.entries());
    // formObj = { ...formObj, Method_Name: "ValidateUser" };
    let errorObj = {
      username: "",
      password: "",
    };
    if (formObj.EmployeeCode === "" || formObj.EmployeeCode === " ") {
      errorObj = { ...errorObj, username: "User Name is required" };
    }
    if (formObj.Password === "" || formObj.Password === " ") {
      errorObj = { ...errorObj, password: "Password is required" };
    }
    setErr(errorObj);

    if (errorObj.username === "" && errorObj.password === "") {
      authenticateUser(formObj);
    }
  };

  //  function to authenticate user from db
  async function authenticateUser(formObj) {
    try {
      setIsLoginVisible(true)
      const response = await fetch(BASE_URL + "user/Userlogin", {
        method: "POST",
        body: EncryptionCode(JSON.stringify(formObj)),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.Status === 0) {
        setUserDataAtLogedIn(result?.Description);
        setIsLogedIn(true);
        const data = {
          EmpCode: empCode,
          Otp: 0
        }
        const res = await RestfullApiService(data, "user/SendOTP")
      } else {
        notify = () => toast.error(result?.Message);
        // setEmpCode('')
        notify();
      }
      if (result?.status === 400) {
        notify = () => toast.error('Something went wrong.');
        setEmpCode('')
        notify();
      }

    } catch (error) {
    }
    setIsLoginVisible(false)
  }

  return (
    <>
      <div className="mod-bg-1 nav-function-minify" >
        <div className="page-wrapper auth">
          <div className="page-inner">
            <div className="page-content-wrapper bg-transparent m-0">
              <div className="height-4 w-100 shadow-lg px-4 bg-primary">
                <div className="d-flex align-items-center container p-0">
                  <div className="page-logo width-mobile-auto m-0 align-items-center justify-content-center p-0 bg-transparent bg-img-none shadow-0 height-9 border-0">
                    <img
                      // src={"/BondUI" + navLogo}
                      src={navLogo}
                      alt="Motilal Oswal Logo"
                      aria-roledescription="logo"
                    />
                    <span className="page-logo-text mr-1">
                      CFO Portal
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1" style={pageStyle}>
                <div className="container py-5 py-lg-5 my-lg-5 px-4 px-sm-0">
                  <div className="row">
                    <div className="col-xl-4 col-lg-5 col-md-6 col-sm-12 ml-auto mr-auto">
                      {isLogedIn ? (
                        <OtpVerificationPage
                          empCode={empCode}
                          setIsLogedIn={setIsLogedIn}
                          checked={
                            document.getElementById("chkRememberMe")?.checked
                          }
                          userDataAtLogedIn={userDataAtLogedIn}
                        />
                      ) : (
                        <form
                          onSubmit={(e) => {
                            handleSubmitForm(e);
                          }}
                          className="card p-4 rounded-plus"
                          style={{ backgroundColor: "#fdaf17" }}
                        >
                          <img
                            // src={"/BondUI" + loginLogo}
                            src={loginLogo}
                            className="mb-5 px-5"
                            alt="Motilal Oswal Logo"
                            aria-roledescription="logo"
                          />
                          <div
                            className="form-group"
                            style={{ height: "70px" }}
                          >
                            <label className="form-label" htmlFor="txtUserName">
                              Login Id
                            </label>
                            <input
                              type="text"
                              id="txtUserName"
                              className="form-control"
                              placeholder="Enter your user name"
                              value={empCode}
                              name="EmployeeCode"
                              autoComplete="off"
                              onChange={(e) => { setErr({ ...err, username: "" }); setEmpCode(e.target.value) }}
                            />
                            {err.username && (
                              <p
                                style={{
                                  color: "red",
                                  fontWeight: "400",
                                  marginTop: "2px",
                                  fontSize: "12px",
                                }}
                              >
                                {err.username}
                              </p>
                            )}
                          </div>
                          <div
                            className="form-group"
                            style={{ height: "70px" }}
                          >
                            <label className="form-label" htmlFor="txtPassword">
                              Password
                            </label>
                            <input
                              type="password"
                              id="txtPassword"
                              className="form-control"
                              placeholder="Enter your password"
                              name="Password"
                              autoComplete="off"
                              onChange={() => setErr({ ...err, password: "" })}
                            />
                            {err.password && (
                              <p
                                style={{
                                  color: "red",
                                  fontWeight: "400",
                                  marginTop: "2px",
                                  fontSize: "12px",
                                }}
                              >
                                {err.password}
                              </p>
                            )}
                          </div>
                          <div className="form-group text-left">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="chkRememberMe"
                                name="checked"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="chkRememberMe"
                              >
                                {" "}
                                Remember me{" "}
                              </label>
                            </div>
                          </div>
                          <button
                            id="btnLogin"
                            type="submit"
                            className="btn btn-primary float-right text-white"
                            disabled={isLoginVisible}
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
                              <span id="labelsignin">Login</span>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
