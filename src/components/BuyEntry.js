import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import BuyEntryGrid from "./Grids/BuyEntryGrid";

const BuyEntry = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [purchaseType, setPurchaseType] = useState([]);
  const [entryType, setEntryType] = useState([]);
  const [reblancingCoName, setReblancingCoName] = useState([]);
  const [coName, setCoName] = useState([]);
  const [typeOfInvestment, setTypeOfInvestment] = useState([]);
  const [statusOfPledge, setStatusOfPledge] = useState([]);
  const [pledgeWith, setPledgeWith] = useState([]);
  const [typeOfLienAvailed, setTypeOfLienAvailed] = useState([]);

  const BuyEntryData = {
    Type: "",
    Purchase_Type: "",
    Rebalancing_Co_Name: "",
    Co_Name: "",
    Type_Of_Investment: "",
    Investment_Date: "",
    ISIN: "",
    Units: "",
    Purchase_Cost: "",
    DPID_Folio_Number: "",
    Status_Of_Pledge: "",
    Number_Of_Units: "",
    Pledge_With: "",
    Type_Of_Lien_Availed: "",
    Fund_Code: "",
    Scheme_Name: "",
    Remark: "",
  };
  const [newBuyEntry, setNewBuyEntry] = useState(BuyEntryData);
  const err = {
    Type: "",
    Purchase_Type: "",
    Rebalancing_Co_Name: "",
    Co_Name: "",
    Type_Of_Investment: "",
    Investment_Date: "",
    ISIN: "",
    Units: "",
    Purchase_Cost: "",
    DPID_Folio_Number: "",
    Status_Of_Pledge: "",
    Number_Of_Units: "",
    Pledge_With: "",
    Type_Of_Lien_Availed: "",
    Fund_Code: "",
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

  const handleDateChange = (date) => {
    // If a date is selected, generate the current time and combine it with the selected date

    let currentDate = "";
    currentDate +=
      date.slice(8, 10) + "-" + date.slice(5, 7) + "-" + date.slice(0, 4);

    setNewBuyEntry({
      ...newBuyEntry,
      Investment_Date: currentDate,
      // Read_Date: currentDate,
    });
    setError((prevErrors) => ({
      ...prevErrors,
      Investment_Date: "",
    }));
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
        Object.entries(newBuyEntry).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewBuyEntry(trimmedUser);
      // Perform validation
      if (newBuyEntry?.Type === "") {
        errors = { ...errors, Type: "Type is required." };
      }
      if (newBuyEntry?.Purchase_Type === "") {
        errors = { ...errors, Purchase_Type: "Purchase type is required." };
      }
      if (newBuyEntry?.Rebalancing_Co_Name === "") {
        errors = {
          ...errors,
          Rebalancing_Co_Name: "Rebalancing co. name is required.",
        };
      }
      if (newBuyEntry?.Co_Name === "") {
        errors = { ...errors, Co_Name: "Co. name is required." };
      }
      if (newBuyEntry?.Type_Of_Investment === "") {
        errors = {
          ...errors,
          Type_Of_Investment: "Type Of investment is required.",
        };
      }
      if (newBuyEntry?.ISIN === "") {
        errors = { ...errors, ISIN: "ISIN is required." };
      }
      if (newBuyEntry?.Units === "") {
        errors = { ...errors, Units: "Units is required." };
      }
      if (newBuyEntry?.Scheme_Name === "") {
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
        setNewBuyEntry(BuyEntryData);
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
        setNewBuyEntry({ ...newBuyEntry, User_Display_Name: inputValue });
        setError({ ...error, User_Display_Name: "" });
      } else if (type === "loginId") {
        setNewBuyEntry({ ...newBuyEntry, User_Name: e.target.value });
        setError({ ...error, User_Name: "" });
      } else if (type === "designation") {
        setNewBuyEntry({ ...newBuyEntry, Designation: e.target.value });
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
      if (methodName === "Purchase_Type") {
        setPurchaseType(result.Result);
      }
      if (methodName === "Rebalancing_Co_Name") {
        setReblancingCoName(result.Result);
      }
      if (methodName === "Co_Name") {
        setCoName(result.Result);
      }
      if (methodName === "Type_of_Investment") {
        setTypeOfInvestment(result.Result);
      }
      if (methodName === "Status_Of_Pledge") {
        setStatusOfPledge(result.Result);
      }
      if (methodName === "Pledge_With") {
        setPledgeWith(result.Result);
      }
      if (methodName === "Type_Of_Lien_Availed") {
        setTypeOfLienAvailed(result.Result);
      }
    } catch (error) {}
  }
  function handleBackButton() {
    let errors = err;
    setNewBuyEntry(BuyEntryData);
    setError(errors);
    setIsEdit(false);
  }

  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "mobile") {
        setNewBuyEntry({ ...newBuyEntry, Mobile: inputValue });
        setError({ ...error, Mobile: "" });
      } else {
        setNewBuyEntry({ ...newBuyEntry, Landline: inputValue });
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
    setNewBuyEntry({});
  }

  useEffect(() => {
    getDropDown("Entry_Type", "", "");
    getDropDown("Purchase_Type", "", "");
    getDropDown("Rebalancing_Co_Name", "", "");
    getDropDown("Co_Name", "", "");
    getDropDown("Type_of_Investment", "", "");
    getDropDown("Status_Of_Pledge", "", "");
    getDropDown("Pledge_With", "", "");
    getDropDown("Type_Of_Lien_Availed", "", "");
  }, []);

  useEffect(() => {
    handleSearchUser();
  }, []);
  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addUser ? "Buy Entry" : "Create Buy Entry"} </h2>
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
                        (option) => option.value === newBuyEntry.Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Type: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({ ...newBuyEntry, Type: "" });
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
                      Purchase Type
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={purchaseType}
                      defaultValue={purchaseType?.find(
                        (option) => option.value === newBuyEntry.Purchase_Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Purchase_Type: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({ ...newBuyEntry, Purchase_Type: "" });
                        }
                        setError({ ...error, Purchase_Type: "" });
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
                    {error.Purchase_Type !== "" && (
                      <p className="error-validation">{error.Purchase_Type}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Rebalancing Co. Name
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={reblancingCoName}
                      defaultValue={reblancingCoName?.find(
                        (option) =>
                          option.value === newBuyEntry.Rebalancing_Co_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            UserType_Id: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Rebalancing_Co_Name: "",
                          });
                        }
                        setError({ ...error, Rebalancing_Co_Name: "" });
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
                    {error.Rebalancing_Co_Name !== "" && (
                      <p className="error-validation">
                        {error.Rebalancing_Co_Name}
                      </p>
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
                        (option) => option.value === newBuyEntry.Co_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Co_Name: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({ ...newBuyEntry, Co_Name: "" });
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
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
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
                          option.value === newBuyEntry.Type_Of_Investment
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Type_Of_Investment: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({
                            ...newBuyEntry,
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
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Investment Date
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
                        onChange={(e) => handleDateChange(e.target.value)}
                        defaultValue={newBuyEntry?.Investment_Date}
                      />
                    </div>

                    {error.Registration_Date && (
                      <div className="error-validation">
                        {error.Registration_Date}
                      </div>
                    )}
                  </div>
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
                      value={newBuyEntry?.ISIN}
                      onChange={(e) => {
                        setNewBuyEntry({
                          ...newBuyEntry,
                          ISIN: e.target.value,
                        });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Employee_Name !== "" && (
                      <p className="error-validation">{error.Employee_Name}</p>
                    )}
                  </div>
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
                      value={newBuyEntry?.Units}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Reporting_Manager !== "" && (
                      <p className="error-validation">
                        {error.Reporting_Manager}
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
                      Purchase Cost
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Purchase Cost"
                      autoComplete="off"
                      value={newBuyEntry?.Purchase_Cost}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Employee_Name !== "" && (
                      <p className="error-validation">{error.Employee_Name}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      DPID/Folio Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="DPID/Folio Number"
                      autoComplete="off"
                      value={newBuyEntry?.DPID_Folio_Number}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Reporting_Manager !== "" && (
                      <p className="error-validation">
                        {error.Reporting_Manager}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Status Of Pledge
                    </label>
                    <ReactSelect
                      options={statusOfPledge}
                      defaultValue={statusOfPledge?.find(
                        (option) =>
                          option.value === newBuyEntry?.Status_Of_Pledge
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Status_Of_Pledge: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Status_Of_Pledge: "",
                          });
                        }
                        setError({ ...error, Status_Of_Pledge: "" });
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
                    {error.Status_Of_Pledge !== "" && (
                      <p className="error-validation">
                        {error.Status_Of_Pledge}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Number Of Units
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Number Of Units"
                      autoComplete="off"
                      value={newBuyEntry.Number_Of_Units}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Number_Of_Units !== "" && (
                      <p className="error-validation">
                        {error.Number_Of_Units}
                      </p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Pledge With
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={pledgeWith}
                      defaultValue={pledgeWith?.find(
                        (option) => option.value === newBuyEntry?.Pledge_With
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Pledge_With: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({ ...newBuyEntry, Pledge_With: "" });
                        }
                        setError({ ...error, Pledge_With: "" });
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
                    {error.Pledge_With !== "" && (
                      <p className="error-validation">{error.Pledge_With}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Type Of Lien Availed
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={typeOfLienAvailed}
                      defaultValue={typeOfLienAvailed?.find(
                        (option) =>
                          option.value === newBuyEntry?.Type_Of_Lien_Availed
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Type_Of_Lien_Availed: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Type_Of_Lien_Availed: "",
                          });
                        }
                        setError({ ...error, Type_Of_Lien_Availed: "" });
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
                    {error.Type_Of_Lien_Availed !== "" && (
                      <p className="error-validation">
                        {error.Type_Of_Lien_Availed}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Fund Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Fund Code"
                      autoComplete="off"
                      value={newBuyEntry?.Fund_Code}
                      onChange={(e) => {
                        handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Fund_Code !== "" && (
                      <p className="error-validation">{error.Fund_Code}</p>
                    )}
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
                      value={newBuyEntry?.Scheme_Name}
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
                      value={newBuyEntry?.Remark}
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
                              Buy Entry ID
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Buy Entry ID"
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
                          <BuyEntryGrid
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

export default BuyEntry;
