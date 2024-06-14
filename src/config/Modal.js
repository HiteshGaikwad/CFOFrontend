import React, { useEffect } from "react";
import { useModal } from "./modalContext";
import { useState } from "react";
import { BASE_URL } from "./url";
import { getUserDataFromStorage } from "./service";
import { toast } from "react-toastify";
import { RestfullApiService } from "./Api's";

const Modal = () => {
  const { isModalOpen, closeModal } = useModal();
  const [currentPaasword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});

  const userData = getUserDataFromStorage();

  const handleSubmit = async () => {
    try {
      let err = {};
      if (currentPaasword === "") {
        err = { ...err, currentPaasword: "Current password is required." };
      }
      if (newPassword === "") {
        err = { ...err, newPassword: "New password is required." };
      }
      if (confirmPassword === "") {
        err = { ...err, confirmPaasword: "Confirm password is required." };
      } else if (confirmPassword !== newPassword) {
        err = {
          ...err,
          confirmPaasword: "New password and confirm password does not match.",
        };
      }
      setError(err);
      const data = {
        Method_Name: "ChangePassword",
        User_Id: userData?.UserId,
        Existing_User_Password: currentPaasword,
        New_User_Password: newPassword,
      };
      if (Object.keys(err).length === 0) {
        const result = await RestfullApiService(data, "user/ChangePassword");
        let notify;
        if (result.Result.Table1[0].Result_Id === 1) {
          notify = () => toast.success("Password changed successfully.");

          closeModal();
        } else {
          notify = () => toast.error("User not found.");
        }
        notify();
      }
    } catch (error) { }
  };

  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[^\s\d][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "current") {
        setCurrentPassword(e.target.value);
        setError({ ...error, currentPaasword: "" });
      } else if (type === "newPassword") {
        setNewPassword(e.target.value);
        setError({ ...error, newPassword: "" });
      } else if (type === "confirmPassword") {
        setConfirmPassword(e.target.value);
        setError({ ...error, confirmPassword: "" });
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains("modal")) {
      }
    };

    // Add event listener when the modal component mounts
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the modal component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen]);
  return (
    <>
      <div
        className="modal fade example-modal-centered-transparent show"
        id="modal"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", paddingRight: "17px" }}
        aria-modal="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-transparent"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-white">
                Change Password
                {/* <small className="m-0 text-white opacity-70">
                Below is a static modal example
              </small> */}
              </h4>

              <button
                type="button"
                className="close text-white"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => closeModal()}
              >
                <span aria-hidden="true">
                  <i className="fa fa-times"></i>
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="col">
                <div
                  className="col-lg-12 col-md-12 form-group mb-0 "
                  style={{ height: "80px" }}
                >
                  <label
                    className="form-label fs-md"
                    htmlFor="ddlAddSecurityType"
                    style={{ color: "white" }}
                  >
                    Current password
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="txtAddSecurityName"
                    placeholder="Current password"
                    value={currentPaasword}
                    autoComplete="off"
                    onChange={(e) => {
                      handleTextField(e, "current");
                      setCurrentPassword(e.target.value);
                      setError({ ...error, currentPaasword: "" });
                    }}
                    maxLength="50"
                  />
                  <span className="error-validation">
                    {error.currentPaasword}
                  </span>
                </div>
                <div
                  className="col-lg-12 col-md-12  form-group mb-0 mt-4"
                  style={{ height: "80px" }}
                >
                  <label
                    className="form-label fs-md"
                    htmlFor="ddlAddSecurityType"
                    style={{ color: "white" }}
                  >
                    New password
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="txtAddSecurityName"
                    placeholder="New password"
                    value={newPassword}
                    autoComplete="off"
                    onChange={(e) => {
                      handleTextField(e, "newPassword");
                      setNewPassword(e.target.value);
                      setError({ ...error, newPassword: "" });
                    }}
                    maxLength="50"
                  />
                  <span className="error-validation">{error.newPassword}</span>
                </div>
                <div
                  className="col-lg-12 col-md-12  form-group mb-0 mt-4"
                  style={{ height: "60px" }}
                >
                  <label
                    className="form-label fs-md"
                    htmlFor="ddlAddSecurityType"
                    style={{ color: "white" }}
                  >
                    Confirm password
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="txtAddSecurityName"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    autoComplete="off"
                    onChange={(e) => {
                      handleTextField(e, "confirmPassword");
                      setConfirmPassword(e.target.value);
                      setError({ ...error, confirmPaasword: "" });
                    }}
                    maxLength="50"
                  />
                  <span className="error-validation">
                    {error.confirmPaasword}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary waves-effect waves-themed"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
