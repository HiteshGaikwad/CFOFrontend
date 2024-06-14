import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { useNavigate } from "react-router-dom";
import {
  getToken,
  getUserDataFromStorage,
  isUserAuthenticated,
} from "../../config/service";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import Modal from "react-modal";
import UserMasterGrid from "../Grids/AdminGrids/UserMasterGrid"
import { RestfullApiService } from "../../config/Api's";
import MultiSelect from "multiselect-react-dropdown";

Modal.setAppElement("#root");
const options1 = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
];

const role = [
  { value: 'Checker"', label: "Checker" }, // Option for "Select All"
  { value: 'Maker', label: "Maker" },
];

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

const EmployeeDetails = ({ ...props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [businessUnit, setBusinessUnit] = useState([]);
  const userData = getUserDataFromStorage()

  const user = {
    Employee_Name: "",
    Reporting_Manager: "",
    ReportingTo: '',
    Email_Id: "",
    Mobile: "",
    Role: "",
    Business_unit: "",
    EmpID: '',
    Full_Name: ''
  };
  const [newUser, setNewUser] = useState(user);

  const errors = {
    Employee_Name: "",
    Reporting_Manager: "",
    Email_Id: "",
    Mobile: "",
    Role: "",
    Business_unit: "",
  };

  // search user data
  async function handleSearchUser() {
    try {
      setError({});

      let data = {
        name: searchInput ? searchInput : ''
      }
      const result = await RestfullApiService(data, "user/GetEmployeeDetail");
      setUserInfo(result?.Result?.Table1);
    } catch (error) { }
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
    let notify;

    try {
      let err = errors;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newUser).map(([key, value]) => [key, trimValue(value)])
      );
      // Update newUser object with trimmed values
      setNewUser(trimmedUser);
      // Perform validation
      if (newUser?.Employee_Name === "") {
        err = { ...err, Employee_Name: "Please Enter Employee Name." };
      }
      if (newUser?.Reporting_Manager === "") {
        err = { ...err, Reporting_Manager: "Please Enter Reporting Manager." };
      }
      if (newUser?.Email_Id === "") {
        err = { ...err, Email_Id: "Please Eneter Email ID." };
      }
      if (newUser?.Mobile === "") {
        err = { ...err, Mobile: "Please Eneter Mobile Number." };
      }
      if (newUser?.Business_unit === "") {
        err = { ...err, Business_unit: "Please Select Business Unit." };
      }

      setError(err);

      // Check if there are no validation errors
      let flag = false;
      for (const key in err) {
        if (err[key] !== "") {
          flag = true;
          break;
        }
      }
      // If no validation errors, proceed to save
      if (!flag) {
        const list = selectedOptions.map((item) => {
          return item.name
        })
        const data = {
          empid: newUser?.EmpID,
          fullname: newUser?.Full_Name,
          reportingto: newUser?.ReportingTo,
          mobilenumber: newUser?.Mobile,
          emailid: newUser?.Email_Id,
          businessunit: list ? (list + ',') : '',
          role: (newUser?.Role) ? (newUser?.Role) : ''
        }
        const result = await RestfullApiService(
          data,
          "user/SaveUpdateEmployeeData"
        );
        if (result?.Status === 200) {
          notify = () => toast.success(result?.Description);
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
        setNewUser(user);
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
      }
      notify();

    } catch (error) {
      // Handle error
    }
  }

  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "employeeName") {
        setNewUser({ ...newUser, Employee_Name: inputValue });
        setError({ ...error, Employee_Name: "" });
      } else if (type === "reportingManager") {
        setNewUser({ ...newUser, Reporting_Manager: inputValue });
        setError({ ...error, Reporting_Manager: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  async function getBusinessUnitList() {
    try {
      // API call
      const result = await RestfullApiService('', "user/DDLGetBusinessUnit");
      setBusinessUnit(result?.Result?.Table1);
    } catch (error) { }
  }

  function handleBackButton() {
    setError(errors);
    setIsEdit(false);
    setNewUser(user);
  }

  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "mobile") {
        setNewUser({ ...newUser, Mobile: inputValue });
        setError({ ...error, Mobile: "" });
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
    } catch (error) { }
  };

  async function handleEditUser(user) {
    try {
      setAddUser(true)
      const data = {
        EmpId: user?.EmpID?.toString()
      }
      const result = await RestfullApiService(data, 'user/GetEmployeeDetailByEmpId')
      const val = result?.Result?.Table1[0];
      setNewUser({
        ...newUser,
        Business_unit: val?.BusinessUnit,
        Email_Id: val?.EmailAddress,
        Mobile: val?.MobileNumber,
        Reporting_Manager: val?.ReportingManager,
        ReportingTo: val?.ReportingTo,
        Employee_Name: val?.FullName,
        Role: (val?.Role === '0') ? '' : (val?.Role?.trim()),
        EmpID: val?.EmpID,
        Full_Name: val?.FullName
      })
      const arr = val?.BusinessUnit?.split(',');
      let updatedArr = arr.map((name) => {
        return (
          {
            name: name,
            id: name
          }
        )
      })
      setSelectedOptions(updatedArr);
    } catch (error) {

    }
  }

  useEffect(() => {
    handleSearchUser();
    getBusinessUnitList();
  }, []);

  // functions for multi select dropdown
  const onSelect = (selectedList, selectedItem) => {
    if (selectedItem.id === '-1') {
      setSelectedOptions(businessUnit);
    } else {
      debugger
      setSelectedOptions(selectedList);
    }
  };

  const onRemove = (selectedList, removedItem) => {
    if (removedItem.id === '-1') {
      setSelectedOptions([]);
    } else if (
      removedItem.id !== '-1' &&
      selectedList.length + 1 === businessUnit.length
    ) {
      setSelectedOptions(selectedList.slice(1));
    } else {
      setSelectedOptions(selectedList);
    }
  };

  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addUser ? "Employee Details" : "Add Employee"} </h2>
          {!addUser ? (
            <div className="panel-toolbar">
              {/* <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Add"
                onClick={() => {
                  setAddUser(!addUser);
                }}
              >
                <i className="fa fa-plus text-white"></i>
              </button> */}
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
                Update
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
                      htmlFor="txtAddSecurityName"
                    >
                      Employee Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Employee name"
                      autoComplete="off"
                      value={newUser?.Employee_Name}
                      onChange={(e) => {
                        handleTextField(e, "employeeName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error?.Employee_Name !== "" && (
                      <p className="error-validation">{error?.Employee_Name}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Reporting Manager
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Reporting Manager"
                      autoComplete="off"
                      value={newUser?.Reporting_Manager}
                      onChange={(e) => {
                        handleTextField(e, "reportingManager");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error?.Reporting_Manager !== "" && (
                      <p className="error-validation">
                        {error?.Reporting_Manager}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddFaceValue"
                    >
                      Email ID
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="txtAddFaceValue"
                      placeholder="Email"
                      value={newUser?.Email_Id}
                      maxLength="100"
                      autoComplete="off"
                      onChange={(e) => {
                        setNewUser({ ...newUser, Email_Id: e.target.value });
                        setError({ ...error, Email_Id: "" });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {error?.Email_Id !== "" && (
                      <p className="error-validation">{error?.Email_Id}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddInterestFrequency"
                    >
                      Mobile No.
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      id="txtAddInterestFrequency"
                      placeholder="Mobile number"
                      autoComplete="off"
                      value={newUser?.Mobile}
                      maxLength="10"
                      pattern="/[0-9]/"
                      onChange={(e) => handleNumberInput(e, "mobile")}
                    />
                    {error?.Mobile !== "" && (
                      <p className="error-validation">{error?.Mobile}</p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Role
                      {/* <span className="text-danger">*</span> */}
                    </label>
                    <ReactSelect
                      options={role}
                      value={role?.find(
                        (option) => option.label === newUser?.Role
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewUser({
                            ...newUser,
                            Role: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewUser({ ...newUser, Role: "" });
                        }
                        setError({ ...error, Role: "" });
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
                    {/* {error.Role !== "" && (
                      <p className="error-validation">{error.Role}</p>
                    )} */}
                  </div>
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Business Unit
                      <span className="text-danger">*</span>
                    </label>
                    <MultiSelect
                      options={businessUnit}
                      selectedValues={selectedOptions}
                      onSelect={onSelect}
                      onRemove={onRemove}
                      displayValue="name"
                      showCheckbox={true}
                      disableSearch={true} // Set to true to enable checkboxes
                      className="multiselect-dropdown"

                    />
                    {error.Business_unit !== "" && (
                      <p className="error-validation">{error.Business_unit}</p>
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
                              Employee Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Employee Name"
                              autoComplete="off"
                              defaultValue={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                            />
                            {error.User_Name !== "" ? (
                              <p
                                className="error-validation"
                                style={{ fontWeight: "600" }}
                              >
                                {error.User_Name}
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
                          <UserMasterGrid
                            searchInput={searchInput}
                            userInfo={userInfo}
                            handleEditUser={handleEditUser}
                            setAddUser={setAddUser}
                            setIsEdit={setIsEdit}
                            handleDeleteUser={handleDeleteUser}
                          />
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
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

export default EmployeeDetails;
