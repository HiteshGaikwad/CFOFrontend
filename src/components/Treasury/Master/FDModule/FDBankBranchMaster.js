import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import MfCompanyMasterGrid from "../../../Grids/TreasuryGrids/MFModuleGrids/MfCompanyMasterGrid";
import { getUserDataFromStorage } from "../../../../config/service";
import FDBankBranchMasterGrid from "../../../Grids/TreasuryGrids/FDModuleGrids/FDBankBranchMasterGrid";

const FDBankBranchMaster = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addBankBranch, setAddBankBranch] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [bankBranchName, setBankBranchName] = useState("");
  const [bankBranchId,setBankBranchId]= useState(0)
  const [error, setError] = useState("");

  const userData= getUserDataFromStorage();

  // search user data
  async function handleSearch() {
    try {
      setError("");

      let data = {
        BankBranchName: searchInput?searchInput:''
      };
      const result = await RestfullApiService(data, "user/GetFDBankBranch");
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
  async function handleSave() {
    let notify;
    try {
      // Trim string values in newUser object
      const trimmedValue = bankBranchName.trim();
      // Update newUser object with trimmed values
      setBankBranchName(trimmedValue);
      // Perform validation
      if (trimmedValue === "") {
        setError("Please Enter Bank Branch Name.");
      }
      // If no validation errors, proceed to save
      if (trimmedValue !== "") {
        const data= {
            Id: bankBranchId,
            Name: bankBranchName,
            Type: null,
            CreatedBy: userData?.EmpID,
            UpdatedBy: isEdit && userData?.EmpID
          
        }
        const result = await RestfullApiService(
          data,
          "user/SaveFDBankBranch"
        );
        if (result.Status === 200) {
          notify = () => toast.success(result?.Description);
        }

        // Reset newUser object
        setAddBankBranch(!addBankBranch);
        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          handleSearch();
        } else {
          searchInput && handleSearch();
        }
        handleSearch();
        setBankBranchName("");
        setBankBranchId(0)
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
      setBankBranchName(inputValue);
      setError("");
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  function handleBackButton() {
    setBankBranchName("");
    setError("");
    setIsEdit(false);
  }

  const handleDelete = async (user) => {
    let notify;
    try {
      let data = {
        Id:user?.ID?.toString()
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteFDBankBranch");
      if (result?.Status === 200) {
        notify = () => toast.success(result?.Description)
      }
      handleSearch();
      notify();
    } catch (error) {}
  };

  async function handleEditUser(user) {
    try {
        const data={
            Id:user?.ID
        }
        const result= await RestfullApiService(data,'user/GetSingleFDBankBranchByID')
        const val=result?.Result?.Table1[0]
        setBankBranchName(val?.Name)
        setBankBranchId(val?.Id)
    } catch (error) {
        
    }
  }

  useEffect(() => {
    handleSearch();
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
          <h2>{!addBankBranch ? "FD Bank Branch Master" : "FD Bank Branch Master"} </h2>
          {!addBankBranch ? (
            <div className="panel-toolbar">
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Add"
                onClick={() => {
                  setAddBankBranch(!addBankBranch);
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
                  handleSave();
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
                    setAddBankBranch(!addBankBranch);
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
            {addBankBranch ? (
              <>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Bank Branch Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Bank Branch Name"
                      autoComplete="off"
                      defaultValue={bankBranchName}
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
                              Bank Branch Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Search By Bank Branch Name"
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
                              onClick={() => handleSearch()}
                              id="btn_Search"
                            >
                              <i className="fa fa-search mr-2"></i> Search
                            </button>
                          </div>
                        </div>

                        <div className="table-responsive table-wrap watchlist-table tblheight mt-0">
                          <FDBankBranchMasterGrid
                            userInfo={userInfo}
                            handleEditUser={handleEditUser}
                            setAddBankBranch={setAddBankBranch}
                            setIsEdit={setIsEdit}
                            handleDelete={handleDelete}
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

export default FDBankBranchMaster;
