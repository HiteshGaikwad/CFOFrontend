import React, { useEffect, useState } from "react";
import { RestfullApiService, saveUserHistory } from "../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import AnalysisCodeMasterGrid from '../Grids/RPTGrids/AnalysisCodeMasterGrid'
import { getClientIP, getUserDataFromStorage } from "../../config/service";

const status = [
  {
    label: "Inactive",
    value: "0",
  },
  {
    label: "Active",
    value: "1",
  },
];

const accountType = [
  {
    label: "Income",
    value: "Income",
  },
  {
    label: "Expense",
    value: "Expense",
  },
  {
    label: "Balance Sheet",
    value: "BS",
  },
];

const analysisCodeMasterData = {
  Short_Code: "",
  Description: "",
  Status: "",
  Account_Type: "",
  ModifiedBy: '',
  Id: 0
};

const AnalysisCodeMaster = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [analysisCodeInfo, setAnalysisCodeInfo] = useState([]);
  const [addAnalysisCode, setAddAnalysisCode] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [ip, setIp] = useState('');


  const [newAnalysisCodeData, setNewAnalysisCodeData] = useState(
    analysisCodeMasterData
  );

  async function getIP() {
    const data = await getClientIP();
    setIp(data);
  }

  const userData = getUserDataFromStorage();

  const err = {
    Short_Code: "",
    Description: "",
    Status: "",
    Account_Type: "",
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

  // search user data
  async function handleSearchUser() {
    try {
      setError({});

      let data = {
        Description: searchInput ? searchInput : "",
        ReportStatus: "0"
      }
      const result = await RestfullApiService(data, "user/GetRPTAnalysisCodeMaster");
      setAnalysisCodeInfo(result?.Result?.Table1);
    } catch (error) { }
  }

  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const refresh = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefreshed(refresh);
  };

  // save user data
  async function handleSaveUser() {
    let notify = null;

    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newAnalysisCodeData).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewAnalysisCodeData(trimmedUser);
      // Perform validation
      if (newAnalysisCodeData?.Short_Code === "") {
        errors = {
          ...errors,
          Short_Code: "Please Enter Short code.",
        };
      }
      if (newAnalysisCodeData?.Description === "") {
        errors = { ...errors, Description: "Please Enter Description." };
      }
      if (newAnalysisCodeData?.Account_Type === "") {
        errors = {
          ...errors,
          Account_Type: "Please Enter Account type.",
        };
      }
      if (newAnalysisCodeData?.Status === "") {
        errors = { ...errors, Status: "Please Enter Status." };
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
        const data = {
          Id: newAnalysisCodeData?.Id,
          ShortCode: newAnalysisCodeData?.Short_Code,
          Description: newAnalysisCodeData?.Description,
          Status: newAnalysisCodeData?.Status,
          CreatedBy: userData?.EmpID,
          ModifiedBy: newAnalysisCodeData?.ModifiedBy,
          AccountType: newAnalysisCodeData?.Account_Type
        }

        const result = await RestfullApiService(
          data,
          "user/SaveAnalysisCodeMaster"
        );

        if (result.Status === 200) {
          notify = () => toast.success(result?.Description);

          const val = {
            EmployeeCode: userData?.EmpID,
            Activity: (isEdit ? "Record Modified in Analysis Code Master - Short Code: " : "Record Inserted in Analysis Code Master - Short Code: ") + newAnalysisCodeData?.Short_Code?.toUpperCase() + " By " + userData?.FullName,
            PageUrl: window.location.pathname,
            TableName: "Analysis Code Master",
            ActionFor: newAnalysisCodeData?.Short_Code?.toUpperCase(),
            ipaddress: ip
          }
          saveUserHistory(val, 'user/UserHistory');
        }

        // Reset newUser object
        setAddAnalysisCode(!addAnalysisCode);
        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          handleSearchUser();
        } else {
          searchInput && handleSearchUser();
        }
        handleSearchUser();
        setNewAnalysisCodeData(analysisCodeMasterData);
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
      }
      notify();
    } catch (error) {
      // Handle error
    }
  }
  function handleInputFieldChange(e, type) {
    let inputValue = e.target.value;
    if (type === 'shortCode') {
      const removeSpecialCharacters = (str) => str.replace(/[^a-zA-Z0-9]/g, ""); // Exclude spaces and special characters
      inputValue = removeSpecialCharacters(inputValue);
      setNewAnalysisCodeData({
        ...newAnalysisCodeData,
        Short_Code: inputValue
      });
    } else if (type === 'description') {
      const removeSpecialCharacters = (str) => str.replace(/[^a-zA-Z0-9\s]/g, ""); // Allow spaces in description
      inputValue = removeSpecialCharacters(inputValue);
      setNewAnalysisCodeData({
        ...newAnalysisCodeData,
        Description: inputValue
      });
    }
  }

  function handleBackButton() {
    let errors = err;
    setNewAnalysisCodeData(analysisCodeMasterData);
    setError(errors);
    setIsEdit(false);
  }

  const handleDeleteUser = async (user) => {
    let notify;
    try {
      let data = {
        RPTAnalysisCode: user?.Id,
        UserId: userData?.EmpID,
        ipaddress: ip,
        pageurl: window.location.pathname
      }
      // API call
      const result = await RestfullApiService(data, "user/DeleteRPTAnalysisCodeMaster");
      if (result.Status === 200) {
        notify = () => toast.success(result?.Description);
      }
      handleSearchUser();
      notify();
    } catch (error) { }
  };

  async function handleEditUser(user) {
    try {
      const data = { RPTAnalysisCode: user?.Id }
      const result = await RestfullApiService(
        data,
        "user/GetSingleRPTAnalysisCodeMasterByID"
      );
      const val = result?.Result?.Table1[0];
      setNewAnalysisCodeData({
        ...newAnalysisCodeData,
        Account_Type: val?.AccountType,
        Description: val?.Description,
        Short_Code: val?.ShortCode,
        Status: val?.Status,
        Id: user?.Id
      })
    } catch (error) {

    }
  }

  useEffect(() => {
    handleSearchUser();
    getIP()
  }, []);

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

  useEffect(() => {
    const inputFields = document.querySelectorAll("input, textarea");
    const initialValues = {};
    inputFields.forEach((input) => {
      initialValues[input.name] = input.value;
    });
    setInitialFieldValues(initialValues);
  }, []);

  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addAnalysisCode ? "Analysis Code Master" : "Analysis Code Master"} </h2>
          {!addAnalysisCode ? (
            <div className="panel-toolbar">
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Add"
                onClick={() => {
                  setAddAnalysisCode(!addAnalysisCode);
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
                    setAddAnalysisCode(!addAnalysisCode);
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
            {addAnalysisCode ? (
              <>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Short Code
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Short code"
                      autoComplete="off"
                      value={newAnalysisCodeData?.Short_Code}
                      onChange={(e) => {
                        handleInputFieldChange(e, 'shortCode')
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Short_Code !== "" && (
                      <p className="error-validation">{error.Short_Code}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Description
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Description"
                      autoComplete="off"
                      value={newAnalysisCodeData?.Description}
                      onChange={(e) => {
                        handleInputFieldChange(e, 'description')
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error?.Description !== "" && (
                      <p className="error-validation">{error?.Description}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Status<span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={status}
                      value={status?.find(
                        (option) => option?.value === newAnalysisCodeData?.Status
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewAnalysisCodeData({
                            ...newAnalysisCodeData,
                            Status: selectedOption?.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewAnalysisCodeData({
                            ...newAnalysisCodeData,
                            Status: "",
                          });
                        }
                        setError({ ...error, Status: "" });
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
                    {error.Status !== "" && (
                      <p className="error-validation">{error.Status}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Account Type<span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={accountType}
                      value={accountType?.find(
                        (option) =>
                          option.label === newAnalysisCodeData?.Account_Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewAnalysisCodeData({
                            ...newAnalysisCodeData,
                            Account_Type: selectedOption?.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewAnalysisCodeData({
                            ...newAnalysisCodeData,
                            Account_Type: "",
                          });
                        }
                        setError({ ...error, Account_Type: "" });
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
                    {error?.Account_Type !== "" && (
                      <p className="error-validation">{error?.Account_Type}</p>
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
                              Search
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Search by short code/description"
                              autoComplete="off"
                              defaultValue={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                            />
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
                          <AnalysisCodeMasterGrid
                            searchInput={searchInput}
                            analysisCodeInfo={analysisCodeInfo}
                            handleEditUser={handleEditUser}
                            setAddAnalysisCode={setAddAnalysisCode}
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

export default AnalysisCodeMaster;
