import React, { useEffect, useState } from "react";
import { RestfullApiService, saveUserHistory } from "../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import PanDetailsMasterGrid from "../Grids/RPTGrids/PanDetailsMasterGrid";
import { getClientIP, getUserDataFromStorage } from "../../config/service";
import { useUpload } from "../../config/contextAPI/uploadModalContext";

const status = [
  {
    label: "Inactive",
    value: "1",
  },
  {
    label: "Active",
    value: "2",
  },
];
const RPTPanMasterData = {
  Party_Name: "",
  Entity: "",
  Pan_Number: "",
  Criteria: "",
  Relation: "",
  Status: '',
  PanID: 0
};
const PanDetailsMaster = ({ props }) => {
  const { isUploadOpen, openUpload } = useUpload();
  const [searchInput, setSearchInput] = useState("");
  const [panDetails, setPanDetails] = useState([]);
  const [addPanDetails, setAddPanDetails] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [relation, setRelation] = useState([]);
  const [ip, setIp] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const userData = getUserDataFromStorage();
  async function getIP() {
    const data = await getClientIP();
    setIp(data);
  }


  const [newRPTPanMaster, setNewRPTPanMaster] = useState(RPTPanMasterData);
  const err = {
    Party_Name: "",
    Entity: "",
    Pan_Number: "",
    Criteria: "",
    Relation: "",
    Status: "",
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
      };
      const result = await RestfullApiService(data, "user/GetOnLoadRPTPANDetailMaster");
      setPanDetails(result?.Result?.Table1);
    } catch (error) { }
  }

  useEffect(() => {
    const inputFields = document.querySelectorAll("input, textarea");
    const initialValues = {};
    inputFields?.forEach((input) => {
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
    inputFields?.forEach((input) => {
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      inputFields?.forEach((input) => {
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
    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newRPTPanMaster).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewRPTPanMaster(trimmedUser);
      // Perform validation
      if (newRPTPanMaster?.Party_Name === "") {
        errors = {
          ...errors,
          Party_Name: " Please Enter Party Name.",
        };
      }
      if (newRPTPanMaster?.Entity === "") {
        errors = { ...errors, Entity: "Please Enter Entity." };
      }

      if (!newRPTPanMaster?.Pan_Number) {
        errors = {
          ...errors,
          Pan_Number: "Please Enter Pan Number.",
        };
      } else if (!/^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/.test(newRPTPanMaster?.Pan_Number)) {
        errors = {
          ...errors,
          Pan_Number: "Please Enter Valid Pan Number.",
        };
      } else if (newRPTPanMaster?.Pan_Number < 10) {
        errors = {
          ...errors,
          Pan_Number: "Pan Number Must Contain 10 Digits.",
        };
      }

      if (newRPTPanMaster?.Criteria === "") {
        errors = { ...errors, Criteria: " Please Enter Criteria." };
      }
      if (newRPTPanMaster?.Relation === "") {
        errors = { ...errors, Relation: "Please Select Relation Name." };
      }
      if (newRPTPanMaster?.Status === "") {
        errors = { ...errors, Status: "Please Select Status." };
      }

      setError(errors);
      let notify;
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
          PanID: newRPTPanMaster?.PanID,
          PartyName: newRPTPanMaster?.Party_Name,
          Entity: newRPTPanMaster?.Entity,
          PanNumber: newRPTPanMaster?.Pan_Number,
          Criteria: newRPTPanMaster?.Criteria,
          Relation: newRPTPanMaster?.Relation,
          UserID: userData?.EmpID,
          Status: newRPTPanMaster?.Status
        }
        const result = await RestfullApiService(
          data,
          "user/SaveRPTPANDetailsMaster"
        );
        if (result?.Status === 200) {
          notify = toast.success(result?.Description);

          const val = {
            EmployeeCode: userData?.EmpID,
            Activity: (isEdit ? "Record Modified in Pan Details Master - PAN No: " : "Record Inserted in Pan Details Master - PAN No: ") + newRPTPanMaster?.Pan_Number + " By " + userData?.FullName,
            PageUrl: window.location.pathname,
            TableName: "Pan Details Master",
            ActionFor: newRPTPanMaster?.Pan_Number,
            ipaddress: ip
          }
          saveUserHistory(val, 'user/UserHistory');
          setNewRPTPanMaster(RPTPanMasterData)
          setAddPanDetails(!addPanDetails);


        } else if (result?.Status === 400) {
          notify = toast.error(result?.Description);

        }

        // Reset newUser object


        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          // handleSearchUser();
        } else {
          searchInput && handleSearchUser();
        }
        handleSearchUser();

      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");

      }
      notify();
    } catch (err) {
      // Handle error
    }
  }

  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "PartyName") {
        setNewRPTPanMaster({
          ...newRPTPanMaster,
          Party_Name: inputValue,
        });
        setError({ ...error, Party_Name: "" });
      } else if (type === "Criteria") {
        setNewRPTPanMaster({
          ...newRPTPanMaster,
          Criteria: e.target.value,
        });
        setError({ ...error, Criteria: "" });
      } else if (type === "Entity") {
        setNewRPTPanMaster({
          ...newRPTPanMaster,
          Entity: e.target.value,
        });
        setError({ ...error, Entity: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  async function getRelationships() {

    try {
      const result = await RestfullApiService({}, "user/GetRelationName");
      setRelation(result?.Result?.Table1)
    } catch (error) {

    }
  }

  function handleBackButton() {
    let errors = err;
    setNewRPTPanMaster(RPTPanMasterData);
    setError(errors);
    setIsEdit(false);
  }

  const handleDeletePanDetails = async (user) => {
    const notify = () => toast.success("User deleted successfully.");
    try {
      let data = {
        PanId: user?.Id,
        UserID: userData?.EmpID,
        ipaddress: ip,
        pageurl: window.location.pathname
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteRPTPANDetailsMaster");

      if (result.Status === 200) {
        notify();
      }
      handleSearchUser();
    } catch (error) { }
  };

  async function handleEditPanDetails(data) {
    try {
      const result = await RestfullApiService({ PanID: data?.Id }, "user/GetSingleRPTPANDetailsMasterByID");

      const value = result?.Result?.Table1[0];
      setNewRPTPanMaster({
        Pan_Number: value?.PanNumber,
        PanID: data?.Id,
        Party_Name: value?.PartyName,
        Entity: value?.Entity,
        Relation: value?.Relation,
        Criteria: value?.Criteria,
        Status: value?.IsActive?.toString()
      });
    } catch (error) {

    }
  }


  useEffect(() => {
    getRelationships();
  }, []);

  useEffect(() => {
    handleSearchUser();
    getIP();
  }, []);

  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addPanDetails ? "Pan Details Master" : "Pan Details Master"} </h2>
          {!addPanDetails ? (
            <div className="panel-toolbar" style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Upload"
                onClick={() => {
                  openUpload()
                }}
              >
                <i className="fa-solid fa-upload" style={{ color: 'white' }}></i>
              </button>
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Add"
                onClick={() => {
                  setAddPanDetails(!addPanDetails);
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
                    setAddPanDetails(!addPanDetails);
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
            {addPanDetails ? (
              <>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Party Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Party name"
                      autoComplete="off"
                      value={newRPTPanMaster?.Party_Name}
                      onChange={(e) => {
                        handleTextField(e, "PartyName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Party_Name !== "" && (
                      <p className="error-validation">{error.Party_Name}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Entity
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Entity"
                      autoComplete="off"
                      value={newRPTPanMaster?.Entity}
                      onChange={(e) => {
                        handleTextField(e, "Entity");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Entity !== "" && (
                      <p className="error-validation">{error.Entity}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Pan Number
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Pan number"
                      autoComplete="off"
                      value={newRPTPanMaster?.Pan_Number}
                      onChange={(e) => {
                        setNewRPTPanMaster({ ...newRPTPanMaster, Pan_Number: e.target.value });
                        setError({ ...error, Pan_Number: '' })
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Pan_Number !== "" && (
                      <p className="error-validation">{error.Pan_Number}</p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Criteria <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Criteria"
                      autoComplete="off"
                      value={newRPTPanMaster?.Criteria}
                      onChange={(e) => {
                        handleTextField(e, "Criteria");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Criteria !== "" && (
                      <p className="error-validation">{error.Criteria}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Relation
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={relation}
                      value={relation?.find(
                        (option) =>
                          option.label === newRPTPanMaster?.Relation
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRPTPanMaster({
                            ...newRPTPanMaster,
                            Relation: selectedOption?.label
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTPanMaster({
                            ...newRPTPanMaster,
                            Relation: ''
                          });
                        }
                        setError({ ...error, Relation: "" });
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
                    {error.Relation !== "" && (
                      <p className="error-validation">
                        {error.Relation}
                      </p>
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
                        (option) => option.value === newRPTPanMaster?.Status
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRPTPanMaster({
                            ...newRPTPanMaster,
                            Status: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTPanMaster({
                            ...newRPTPanMaster,
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
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div id="divSearch" className="col-lg-12 col-md-12">
                    <div className="panel-container show">
                      {/* <div className="panel-content"> */}
                      {/* <div className="row">
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
                              placeholder="Search"
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
                        </div> */}

                      <div className="table-responsive table-wrap watchlist-table tblheight mt-0">
                        <PanDetailsMasterGrid
                          searchInput={searchInput}
                          panDetails={panDetails}
                          handleEditPanDetails={handleEditPanDetails}
                          setAddPanDetails={setAddPanDetails}
                          setIsEdit={setIsEdit}
                          handleDeletePanDetails={handleDeletePanDetails}
                        />
                      </div>
                      {/* </div> */}
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

export default PanDetailsMaster;
