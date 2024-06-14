import React, { useEffect, useState } from "react";
import { RestfullApiService, saveUserHistory } from "../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import RelationMasterGrid from "../Grids/RPTGrids/RelationMasterGrid";
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

const relationMasterData = {
  Relation_Name: "",
  Status: "",
  ModifiedBy: '',
  RelationId: 0,
};
const RelationMaster = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addRelationMaster, setAddRelationMaster] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [ip, setIp] = useState('');

  async function getIP() {
    const data = await getClientIP();
    setIp(data);
  }

  const userData = getUserDataFromStorage();

  const [newRelationMaster, setNewRelationMaster] =
    useState(relationMasterData);
  const err = {
    Relation_Name: "",
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
  async function handleSearch() {
    try {
      setError({});

      let data = {
        RelationName: searchInput ? searchInput : '',
        ReportStatus: '0'
      };

      const result = await RestfullApiService(data, "user/GetRPTRelationMaster");
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
    let notify = null;

    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newRelationMaster).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewRelationMaster(trimmedUser);
      // Perform validation
      if (newRelationMaster?.Relation_Name === "") {
        errors = {
          ...errors,
          Relation_Name: "Please Enter Relation Name.",
        };
      }

      if (newRelationMaster?.Status === "") {
        errors = { ...errors, Status: "Please Select Status." };
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
          RelationId: newRelationMaster?.RelationId,
          RelationName: newRelationMaster?.Relation_Name,
          Status: newRelationMaster?.Status?.toString(),
          CreatedBy: userData?.EmpID,
          ModifiedBy: newRelationMaster?.ModifiedBy
        }
        const result = await RestfullApiService(
          data,
          "user/SaveRPTRelationMaster"
        );
        if (result?.Status === 200) {
          notify = () => toast.success(result?.Description);
          // to save user history
          // const val={
          //   EmployeeCode: userData?.EmpID,
          //   Activity: (isEdit?"Record Modified in Relation Master - Relation Name: ":"Record Inserted in Relation Master - Relation Name: " )+ newRelationMaster?.Relation_Name + " By " + userData?.FullName,
          //   PageUrl: window.location.pathname,
          //   TableName: "Relation Master",
          //   ActionFor: newRelationMaster?.Relation_Name,
          //   ipaddress: ip
          // }
          // saveUserHistory(val,'user/UserHistory');
        }

        // Reset newUser object
        setAddRelationMaster(!addRelationMaster);
        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          handleSearch();
        } else {
          searchInput && handleSearch();
        }
        handleSearch();
        setNewRelationMaster(relationMasterData);
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
      if (type === "RelationName") {
        setNewRelationMaster({
          ...newRelationMaster,
          Relation_Name: inputValue,
        });
        setError({ ...error, Relation_Name: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  function handleBackButton() {
    let errors = err;
    setNewRelationMaster(relationMasterData);
    setError(errors);
    setIsEdit(false);
  }

  const handleDeleteUser = async (user) => {
    let notify;
    try {
      let data = {
        UserId: userData?.EmpID,
        ipaddress: ip,
        pageurl: window.location.pathname,
        RelationId: user?.RelationId
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteRPTRelationMaster");
      if (result.Status === 200) {
        notify = () => toast.success(result?.Description);
        notify();
      }
      handleSearch();
    } catch (error) { }
  };

  async function handleEditUser(user) {
    try {
      const data = {
        RelationId: user?.RelationId
      }
      const result = await RestfullApiService(
        data,
        "user/GetSingleRPTByID"
      );
      const val = result?.Result?.Table1[0]
      setNewRelationMaster({
        ModifiedBy: userData?.EmpID,
        RelationId: user?.RelationId,
        Relation_Name: val?.RelationName,
        Status: val?.Status
      })
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

  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addRelationMaster ? "Relation Master" : "Relation Master"} </h2>
          {!addRelationMaster ? (
            <div className="panel-toolbar">
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Add"
                onClick={() => {
                  setAddRelationMaster(!addRelationMaster);
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
                    setAddRelationMaster(!addRelationMaster);
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
            {addRelationMaster ? (
              <>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Relation Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Relation name"
                      autoComplete="off"
                      value={newRelationMaster?.Relation_Name}
                      onChange={(e) => {
                        handleTextField(e, "RelationName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Relation_Name !== "" && (
                      <p className="error-validation">{error.Relation_Name}</p>
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
                        (option) => option?.value === newRelationMaster?.Status
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRelationMaster({
                            ...newRelationMaster,
                            Status: selectedOption?.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRelationMaster({
                            ...newRelationMaster,
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
                      <div className="panel-content">
                        <div className="row">
                          <div className="col-lg-3 col-md-3 ">
                            <label
                              className="form-label-small global-label-tag"
                              htmlFor="txtSearchSecurity"
                            >
                              Relation Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Search by relation name"
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
                          <RelationMasterGrid
                            searchInput={searchInput}
                            userInfo={userInfo}
                            handleEditUser={handleEditUser}
                            setAddRelationMaster={setAddRelationMaster}
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

export default RelationMaster;
