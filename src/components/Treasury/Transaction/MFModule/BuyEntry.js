import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import { getUserDataFromStorage } from "../../../../config/service";
import BuyEntryGrid from "../../../Grids/TreasuryGrids/Transaction/MFModuleGrids/BuyEntryGrid";

const entryType = [
  {
    label: 'Equity',
    value: '0'
  },
  {
    label: 'Liquid',
    value: '1'
  },
  {
    label: 'AIF',
    value: '2'
  },
]
const purchaseType = [
  {
    label: 'Rebalancing',
    value: '0'
  },
  {
    label: 'Fresh',
    value: '1'
  },
  {
    label: 'Reinvestment',
    value: '2'
  },
]
const typeOfInvestment = [
  {
    label: 'Sponser Commitment',
    value: '0'
  },
  {
    label: 'Treasury Investment',
    value: '1'
  },
  {
    label: 'Client Investment',
    value: '2'
  },
]
const statusOfPledge = [
  {
    label: 'Pledge',
    value: '1'
  },
  {
    label: 'Free for Pledge',
    value: '2'
  },
]
const typeOfLienAvailed = [
  {
    label: 'EOD Value',
    value: '1'
  },
  {
    label: 'Intra day',
    value: '2'
  },
  {
    label: 'Both Value',
    value: '3'
  },
]
const BuyEntry = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [reblancingCoName, setReblancingCoName] = useState([]);
  const [coName, setCoName] = useState([]);
  const [pledgeWith, setPledgeWith] = useState([]);
  const [schemeName, setSchemeName] = useState([]);

  const userData = getUserDataFromStorage()

  const BuyEntryData = {
    ID: 0,
    Type: "",
    Purchase_Type: "",
    Rebalancing_Co_Name: 0,
    Co_Name: "",
    CoID: '',
    Type_Of_Investment: "",
    Investment_Date: "",
    ISIN: "",
    ISINId: '',
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
    ISIN: "",
    Units: "",
    Pledge_With: "",
    Type_Of_Lien_Availed: "",
    Scheme_Name: "",
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

  const handleDateChange = () => {
    // If a date is selected, generate the current time and combine it with the selected date

    const datestr = new Date();
    let d = (datestr.getDate()).toString();
    let m = (datestr.getMonth() + 1).toString();
    const y = datestr.getFullYear();
    m = (m.length < 2) ? ('0' + m) : m;
    d = (d.length < 2) ? ('0' + d) : d;
    let currentDate = "";
    currentDate +=
      y + "/" + m + "/" + d;

    return currentDate;
  };

  const handleDateFormat = (date) => {
    let currentDate;
    const y = date.slice(6, 10)
    const m = date.slice(3, 5)
    const d = date.slice(0, 2)
    currentDate =
      y + "-" + m + "-" + d;
    return currentDate;
  }

  // search user data
  async function handleSearchUser() {
    try {
      setError({});

      let data = {
        ID: searchInput ? searchInput : 0
      };
      const result = await RestfullApiService(data, "user/GetMFBuyEntry");
      setUserInfo(result?.Result?.Table1);
    } catch (error) { }
  }

  async function onChangeSchemeName(value) {
    try {
      const data = {
        ISINId: value
      }
      const result = await RestfullApiService(data, 'user/GetMFBuyEntryISIN');
      const isin = result?.Result?.ISINData?.Table1[0]
      const datestr = JSON.parse(result?.Result?.MaxDateData);
      let date;
      if (datestr?.Result === null) {
        date = handleDateChange()
      } else {
        date = datestr?.Result.slice(0, 10)
      }
      setNewBuyEntry({
        ...newBuyEntry,
        Scheme_Name: value,
        Investment_Date: date,
        ISINId: isin?.ISINId,
        ISIN: isin?.ISIN,
      });
      setError({ ...error, ISIN: '' })
      getNav(isin?.ISIN, date)
    } catch (error) {

    }
  }

  async function getNav(isin, date) {
    try {
      // const convertedDate = date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4) + 
      date += 'T00:00:00.000'
      const data = {
        UserDate: date,
        ISIN: isin
      }
      const result = await RestfullApiService(data, 'user/GetNAV');
      const nav_rs = result?.Result?.Table1[0]?.NAV_RS;
      if (newBuyEntry?.Units) {
        const n = parseInt(newBuyEntry?.Units)
        const val = n * nav_rs;
        setNewBuyEntry({ ...newBuyEntry, Purchase_Cost: val.toFixed(2) })
      }
    } catch (error) {

    }
  }

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
      if (newBuyEntry?.Purchase_Type === 'Rebalancing' && newBuyEntry?.Rebalancing_Co_Name === "") {
        errors = {
          ...errors,
          Rebalancing_Co_Name: "Rebalancing co. name is required",
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
      if (newBuyEntry?.Type_Of_Investment !== 'Sponser Commitment' && newBuyEntry?.Pledge_With === "") {
        errors = { ...errors, Pledge_With: "Pledge with is required." };
      }
      if (newBuyEntry?.Type_Of_Investment !== 'Sponser Commitment' && newBuyEntry?.Type_Of_Lien_Availed === "") {
        errors = { ...errors, Type_Of_Lien_Availed: "Type Of Lien Availed is required." };
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
          ID: newBuyEntry?.ID,
          Type: newBuyEntry?.Type,
          PurchaseType: newBuyEntry?.Purchase_Type,
          ReCoId: (newBuyEntry?.Rebalancing_Co_Name) ? (newBuyEntry?.Rebalancing_Co_Name) : 0,
          CoId: newBuyEntry?.CoID,
          TypeOfInvestment: newBuyEntry?.Type_Of_Investment,
          InvestmentDate: newBuyEntry?.Investment_Date,
          ISINId: newBuyEntry?.ISINId,
          Units: newBuyEntry?.Units,
          PurchaseCost: newBuyEntry?.Purchase_Cost,
          Remarks: newBuyEntry?.Remark,
          TransactionType: "Buy",
          CreatedBy: userData?.EmpCode,
          SoldReceipt: 0,
          WeightedAvgCost: 0,
          FundReceivedDate: null,
          SellAgainstDate: null,
          BalanceUnits: 0,
          SellNAV: 0,
          DpidFolioNo: newBuyEntry?.DPID_Folio_Number,
          StatusOfPledge: (newBuyEntry?.Status_Of_Pledge) ? (newBuyEntry?.Status_Of_Pledge) : null,
          NoOfUnits: (newBuyEntry?.Number_Of_Units) ? (newBuyEntry?.Number_Of_Units) : 0,
          PledgeWith: (newBuyEntry?.Pledge_With) ? (newBuyEntry?.Pledge_With) : 0,
          TypeOfLienAvailed: (newBuyEntry?.Type_Of_Lien_Availed) ? (newBuyEntry?.Type_Of_Lien_Availed) : 0,
          FundCode: newBuyEntry?.Fund_Code
        }
        // 0000-00-00T00:00:00.000Z
        const result = await RestfullApiService(
          data,
          "user/SaveMFBuyEntry"
        );
        if (result?.Status === 200) {
          setAddUser(!addUser);
          notify = () => toast.success(result?.Description);
        }
        // Reset newUser object

        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          handleSearchUser();
        } else {
          searchInput && handleSearchUser();
        }
        handleSearchUser();
        // setNewBuyEntry(BuyEntryData);
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
      if (type === "fundCode") {
        setNewBuyEntry({ ...newBuyEntry, Fund_Code: inputValue });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  async function getRebalancingCompanyName() {
    try {
      const result = await RestfullApiService({}, 'user/GetMFBuyEntryCompanyMaster');
      setReblancingCoName(result?.Result?.Table1);
      setCoName(result?.Result?.Table1)
    } catch (error) {

    }
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
      if (type === "units") {
        setNewBuyEntry({ ...newBuyEntry, Units: inputValue });
        setError({ ...error, Units: "" });

      }
      else if (type === "purchase_cost") {
        setNewBuyEntry({ ...newBuyEntry, Purchase_Cost: inputValue });
        setError({ ...error, Purchase_Cost: "" });
      }
      else if (type === "FolioNumber") {
        setNewBuyEntry({ ...newBuyEntry, DPID_Folio_Number: inputValue });
        setError({ ...error, DPID_Folio_Number: "" });
      }
      else if (type === "noOfUnits") {
        setNewBuyEntry({ ...newBuyEntry, Number_Of_Units: inputValue });
        setError({ ...error, Number_Of_Units: "" });
      }
      else if (type === "searchInput") {
        setSearchInput(inputValue)
      }

    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  const handleDeleteUser = async (user) => {
    let notify;
    try {
      let data = {
        ID: user?.ID
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteMFBuyEntry");
      if (result?.Status === 200) {
        notify = () => toast.success(result?.Description);
      }
      handleSearchUser();
      notify();
    } catch (error) { }
  };

  async function handleEditUser(data1) {
    try {
      const data = {
        ID: data1?.ID
      }
      const result = await RestfullApiService(data, 'user/GetSingleMFBuyEntryByID');
      const user = result?.Result?.Table1[0];
      console.log(result?.Result?.Table1[0]);
      setNewBuyEntry({
        ID: user?.ID,
        Type: user?.Type,
        Purchase_Type: user?.['PurchaseType'],
        Rebalancing_Co_Name: (user?.['ReCoID']),
        Co_Name: user?.['CompanyName'],
        CoID: user?.CoID,
        Type_Of_Investment: user?.['TypeOfInvestment'],
        Investment_Date: user?.['InvestmentDate'].slice(0, 10),
        ISIN: user?.['ISIN'],
        ISINId: user?.ISINId,
        Units: user?.['Units'],
        Purchase_Cost: user?.['PurchaseCost'],
        DPID_Folio_Number: user?.['DpidFolioNo'],
        Status_Of_Pledge: user?.['StatusOfPledge'],
        Number_Of_Units: user?.['NoOfUnits'],
        Pledge_With: user?.['PledgeWith'],
        Type_Of_Lien_Availed: user?.['TypeOfLienAvailed'],
        Fund_Code: user?.['FundCode'],
        Scheme_Name: user?.['SchemeName'],
        Remark: user?.['Remarks'],
      })
      getSchemeName()
    } catch (error) {

    }

  }

  async function getPledgeWith() {
    try {
      const result = await RestfullApiService({}, 'user/GetMFBuyEntryPledgeWithMaster');
      setPledgeWith(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getSchemeName() {
    try {
      let url;
      let data;
      if (newBuyEntry?.Purchase_Type === 'Reinvestment') {
        data = {
          CoID: newBuyEntry?.CoID,
          TypeOfInvestment: newBuyEntry?.Type_Of_Investment
        }
        url = 'user/GetMFBuyEntrySchemeNameForReinvestment'
      } else {
        data = {
          Nature: newBuyEntry?.Type
        }
        url = 'user/GetMFBuyEntrySchemeName';
      }
      const result = await RestfullApiService(data, url);

      setSchemeName(result?.Result?.Table1)
    } catch (error) {

    }
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

  useEffect(() => {
    handleSearchUser();
    getRebalancingCompanyName()
    getPledgeWith()
  }, []);

  useEffect(() => {
    if (newBuyEntry?.Type && newBuyEntry?.Co_Name && newBuyEntry?.Purchase_Type && newBuyEntry?.Type_Of_Investment) {
      getSchemeName()
    }
  }, [newBuyEntry])
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
                      value={newBuyEntry?.Type === '' ? '' : entryType?.find(
                        (option) => option.label === newBuyEntry.Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Type: selectedOption.label,
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
                      value={purchaseType?.find(
                        (option) => option.label === newBuyEntry.Purchase_Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Purchase_Type: selectedOption?.label,
                          });

                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({ ...newBuyEntry, Purchase_Type: "" });
                        }
                        setError({ ...error, Purchase_Type: "", Rebalancing_Co_Name: '' });
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
                      <span className="text-danger">{newBuyEntry?.Purchase_Type !== 'Rebalancing' ? '' : '*'}</span>
                    </label>
                    <ReactSelect
                      isDisabled={(newBuyEntry?.Purchase_Type) && newBuyEntry?.Purchase_Type !== 'Rebalancing'}
                      options={reblancingCoName}
                      value={reblancingCoName?.find(
                        (option) =>
                          option.value === newBuyEntry?.Rebalancing_Co_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Rebalancing_Co_Name: selectedOption.value,
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
                    {error?.Rebalancing_Co_Name !== "" && (
                      <p className="error-validation">
                        {error?.Rebalancing_Co_Name}
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
                      value={coName?.find(
                        (option) => option.label === newBuyEntry.Co_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Co_Name: selectedOption.label,
                            CoID: selectedOption.value
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({ ...newBuyEntry, Co_Name: "", CoID: '' });
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
                      value={typeOfInvestment?.find(
                        (option) =>
                          option.label === newBuyEntry?.Type_Of_Investment
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Type_Of_Investment: selectedOption.label,
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
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Scheme Name
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={schemeName}
                      value={schemeName?.find(
                        (option) =>
                          option.label === newBuyEntry?.Scheme_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          onChangeSchemeName(selectedOption?.value)

                        } else {
                          // Handle the case when the field is cleared
                          setNewBuyEntry({
                            ...newBuyEntry,
                            Scheme_Name: "",
                          });
                        }
                        setError({ ...error, Scheme_Name: "" });
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
                    {error.Scheme_Name !== "" && (
                      <p className="error-validation">{error.Scheme_Name}</p>
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
                        setError({ ...error, ISIN: '' })
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.ISIN !== "" && (
                      <p className="error-validation">{error.ISIN}</p>
                    )}
                  </div>

                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
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
                        onChange={(e) => { setNewBuyEntry({ ...newBuyEntry, Investment_Date: e.target.value }) }}
                        value={newBuyEntry?.Investment_Date}
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
                        handleNumberInput(e, "units");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);

                      }}
                      onBlur={() => getNav(newBuyEntry?.ISIN, newBuyEntry?.Investment_Date)}
                      maxLength="50"
                    />
                    {error?.Units !== "" && (
                      <p className="error-validation">
                        {error?.Units}
                      </p>
                    )}
                  </div>
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
                      value={newBuyEntry?.Units === '' ? "" : newBuyEntry?.Purchase_Cost}
                      onChange={(e) => {
                        handleNumberInput(e, "purchase_cost");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />

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
                        handleNumberInput(e, "FolioNumber");
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
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Status Of Pledge
                    </label>
                    <ReactSelect
                      options={statusOfPledge}
                      isDisabled={newBuyEntry?.Type_Of_Investment === 'Sponser Commitment'}
                      value={statusOfPledge?.find(
                        (option) =>
                          option.value === newBuyEntry?.Status_Of_Pledge?.toString()
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
                      value={newBuyEntry?.Number_Of_Units}
                      disabled={newBuyEntry?.Type_Of_Investment === 'Sponser Commitment'}
                      onChange={(e) => {
                        handleNumberInput(e, "noOfUnits");
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
                      value={pledgeWith?.find(
                        (option) => option.value === newBuyEntry?.Pledge_With
                      )}
                      isClearable
                      isDisabled={newBuyEntry?.Type_Of_Investment === 'Sponser Commitment'}
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
                      value={typeOfLienAvailed?.find(
                        (option) =>
                          option.value === newBuyEntry?.Type_Of_Lien_Availed?.toString()
                      )}
                      isClearable
                      isDisabled={newBuyEntry?.Type_Of_Investment === 'Sponser Commitment'}
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

                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
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
                        handleTextField(e, "fundCode");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Fund_Code !== "" && (
                      <p className="error-validation">{error.Fund_Code}</p>
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
                        setNewBuyEntry({ ...newBuyEntry, Remark: e.target.value })
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />

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
                              value={searchInput}
                              onChange={(e) => handleNumberInput(e, 'searchInput')}
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

export default BuyEntry;
