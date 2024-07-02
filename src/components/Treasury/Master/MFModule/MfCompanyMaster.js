import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import MfCompanyMasterGrid from "../../../Grids/TreasuryGrids/MFModuleGrids/MfCompanyMasterGrid";
import { getUserDataFromStorage } from "../../../../config/service";

const MfCompanyMaster = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addCompanyMaster, setAddCompanyMaster] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState(0);
  const [error, setError] = useState("");

  const userData = getUserDataFromStorage();

  // search user data
  async function handleSearchUser() {
    try {
      setError("");

      let data = {
        CompanyName: searchInput ? searchInput : ''
      };
      const result = await RestfullApiService(data, "user/GetMFCompanyMaster");
      setUserInfo(result?.Result?.Table1);
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
    let notify;
    try {
      // Trim string values in newUser object
      const trimmedValue = companyName.trim();
      // Update newUser object with trimmed values
      setCompanyName(trimmedValue);
      // Perform validation
      if (trimmedValue === "") {
        setError("Please Enter Company Name.");
      }
      // If no validation errors, proceed to save
      if (error === "") {
        const data = {
          CompanyId: companyId,
          CompanyName: trimmedValue,
          CreatedBy: userData?.EmpID
        }
        const result = await RestfullApiService(
          data,
          "user/SaveMFCompanyMaster"
        );
        if (result.Status === 200) {
          notify = () => toast.success(result?.Description);
        }

        // Reset newUser object
        setAddCompanyMaster(!addCompanyMaster);
        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          handleSearchUser();
        } else {
          searchInput && handleSearchUser();
        }
        handleSearchUser();
        setCompanyName("");
        setCompanyId(0)
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
      setCompanyName(inputValue);
      setError("");
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  function handleBackButton() {
    setCompanyName("");
    setError("");
    setIsEdit(false);
  }

  const handleDeleteUser = async (user) => {
    let notify;
    try {
      let data = {
        CompanyId: user?.CompId
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteMFCompanyMaster");
      if (result?.Status === 200) {
        notify = () => toast.success(result?.Description)
      }
      handleSearchUser();
      notify();
    } catch (error) { }
  };

  function handleEditUser(user) {
    setCompanyName(user?.CompanyName)
    setCompanyId(user?.CompId)
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
          <h2>{!addCompanyMaster ? "MF Company Master" : "MF Company Master"} </h2>
          {!addCompanyMaster ? (
            <div className="panel-toolbar">
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Add"
                onClick={() => {
                  setAddCompanyMaster(!addCompanyMaster);
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
                    setAddCompanyMaster(!addCompanyMaster);
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
            {addCompanyMaster ? (
              <>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Company Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Company name"
                      autoComplete="off"
                      defaultValue={companyName}
                      onChange={(e) => {
                        handleTextField(e);
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error !== "" && (
                      <p className="error-validation">{error}</p>
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
                              Company Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Search By Company"
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
                          <MfCompanyMasterGrid
                            userInfo={userInfo}
                            handleEditUser={handleEditUser}
                            setAddCompanyMaster={setAddCompanyMaster}
                            setIsEdit={setIsEdit}
                            handleDeleteUser={handleDeleteUser}
                            searchInput={searchInput}
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

export default MfCompanyMaster;
