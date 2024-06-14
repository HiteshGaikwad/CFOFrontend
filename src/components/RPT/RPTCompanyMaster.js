import React, { useEffect, useState } from "react";
import { RestfullApiService, saveUserHistory } from "../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import RPTCompanyMasterGrid from "../Grids/RPTGrids/RPTCompanyMasterGrid";
import { getClientIP, getUserDataFromStorage } from "../../config/service";
import { useCompany } from "../../config/contextAPI/companyContext";

const RPTTypeApplicable = [
  {
    label: "Yes",
    value: "1",
  },
  {
    label: "No",
    value: "2",
  },
];
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
const RPTCompanyMasterData = {
  ID: 0,
  Transaction_Type: "",
  RPT_Type_Applicable: "",
  RPT_Type: "",
  Account_Code: "",
  Company1: "",
  Company2: "",
  BusinessUnit1: "",
  BusinessUnit2: "",
  Company1_Pan: "",
  Company2_Pan: "",
  Relationship: "",
  Audit_committee_limit: "",
  Status: "",
  Justification: "",
  Base_Price: "",
};
const RPTCompanyMaster = ({ props }) => {
  const { isCompanyOpen, openCompany } = useCompany()
  const [searchInput, setSearchInput] = useState("");
  const [companyMaster, setCompanyMaster] = useState([]);
  const [addCompanyMaster, setAddCompanyMaster] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [transactionType, setTransactionType] = useState([]);
  const [RPTType, setRPTType] = useState([]);
  const [company, setCompany] = useState([]);
  const [relationship, setRelationship] = useState([]);
  const [isYesChecked, setIsYesChecked] = useState(false);
  const [isNoChecked, setIsNoChecked] = useState(false);
  const [ip, setIp] = useState('');
  const [newRPTCompanyMaster, setNewRPTCompanyMaster] =
    useState(RPTCompanyMasterData);

  const userData = getUserDataFromStorage();

  async function getIP() {
    const data = await getClientIP();
    setIp(data);
  }

  const err = {
    Transaction_Type: "",
    RPT_Type: '',
    Account_Code: "",
    Company1: "",
    Company2: "",
    Company1_Pan: "",
    Company2_Pan: "",
    Relationship: "",
    Audit_committee_limit: "",
    Status: "",
    Justification: "",
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
        accountcode: searchInput ? searchInput : ''
      };
      const result = await RestfullApiService(data, "user/GetRPTCompanyMaster");
      setCompanyMaster(result?.Result?.Table1);
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
  async function handleSaveCompanyMaster() {
    let notify;
    try {
      let errors = {};
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };
      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newRPTCompanyMaster).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );

      // Update newUser object with trimmed values
      setNewRPTCompanyMaster(trimmedUser);
      // Perform validation
      if (newRPTCompanyMaster?.Transaction_Type === "") {
        errors = {
          ...errors,
          Transaction_Type: "Please Select Transaction Type",
        };
      }
      if (newRPTCompanyMaster?.RPT_Type === '') {
        errors = {
          ...errors,
          RPT_Type: 'Please Select RPT Type'
        }
      }
      if (newRPTCompanyMaster?.Account_Code === "") {
        errors = { ...errors, Account_Code: "Please Enter Account Code" };
      }
      if (newRPTCompanyMaster?.Company1 === "") {
        errors = {
          ...errors,
          Company1: "Please Select Company 1 Name",
        };
      }

      if (newRPTCompanyMaster?.Company2 === "") {
        errors = { ...errors, Company2: "Please Select Company 2 Name" };
      } else if (newRPTCompanyMaster?.Company2.trim() === newRPTCompanyMaster?.Company1.trim()) {
        errors = { ...errors, Company2: " Company 2 Name cannot be same as Company 1 Name" };
      }

      if (newRPTCompanyMaster?.Company1_Pan === "") {
        errors = {
          ...errors,
          Company1_Pan: "Please Enter Company 1 Pan Number",
        };
      } else if (!/^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/.test(newRPTCompanyMaster?.Company1_Pan)) {
        errors = {
          ...errors,
          Company1_Pan: "Please Enter Valid Company 1 Pan Number",
        };
      }
      if (newRPTCompanyMaster?.Company2_Pan === "") {
        errors = { ...errors, Company2_Pan: "Please Enter Company 2 Pan Number" };
      } else if (!/^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/.test(newRPTCompanyMaster?.Company2_Pan)) {
        errors = {
          ...errors,
          Company1_Pan: "Please Enter Valid Company 2 Pan Number",
        };
      }

      if (newRPTCompanyMaster?.Relationship === "") {
        errors = { ...errors, Relationship: "Please Select Relation Name" };
      }
      if (newRPTCompanyMaster?.Audit_committee_limit === "") {
        errors = {
          ...errors,
          Audit_committee_limit: " Please Enter audit Limit",
        };
      }
      if (newRPTCompanyMaster?.Status === "") {
        errors = { ...errors, Status: "Please Select the Status" };
      }
      if (newRPTCompanyMaster?.Justification === "") {
        errors = { ...errors, Justification: " Please Enter Justification" };
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
      const data = {
        ID: newRPTCompanyMaster?.ID,
        TransactionTypeId: newRPTCompanyMaster?.Transaction_Type,
        RPTTypeApplicable: "",
        RPTType: newRPTCompanyMaster?.RPTAnalysisCode,
        RPTAnalysisCode: newRPTCompanyMaster?.RPT_Type,
        AccountCode: newRPTCompanyMaster?.Account_Code,
        Company1: newRPTCompanyMaster?.Company1,
        BusinessUnit1: newRPTCompanyMaster?.BusinessUnit1,
        BusinessUnit2: newRPTCompanyMaster?.BusinessUnit2,
        Company1Pan: newRPTCompanyMaster?.Company1_Pan,
        Company2: newRPTCompanyMaster?.Company2,
        Company2Pan: newRPTCompanyMaster?.Company2_Pan,
        Relationship: newRPTCompanyMaster?.Relationship?.toString(),
        Auditlimit: newRPTCompanyMaster?.Audit_committee_limit?.toString(),
        Justification: newRPTCompanyMaster?.Justification,
        BasePrice: newRPTCompanyMaster?.Base_Price,
        RelationId: 0,
        CreatedBy: userData?.EmpID,
        Status: newRPTCompanyMaster?.Status
      }
      // If no validation errors, proceed to save
      if (!flag) {
        const result = await RestfullApiService(
          data,
          "user/SaveRPTCompanyMaster"
        );
        if (result?.Status === 200) {
          notify = toast.success(result?.Description);
          const val = {
            EmployeeCode: userData?.EmpID,
            Activity: (isEdit ? "Record Modified in RPT Company Master - A/C Code: " : "Record Inserted in RPT Company Master - A/C Code: ") + newRPTCompanyMaster?.Account_Code?.toUpperCase() + " By " + userData?.FullName,
            PageUrl: window.location.pathname,
            TableName: "RPT Company Master",
            ActionFor: newRPTCompanyMaster?.Account_Code?.toUpperCase(),
            ipaddress: ip
          }
          saveUserHistory(val, 'user/UserHistory');
          // notify(); 
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
        setNewRPTCompanyMaster(RPTCompanyMasterData);
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
      }
      notify();
    } catch (error) {
      // Handle error
    }
  }

  async function getTransactionType() {

    try {
      const result = await RestfullApiService({}, "user/GetTransactionTypes");
      setTransactionType(result?.Result?.Table1);
    } catch (error) {

    }
  }
  async function getRptType() {

    try {
      const result = await RestfullApiService({}, "user/GetRptType");
      setRPTType(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getRptCompanyNames() {

    try {
      const result = await RestfullApiService({}, "user/GetRPTCompanyNames");
      setCompany(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getRelationships() {

    try {
      const result = await RestfullApiService({}, "user/GetRelationName");
      setRelationship(result?.Result?.Table1)
    } catch (error) {

    }
  }

  async function getPanNumberCompany(companyName, type) {

    try {
      const data = {
        PartyName: companyName
      }
      const result = await RestfullApiService(data, "user/GetPanNumberCompany");
      if (result?.Status === 200) {
        if (type === '1') {
          setNewRPTCompanyMaster({
            ...newRPTCompanyMaster,
            Company1_Pan: result?.Result?.Table1[0]?.PanNumber
          })
          setError({ ...error, Company1_Pan: '' })
        } else if (type === '2') {
          setNewRPTCompanyMaster({
            ...newRPTCompanyMaster,
            Company2_Pan: result?.Result?.Table1[0]?.PanNumber
          })
          setError({ ...error, Company2_Pan: '' })
        }
      }
    } catch (error) {

    }
  }

  function handleBackButton() {
    let errors = err;
    setNewRPTCompanyMaster(RPTCompanyMasterData);
    setError(errors);
    setIsEdit(false);
  }

  const handleNumberInput = (event) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      setNewRPTCompanyMaster({ ...newRPTCompanyMaster, Audit_committee_limit: inputValue });
      setError({ ...error, Audit_committee_limit: "" });
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  const handleDeleteCompanyMaster = async (user) => {
    const notify = () => toast.success("User deleted successfully.");
    try {
      let data = {
        CompanyId: user?.ID,
        UserID: userData?.EmpID,
        ipaddress: ip,
        pageurl: window.location.pathname

      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteRPTCompanyById");

      if (result.Status === 200) {
        notify();
      }
      handleSearchUser();
    } catch (error) { }
  };

  async function handleEditCompanyMaster(data) {
    try {
      const result = await RestfullApiService({ ID: data?.ID }, "user/GetRPTCompanyDataByID");
      const value = result?.Result?.Table1[0];
      setNewRPTCompanyMaster({
        ID: data?.ID,
        Transaction_Type: value?.TransactionType,
        RPT_Type_Applicable: "",
        RPT_Type: value?.RPT_Analysis_Code,
        RPTAnalysisCode: value?.RPTType,
        CreatedBy: value?.CreatedBy,
        Account_Code: value?.AccountCode,
        Company1: value?.Company1,
        Company2: value?.Company2,
        BusinessUnit1: value?.BusinessUnit1,
        BusinessUnit2: value?.BusinessUnit2,
        Company1_Pan: value?.Company1Pan,
        Company2_Pan: value?.Company2Pan,
        Relationship: value?.Relationship,
        Audit_committee_limit: value?.AuditLimit?.toString(),
        Status: value?.IsActive?.toString(),
        Justification: value?.Justification,
        Base_Price: value?.BasePrice,
      });
    } catch (error) {

    }
  }



  useEffect(() => {
    handleSearchUser();
    getIP();
  }, []);

  useEffect(() => {
    getTransactionType();
    getRptType();
    getRptCompanyNames()
    getRelationships()
    getClientIP()
  }, [])

  useEffect(() => {
    if (newRPTCompanyMaster?.Transaction_Type === 2) {
      setIsYesChecked(true);
      setIsNoChecked(false);
    } else if (newRPTCompanyMaster?.Transaction_Type === 1) {
      setIsYesChecked(false);
      setIsNoChecked(true);
    } else {
      setIsYesChecked(false);
      setIsNoChecked(false);
    }
  }, [newRPTCompanyMaster?.Transaction_Type]);

  useEffect(() => {
    if (newRPTCompanyMaster?.BusinessUnit1) {
      getPanNumberCompany(newRPTCompanyMaster?.BusinessUnit1, '1')
    }
  }, [newRPTCompanyMaster?.BusinessUnit1])

  useEffect(() => {
    if (newRPTCompanyMaster?.BusinessUnit2) {
      getPanNumberCompany(newRPTCompanyMaster?.BusinessUnit2, '2')
    }
  }, [newRPTCompanyMaster?.BusinessUnit2])

  useEffect(() => {
    if (newRPTCompanyMaster.Company1) {
      getPanNumberCompany(newRPTCompanyMaster.Company1, '1')
    }
  }, [newRPTCompanyMaster.Company1])

  useEffect(() => {
    if (newRPTCompanyMaster.Company2) {
      getPanNumberCompany(newRPTCompanyMaster.Company2, '2')
    }
  }, [newRPTCompanyMaster.Company2])

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
          <h2>{!addCompanyMaster ? "RPT Company Master" : "RPT Company Master"} </h2>
          {!addCompanyMaster ? (
            <div className="panel-toolbar" style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-icon btn-primary rounded-circle btn-sm mr-2"
                title="Upload"
                onClick={() => {
                  openCompany()
                }}
              >
                <i class="fa-solid fa-upload" style={{ color: 'white' }}></i>
              </button>
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
                  handleSaveCompanyMaster();
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
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Transaction Type
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={transactionType}
                      value={transactionType?.find(
                        (option) =>
                          option.value === newRPTCompanyMaster?.Transaction_Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Transaction_Type: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Transaction_Type: "",
                          });
                        }
                        setError({ ...error, Transaction_Type: "" });
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
                    {error.Transaction_Type !== "" && (
                      <p className="error-validation">
                        {error.Transaction_Type}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3 form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      RPT Type Applicable
                    </label>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                        <label style={{ paddingTop: '10px' }}>Yes</label>
                        <input
                          type="checkbox"
                          className="form-control checkbox-color"
                          id="txtAddSecurityName"
                          maxLength="10"
                          checked={isYesChecked}
                          readOnly
                          style={{
                            height: "20px",
                            width: "20px",
                            marginTop: "8px",
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} >
                        <label style={{ paddingTop: '10px' }}>No</label>
                        <input
                          type="checkbox"
                          className="form-control checkbox-color"
                          id="txtAddSecurityName"
                          maxLength="10"
                          checked={isNoChecked}
                          readOnly
                          style={{
                            height: "20px",
                            width: "20px",
                            marginTop: "8px",
                          }}
                        />
                      </div>
                    </div>

                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      RPT Type
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={RPTType}
                      value={RPTType?.find(
                        (option) =>
                          option.value === newRPTCompanyMaster?.RPT_Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            RPT_Type: selectedOption.value,
                            RPTAnalysisCode: selectedOption.label
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            RPT_Type: "",
                            RPTAnalysisCode: ''
                          });
                        }
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                        setError({ ...error, RPT_Type: '' })
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
                    {error.RPT_Type !== "" && (
                      <p className="error-validation">{error.RPT_Type}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Account Code
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Account code"
                      autoComplete="off"
                      value={newRPTCompanyMaster?.Account_Code}
                      onChange={(e) => {
                        setNewRPTCompanyMaster({
                          ...newRPTCompanyMaster,
                          Account_Code: e.target.value,
                        });
                        setError({ ...error, Account_Code: '' })
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Account_Code !== "" && (
                      <p className="error-validation">{error.Account_Code}</p>
                    )}
                  </div>
                </div>
                <div className="row mt-3 mb-0 px-3" style={{ height: "80px" }}>

                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Company 1
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={company}
                      value={company?.find(
                        (option) =>
                          option.value === newRPTCompanyMaster?.BusinessUnit1
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Company1: selectedOption?.label,
                            BusinessUnit1: selectedOption?.value
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Company1: "",
                            BusinessUnit1: '',
                            Company1_Pan: ''
                          });
                        }
                        setError({ ...error, Company1: "" });
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
                    {error.Company1 !== "" && (
                      <p className="error-validation">
                        {error.Company1}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Company 1 Pan <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Company 1 pan"
                      autoComplete="off"
                      value={newRPTCompanyMaster?.Company1_Pan || ''}
                      maxLength="50"
                      readOnly
                    />
                    {error.Company1_Pan !== "" && (
                      <p className="error-validation">{error.Company1_Pan}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Company 2<span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={company}
                      value={company?.find(
                        (option) =>
                          option.label === newRPTCompanyMaster?.Company2
                      )}
                      isClearable
                      onChange={(e) => {
                        if (e) {
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Company2: e?.label,
                            BusinessUnit2: e?.value
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Company2: "",
                            BusinessUnit2: '',
                            Company2_Pan: "",
                          });
                        }
                        setError({ ...error, Company2: "" });
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
                    {error.Company2 !== "" && (
                      <p className="error-validation">{error.Company2}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Company 2 Pan <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Company 2 pan"
                      autoComplete="off"
                      value={newRPTCompanyMaster?.Company2_Pan || ''}
                      readOnly
                      maxLength="50"
                    />
                    {error.Company2_Pan !== "" && (
                      <p className="error-validation">{error.Company2_Pan}</p>
                    )}
                  </div>
                </div>
                <div className="row mt-3 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Relationship <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={relationship}
                      value={relationship?.find(
                        (option) =>
                          option.value.toString() === newRPTCompanyMaster?.Relationship
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Relationship: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Relationship: "",
                          });
                        }
                        setError({ ...error, Relationship: "" });
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
                    {error.Relationship !== "" && (
                      <p className="error-validation">{error.Relationship}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Audit Committee Limit
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Audit committee limit"
                      autoComplete="off"
                      value={newRPTCompanyMaster?.Audit_committee_limit}
                      onChange={(e) => {
                        handleNumberInput(e);
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Audit_committee_limit !== "" && (
                      <p className="error-validation">
                        {error.Audit_committee_limit}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Status <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={status}
                      value={status?.find(
                        (option) => option.value === newRPTCompanyMaster?.Status
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
                            Status: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewRPTCompanyMaster({
                            ...newRPTCompanyMaster,
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
                <div className="row mt-3 mb-2 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Justification
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Justification"
                      autoComplete="off"
                      value={newRPTCompanyMaster?.Justification}
                      onChange={(e) => {
                        setNewRPTCompanyMaster({ ...newRPTCompanyMaster, Justification: e.target.value })
                        // Set isRefreshed to true to indicate unsaved changes
                        setError({ ...error, Justification: '' })
                        setIsRefreshed(true);
                      }}
                    />
                    {error.Justification !== "" && (
                      <p className="error-validation">{error.Justification}</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Base Price
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Base price"
                      autoComplete="off"
                      value={newRPTCompanyMaster?.Base_Price}
                      onChange={(e) => {
                        setNewRPTCompanyMaster({ ...newRPTCompanyMaster, Base_Price: e.target.value })
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {error.Base_Price !== "" && (
                      <p className="error-validation">{error.Base_Price}</p>
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
                              Account code
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Account code"
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
                          <RPTCompanyMasterGrid
                            searchInput={searchInput}
                            companyMaster={companyMaster}
                            handleEditCompanyMaster={handleEditCompanyMaster}
                            setAddCompanyMaster={setAddCompanyMaster}
                            setIsEdit={setIsEdit}
                            handleDeleteCompanyMaster={handleDeleteCompanyMaster}
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

export default RPTCompanyMaster;
