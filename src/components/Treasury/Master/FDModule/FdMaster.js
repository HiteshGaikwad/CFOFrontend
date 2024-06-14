import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import FdMasterGrid from "../../../Grids/TreasuryGrids/FDModuleGrids/FdMasterGrid";
import { getUserDataFromStorage } from "../../../../config/service";

const entryType = [
  {
    label: "Segment",
    value: 'Segment',
  },
  {
    label: "Purpose",
    value: 'Purpose',
  },
  {
    label: "Bank",
    value: 'Bank',
  },
];
const paymentFrequency = [
  {
    label: "FD Quarter",
    value: 1,
  },
  {
    label: "Bank Quarter",
    value: 2,
  },
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
const FdData = {
  Type: "",
  Payment_Frequency: 0,
  Name: "",
  LookUpId:0,
  UpdatedBy:''
};
const FdMaster = ({ props }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [newFdEntry, setNewFdEntry] = useState(FdData);

  const userData= getUserDataFromStorage()

  const err = {
    Type: "",
    Payment_Frequency: "",
    Name: "",
  };

  // search user data
  async function handleSearchUser(text) {
    try {
      let data = {
        Type: text? text:null
      };
      const result = await RestfullApiService(data, "user/GetFDMaster");
      setUserInfo(result?.Result?.Table1);
    } catch (error) {}
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
    let notify;
    
    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newFdEntry).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewFdEntry(trimmedUser);
      // Perform validation
      if (newFdEntry?.Type === "") {
        errors = { ...errors, Type: "Please Select Type." };
      }
      if (newFdEntry?.Name === "") {
        errors = { ...errors, Name: "Please Enter Name." };
      }
      if (newFdEntry?.Type==='Bank' && newFdEntry?.Payment_Frequency === "") {
        errors = {
          ...errors,
          Payment_Frequency: "Please Select Payment Frequency.",
        };
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
        const data=
          {
            LookUpId: newFdEntry?.LookUpId,
            Name: newFdEntry?.Name,
            PaymentFrequency: (newFdEntry?.Payment_Frequency)?newFdEntry?.Payment_Frequency:0,
            Type: newFdEntry?.Type,
            UpdatedBy: "",
            CreatedBy: userData?.EmpID
        }
        const result = await RestfullApiService(
          data,
          "user/SaveFDMaster"
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
        }
        handleSearchUser();
        setNewFdEntry(FdData);
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
      setNewFdEntry({ ...newFdEntry, Name: inputValue });
      setError({ ...error, Name: "" });
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  function handleBackButton() {
    let errors = err;
    setNewFdEntry(FdData);
    setError(errors);
    setIsEdit(false);
  }

  const handleDeleteUser = async (user) => {
    let notify;
    try {
      let data = {
        LookUpId: user?.LookupId,
  Type: user?.Type
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteFDMaster");
      if (result.Status === 200) {
        notify = () => toast.success(result?.Description);
      }
      handleSearchUser();
      notify();
    } catch (error) {}
  };

  async function handleEditUser(user) {
    try {
      const data={
        LookUpId: user?.LookupId,
        Name: user?.LookupValue,
        Type: user?.Type,
        
      }
      const result= await RestfullApiService(data,'user/GetSingleFDMasterByID')
      if(result?.Status===200){
        const val= result?.Result?.Table1[0]
        
        setNewFdEntry({
          Type: val?.Type,
    Payment_Frequency: val?.PaymentFrequency,
    Name: val?.LookupValue,
    LookUpId: val?.LookupId,
    UpdatedBy: userData?.EmpID
  });
      }
      
    } catch (error) {
      
    }
    
  }

  useEffect(() => {
    handleSearchUser();
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
          <h2>{!addUser ? "FD Master" : "FD Master"} </h2>
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
                      value={entryType?.find(
                        (option) => option.label?.toUpperCase() === newFdEntry.Type?.toUpperCase()
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdEntry({
                            ...newFdEntry,
                            Type: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdEntry({ ...newFdEntry, Type: "" });
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
                      htmlFor="txtAddSecurityName"
                    >
                      Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Name"
                      autoComplete="off"
                      value={newFdEntry?.Name}
                      onChange={(e) => {
                        handleTextField(e);
                      }}
                      maxLength="50"
                    />
                    {error.Name !== "" && (
                      <p className="error-validation">{error.Name}</p>
                    )}
                  </div>
                  {
                    newFdEntry.Type==='Bank' && <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Payment Frequency
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={paymentFrequency}
                      defaultValue={paymentFrequency?.find(
                        (option) =>
                          option.value === newFdEntry.Payment_Frequency
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdEntry({
                            ...newFdEntry,
                            Payment_Frequency: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdEntry({
                            ...newFdEntry,
                            Payment_Frequency: "",
                          });
                        }
                        setError({ ...error, Payment_Frequency: "" });
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
                    {error.Payment_Frequency !== "" && (
                      <p className="error-validation">
                        {error.Payment_Frequency}
                      </p>
                    )}
                  </div>
                  }
                  
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
                              Type
                            </label>
                            <ReactSelect
                              options={entryType}
                              defaultValue={entryType?.find(
                                (option) => option.label === newFdEntry.Type
                              )}
                              isClearable
                              onChange={(selectedOption) => {
                                
                                // Set isRefreshed to true to indicate unsaved changes
                                setIsRefreshed(true);
                                handleSearchUser(selectedOption?.label)
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
                          </div>
                          {/* <div className="col-lg-3 col-md-3">
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
                          </div> */}
                        </div>

                        <div className="table-responsive table-wrap watchlist-table tblheight mt-0">
                          <FdMasterGrid
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

export default FdMaster;
