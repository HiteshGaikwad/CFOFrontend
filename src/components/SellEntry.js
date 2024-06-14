import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import SellEntryGrid from "./Grids/SellEntryGrid";

const SellEntry = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [entryType, setEntryType] = useState([]);
  const [coName, setCoName] = useState([]);
  const [typeOfInvestment, setTypeOfInvestment] = useState([]);
  const [typeOfTransaction, setTypeOfTransaction] = useState([]);

  const SellEntryData = {
    Type: "",
    Co_Name: "",
    Type_Of_Investment: "",
    Type_Of_Transaction: "",
    ISIN: "",
    Redemption_Date: "",
    Investment_Date: "",
    Fund_Received_Date: "",
    Units: "",
    Balance_Units: "",
    Weighted_Avg_Cost: "",
    Sell_Nav: "",
    Sold_Receipt: "",
    Valuation: "",
    Scheme_Name: "",
    Remark: "",
  };
  const [newSellEntry, setNewSellEntry] = useState(SellEntryData);

  const err = {
    Type: "",
    Co_Name: "",
    Type_Of_Investment: "",
    Type_Of_Transaction: "",
    ISIN: "",
    Redemption_Date: "",
    Investment_Date: "",
    Fund_Received_Date: "",
    Units: "",
    Balance_Units: "",
    Weighted_Avg_Cost: "",
    Sell_Nav: "",
    Sold_Receipt: "",
    Valuation: "",
    Scheme_Name: "",
    Remark: "",
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid orange" : provided.border,
      boxShadow: state.isFocused ? "0 0 0 1px orange" : provided.boxShadow,
      "&:hover": {
        borderColor: state.isFocused ? "orange" : provided.borderColor,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "orange" : provided.backgroundColor,
      color: state.isSelected ? "white" : provided.color,
      "&:hover": {
        backgroundColor: "orange",
        color: "white",
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "orange" : provided.color,
      "&:hover": {
        color: "orange",
      },
    }),
  };

  const handleDateChange = (date, method) => {
    // If a date is selected, generate the current time and combine it with the selected date

    let currentDate = "";
    currentDate +=
      date.slice(8, 10) + "-" + date.slice(5, 7) + "-" + date.slice(0, 4);
    if (method === "funds") {
      setNewSellEntry({
        ...newSellEntry,
        Fund_Received_Date: currentDate,
      });
      setError((prevErrors) => ({
        ...prevErrors,
        Fund_Received_Date: "",
      }));
    } else {
      setNewSellEntry({
        ...newSellEntry,
        Redemption_Date: currentDate,
        // Read_Date: currentDate,
      });
      setError((prevErrors) => ({
        ...prevErrors,
        Redemption_Date: "",
      }));
    }
  };

  // search user data
  async function handleSearchUser() {
    try {
      setError({});

      let data = {
        // Org_Id: userData?.OrgId,
        // Method_Name: "Get",
        // Login_User_Id: userData?.UserId,
        // User_Id: "",
        // User_Name: searchInput,
      };
      const result = await RestfullApiService(data, "master/GetUserMaster");
      setUserInfo(result.Result);
    } catch (error) {}
  }

  useEffect(() => {
    const inputFields = document.querySelectorAll("input, textarea");
    const initialValues = {};
    inputFields.forEach((input) => {
      initialValues[input.name] = input.value;
    });
    setInitialFieldValues(initialValues);
  }, []);

  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const refresh = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefreshed(refresh);
  };

  useEffect(() => {
    const inputFields = document.querySelectorAll("input, textarea");
    inputFields.forEach((input) => {
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      inputFields.forEach((input) => {
        input.removeEventListener("input", handleInputChange);
      });
    };
  }, [initialFieldValues]);

  //  useEffect to listen for changes in input fields
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isRefreshed) {
        // Prompt user with confirmation dialog
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave this page?";
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRefreshed]);

  // save user data
  async function handleSaveUser() {
    let notify = null;
    if (isEdit) {
      notify = () => toast.success("User updated successfully.");
    } else {
      notify = () => toast.success("User created successfully.");
    }
    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newSellEntry).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewSellEntry(trimmedUser);
      // Perform validation
      if (newSellEntry?.Type === "") {
        errors = { ...errors, Type: "Type is required." };
      }
      if (newSellEntry?.Co_Name === "") {
        errors = { ...errors, Co_Name: "Co. name is required." };
      }
      if (newSellEntry?.Type_Of_Investment === "") {
        errors = {
          ...errors,
          Type_Of_Investment: "Type Of investment is required.",
        };
      }
      if (newSellEntry?.Type_Of_Transaction === "") {
        errors = {
          ...errors,
          Type_Of_Transaction: "Type Of Transaction is required.",
        };
      }
      if (newSellEntry?.ISIN === "") {
        errors = { ...errors, ISIN: "ISIN is required." };
      }
      if (newSellEntry?.Units === "") {
        errors = { ...errors, Units: "Units is required." };
      }
      if (newSellEntry?.Scheme_Name === "") {
        errors = { ...errors, Scheme_Name: "Scheme name is required." };
      }

      setError(errors);

      // Check if there are no validation errors
      let flag = false;
      for (const key in errors) {
        if (errors[key] !== "") {
          flag = true;
          break;
        }
      }

      // If no validation errors, proceed to save
      if (!flag) {
        const result = await RestfullApiService(
          trimmedUser,
          "master/SaveUserMaster"
        );

        if (result.Status === 200) {
          notify();
        }

        // Reset newUser object
        setAddUser(!addUser);
        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          handleSearchUser();
        } else {
          searchInput && handleSearchUser();
        }
        handleSearchUser();
        setNewSellEntry(SellEntryData);
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
        notify();
      }
    } catch (error) {
      // Handle error
    }
  }

  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "userName") {
        setNewSellEntry({ ...newSellEntry, User_Display_Name: inputValue });
        setError({ ...error, User_Display_Name: "" });
      } else if (type === "loginId") {
        setNewSellEntry({ ...newSellEntry, User_Name: e.target.value });
        setError({ ...error, User_Name: "" });
      } else if (type === "designation") {
        setNewSellEntry({ ...newSellEntry, Designation: e.target.value });
        setError({ ...error, Designation: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  async function getDropDown(methodName, option1, option2) {
    try {
      let data = {
        // Org_Id: userData?.OrgId,
        // Method_Name: methodName,
        // Login_User_Id: userData?.UserId,
        // Option1: option1,
        // Option2: option2,
      };
      // API call
      const result = await RestfullApiService(data, "master/GetCommonDropdown");

      if (methodName === "Entry_Type") {
        setEntryType(result.Result);
      }

      if (methodName === "Co_Name") {
        setCoName(result.Result);
      }
      if (methodName === "Type_of_Investment") {
        setTypeOfInvestment(result.Result);
      }
      if (methodName === "Type_of_Transaction") {
        setTypeOfTransaction(result.Result);
      }
    } catch (error) {}
  }
  function handleBackButton() {
    let errors = err;
    setNewSellEntry(SellEntryData);
    setError(errors);
    setIsEdit(false);
  }

  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "mobile") {
        setNewSellEntry({ ...newSellEntry, Mobile: inputValue });
        setError({ ...error, Mobile: "" });
      } else {
        setNewSellEntry({ ...newSellEntry, Landline: inputValue });
        setError({ ...error, Landline: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  const handleDeleteUser = async (user) => {
    const notify = () => toast.success("User deleted successfully.");
    try {
      let data = {
        //   Org_Id: userData?.OrgId,
        //   Method_Name: "Delete",
        //   Login_User_Id: userData?.UserId,
        //   User_Id: user.User_Id,
        //   User_Name: "",
        //   UserType_Id: 0,
        //   User_Password: "",
        //   Employee_Id: "",
        //   User_Display_Name: "",
        //   Role_Id: "",
        //   Is_Employee: -1,
        //   Designation: "",
        //   Mobile: "",
        //   Landline: "",
        //   Email: "",
        //   Is_Active: 1,
      };
      // API call
      const result = await RestfullApiService(data, "master/SaveUserMaster");
      if (result.Status === 200) {
        notify();
      }
      handleSearchUser();
    } catch (error) {}
  };

  function handleEditUser(user) {
    // setNewUser({
    //   Org_Id: user.Org_Id,
    //   Method_Name: "Update",
    //   Login_User_Id: user.Login_User_Id,
    //   UserType_Id: user.UserType_Id,
    //   User_Name: user.Is_Employee === 1 ? "" : user.Login_User_Id,
    //   User_Id: parseInt(user.User_Id),
    //   User_Password: user.Is_Employee === 1 ? "" : user.User_Password,
    //   Employee_Id: user.Employee_Id,
    //   User_Display_Name: user.Is_Employee === 1 ? "" : user.User_Name,
    //   Role_Id: user.Role_Id,
    //   Is_Employee: user.Is_Employee,
    //   Designation: user.Designation,
    //   Mobile: user.Mobile,
    //   Landline: user.Landline,
    //   Email: user.Is_Employee === 1 ? "" : user.Email,
    //   Is_Active: user.Is_Active,
    // });
    setNewSellEntry({});
  }

  useEffect(() => {
    getDropDown("Entry_Type", "", "");
    getDropDown("Co_Name", "", "");
    getDropDown("Type_of_Investment", "", "");
    getDropDown("Type_of_Transaction", "", "");
  }, []);

  useEffect(() => {
    handleSearchUser();
  }, []);
  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addUser ? "Sell Entry" : "Create Sell Entry"} </h2>
          {!addUser ? (
            <div className="panel-toolbar">
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Add"
                onClick={() => {
                  setAddUser(!addUser);
                }}
              >
                <i className="fa fa-plus text-white"></i>
              </button>
            </div>
          ) : (
            <div className="panel-toolbar ml-2">
              <button
                type="button"
                className="btn btn-sm btn-primary text-white mr-2"
                onClick={() => {
                  handleSaveUser();
                  setIsEdit(false);
                }}
                id="btn_Save"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={() => {
                  if (
                    !isRefreshed ||
                    window.confirm(
                      "You have unsaved changes. Are you sure you want to leave this page?"
                    )
                  ) {
                    setAddUser(!addUser);
                    handleBackButton();
                    setIsEdit(false);
                    setIsRefreshed(false);
                  }
                }}
              >
                Back
              </button>
            </div>
          )}
        </div>
        <div className="panel-container show">
          <div className="panel-content">
            {addUser ? (
              <>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Type
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={entryType}
                      defaultValue={entryType?.find(
                        (option) => option.value === newSellEntry.Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Type: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({ ...newSellEntry, Type: "" });
                        }
                        setError({ ...error, Type: "" });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      styles={customStyles}
                      {...props}
                      onInputChange={(inputValue) => {
                        if (/[^a-zA-Z\s]/.test(inputValue)) {
                          const sanitizedInput = inputValue.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          return sanitizedInput;
                        }
                        return inputValue;
                      }}
                    />
                    {error.Type !== "" && (
                      <p className="error-validation">{error.Type}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Co. Name
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={coName}
                      defaultValue={coName?.find(
                        (option) => option.value === newSellEntry.Co_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Co_Name: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({ ...newSellEntry, Co_Name: "" });
                        }
                        setError({ ...error, Co_Name: "" });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      styles={customStyles}
                      {...props}
                      onInputChange={(inputValue) => {
                        if (/[^a-zA-Z\s]/.test(inputValue)) {
                          const sanitizedInput = inputValue.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          return sanitizedInput;
                        }
                        return inputValue;
                      }}
                    />
                    {error.Co_Name !== "" && (
                      <p className="error-validation">{error.Co_Name}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Type Of Investment
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={typeOfInvestment}
                      defaultValue={typeOfInvestment?.find(
                        (option) =>
                          option.value === newSellEntry.Type_Of_Investment
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Type_Of_Investment: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({
                            ...newSellEntry,
                            Type_Of_Investment: "",
                          });
                        }
                        setError({ ...error, Type_Of_Investment: "" });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      styles={customStyles}
                      {...props}
                      onInputChange={(inputValue) => {
                        if (/[^a-zA-Z\s]/.test(inputValue)) {
                          const sanitizedInput = inputValue.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          return sanitizedInput;
                        }
                        return inputValue;
                      }}
                    />
                    {error.Type_Of_Investment !== "" && (
                      <p className="error-validation">
                        {error.Type_Of_Investment}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Transaction Type
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={typeOfTransaction}
                      defaultValue={typeOfTransaction?.find(
                        (option) =>
                          option.value === newSellEntry.Type_Of_Transaction
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Type_Of_Transaction: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({
                            ...newSellEntry,
                            Type_Of_Transaction: "",
                          });
                        }
                        setError({ ...error, Type_Of_Transaction: "" });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      styles={customStyles}
                      {...props}
                      onInputChange={(inputValue) => {
                        if (/[^a-zA-Z\s]/.test(inputValue)) {
                          const sanitizedInput = inputValue.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          return sanitizedInput;
                        }
                        return inputValue;
                      }}
                    />
                    {error.Type_Of_Transaction !== "" && (
                      <p className="error-validation">
                        {error.Type_Of_Transaction}
                      </p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      ISIN
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="ISIN"
                      autoComplete="off"
                      value={newSellEntry?.ISIN}
                      onChange={(e) => {
                        setNewSellEntry({
                          ...newSellEntry,
                          ISIN: e.target.value,
                        });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.ISIN !== "" && (
                      <p className="error-validation">{error.ISIN}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Redemption Date
                    </label>

                    <div>
                      <input
                        type="date"
                        className="input-date"
                        style={{
                          width: "100%",
                          height: "2.8em",
                          border: "0.1px solid rgb(216, 215, 215)",
                          outline: "none",
                          borderRadius: "3px",
                          padding: "0px 8px",
                        }}
                        onChange={(e) => handleDateChange(e.target.value, "")}
                        defaultValue={newSellEntry?.Redemption_Date}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Investment Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Investment date"
                      autoComplete="off"
                      value={newSellEntry?.Units}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Fund Received Date
                    </label>

                    <div>
                      <input
                        type="date"
                        className="input-date"
                        style={{
                          width: "100%",
                          height: "2.8em",
                          border: "0.1px solid rgb(216, 215, 215)",
                          outline: "none",
                          borderRadius: "3px",
                          padding: "0px 8px",
                        }}
                        onChange={(e) =>
                          handleDateChange(e.target.value, "funds")
                        }
                        defaultValue={newSellEntry?.Fund_Received_Date}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Units
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Units"
                      autoComplete="off"
                      value={newSellEntry?.Units}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Units !== "" && (
                      <p className="error-validation">{error.Units}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Balance Units
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Balance Units"
                      autoComplete="off"
                      value={newSellEntry?.Balance_Units}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Weighted Avg. Cost
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Weighted Avg. Cost"
                      autoComplete="off"
                      value={newSellEntry.Weighted_Avg_Cost}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Sell Nav
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Sell Nav"
                      autoComplete="off"
                      value={newSellEntry.Number_Of_Units}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Sold Receipt
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Sold Receipt"
                      autoComplete="off"
                      value={newSellEntry?.Sold_Receipt}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Valuation
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Valuation"
                      autoComplete="off"
                      value={newSellEntry?.Valuation}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Scheme Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Scheme Name"
                      autoComplete="off"
                      value={newSellEntry?.Scheme_Name}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {error.Scheme_Name !== "" && (
                      <p className="error-validation">{error.Scheme_Name}</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Remark
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Remark"
                      autoComplete="off"
                      value={newSellEntry?.Remark}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {error.Remark !== "" && (
                      <p className="error-validation">{error.Remark}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div id="divSearch" className="col-lg-12 col-md-12">
                    <div className="panel-container show">
                      <div className="panel-content">
                        <div className="row">
                          <div className="col-lg-3 col-md-3 ">
                            <label
                              className="form-label-small global-label-tag"
                              htmlFor="txtSearchSecurity"
                            >
                              Sell Entry ID
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Sell Entry ID"
                              autoComplete="off"
                              defaultValue={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                            />
                            {error.Buy_Entry_ID !== "" ? (
                              <p
                                className="error-validation"
                                style={{ fontWeight: "600" }}
                              >
                                {error.Buy_Entry_ID}
                              </p>
                            ) : (
                              <p
                                className="error-validation"
                                style={{ fontWeight: "600" }}
                              ></p>
                            )}
                          </div>
                          <div className="col-lg-3 col-md-3">
                            <button
                              className="btn btn-sm btn-default transition-3d-hover SearchButton"
                              style={{ height: "calc(1.47em + 1rem + 2px)" }}
                              type="button"
                              title="Search"
                              onClick={() => handleSearchUser()}
                              id="btn_Search"
                            >
                              <i className="fa fa-search mr-2"></i> Search
                            </button>
                          </div>
                        </div>

                        <div className="table-responsive table-wrap watchlist-table tblheight mt-0">
                          <SellEntryGrid
                            userInfo={userInfo}
                            handleEditUser={handleEditUser}
                            setAddUser={setAddUser}
                            setIsEdit={setIsEdit}
                            handleDeleteUser={handleDeleteUser}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="divContent" className="col-lg-12 col-md-12"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellEntry;
