import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import ISINMasterGrid from "../../../Grids/TreasuryGrids/MFModuleGrids/ISINMasterGrid";
import { getUserDataFromStorage } from "../../../../config/service";

const nature = [
  {
    label: "Liquid",
    value: "1",
  },
  {
    label: "Equity",
    value: "2",
  },
  {
    label: "AIF",
    value: "3",
  },
];
const ISINData = {
  ISIN: "",
  From_Date: "",
  Nature: "",
  Scheme_Name: "",
  ISINId:0
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

const ISINMaster = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});


  const [newISINEntry, setNewISINEntry] = useState(ISINData);
  const err = {
    ISIN: "",
    From_Date: "",
    Nature: "",
    Scheme_Name: "",
  };

  const userData = getUserDataFromStorage()

  // const handleDateChange = (date) => {
  //   // If a date is selected, generate the current time and combine it with the selected date

  //   let currentDate = "";
  //   currentDate +=
  //     date.slice(8, 10) + "/" + date.slice(5, 7) + "/" + date.slice(0, 4);

  //   setNewISINEntry({
  //     ...newISINEntry,
  //     From_Date: currentDate,
  //     // Read_Date: currentDate,
  //   });
  //   setError((prevErrors) => ({
  //     ...prevErrors,
  //     From_Date: "",
  //   }));
  // };

  // search user data
  
  async function handleSearchUser() {
    try {
      setError({});

      let data = {
        ISIN: searchInput?searchInput:''
      };
      const result = await RestfullApiService(data, "user/GetMFISIN");
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
        Object.entries(newISINEntry).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewISINEntry(trimmedUser);
      // Perform validation
      if (newISINEntry?.ISIN === "") {
        errors = { ...errors, ISIN: "Please Enter ISIN." };
      }
      if (newISINEntry?.From_Date === "") {
        errors = { ...errors, From_Date: "Please Enter From Date." };
      }
      if (newISINEntry?.Nature === "") {
        errors = {
          ...errors,
          Nature: "Please Select Nature.",
        };
      }
      if (newISINEntry?.Scheme_Name === "") {
        errors = { ...errors, Scheme_Name: "Please Enter Scheme Name." };
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
          ISINId: newISINEntry?.ISINId,
          ISIN: newISINEntry?.ISIN,
          SchemeName: newISINEntry?.Scheme_Name,
          FromDate: newISINEntry?.From_Date,
          Nature: newISINEntry?.Nature,
          CreatedBy: userData?.EmpID
        }
        const result = await RestfullApiService(
          data,
          "user/SaveMFISIN"
        );
        if (result.Status === 200) {
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
        setNewISINEntry(ISINData);
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
      }
      notify();
    } catch (error) {
      // Handle error
    }
  }

  const handleTextField = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      setNewISINEntry({ ...newISINEntry, Scheme_Name: inputValue });
      setError({ ...error, Scheme_Name: "" });
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  function handleBackButton() {
    let errors = err;
    setNewISINEntry(ISINData);
    setError(errors);
    setIsEdit(false);
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  }

  const handleDeleteUser = async (user) => {
    let notify ;
    try {
      let data = {
        ISINId: user?.ISINId
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteMFISIN");
      if (result?.Status === 200) {
        notify = () => toast.success(result?.Description)
      }
      handleSearchUser();
      notify();
    } catch (error) { }
  };

  async function handleEditUser(user) {
    try {
      const data={
        ISINId: user?.ISINId?.toString()
      }
      const result= await RestfullApiService(data,'user/GetSingleMFISINByID')
      const val= result?.Result?.Table1[0];
      setNewISINEntry({
        ...newISINEntry,
        From_Date: val?.Fromdate?.slice(0,10),
        ISIN: val?.ISIN,
        Nature: val?.NATURE,
        Scheme_Name: val?.SchemeName,
        ISINId: user?.ISINId
      })
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
  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addUser ? "ISIN Master" : "Create ISIN Master"} </h2>
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
                      value={newISINEntry?.ISIN}
                      onChange={(e) => {
                        setNewISINEntry({
                          ...newISINEntry,
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
                      From Date <span className="text-danger">*</span>
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
                          { setNewISINEntry({ ...newISINEntry, From_Date: (e.target.value) }) ;
                        setError((prevErrors) => ({
                        ...prevErrors,
                        From_Date: "",
                            }))}
                          }
                      value={newISINEntry?.From_Date}
                      />
                    </div>

                    {error.From_Date && (
                      <div className="error-validation">{error.From_Date}</div>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Nature
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={nature}
                      value={nature?.find(
                        (option) => option.label === newISINEntry.Nature
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewISINEntry({
                            ...newISINEntry,
                            Nature: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewISINEntry({
                            ...newISINEntry,
                            Nature: "",
                          });
                        }
                        setError({ ...error, Nature: "" });
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
                    {error.Nature !== "" && (
                      <p className="error-validation">{error.Nature}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
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
                      value={newISINEntry?.Scheme_Name}
                      onChange={(e) => {
                        handleTextField(e);
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Scheme_Name !== "" && (
                      <p className="error-validation">{error.Scheme_Name}</p>
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
                              ISIN
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Search by ISIN"
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
                          <ISINMasterGrid
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

export default ISINMaster;
