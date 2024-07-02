import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import SellEntryGrid from "../../../Grids/TreasuryGrids/Transaction/MFModuleGrids/SellEntryGrid";
import { getUserDataFromStorage } from "../../../../config/service";

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
const typeOfTransaction = [
  {
    label: 'Sell',
    value: '0'
  },
  {
    label: 'Divident Payout',
    value: '1'
  },
]
const SellEntry = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [investmentDate, setInvestmentDate] = useState([]);

  const [coName, setCoName] = useState([]);

  const userData = getUserDataFromStorage()

  const SellEntryData = {
    ID: 0,
    Type: "",
    Co_Name: "",
    CoId: 0,
    Type_Of_Investment: "",
    Type_Of_Transaction: "Sell",
    ISIN: "",
    ISINId: 0,
    Redemption_Date: "",
    Investment_Date: "",
    Fund_Received_Date: "",
    Units: "",
    Balance_Units: 0,
    BalanceUnitInitial: '',
    Weighted_Avg_Cost: 0,
    Sell_Nav: "",
    Sold_Receipt: "",
    Valuation: 0,
    Scheme_Name: "",
    Remark: "",
  };
  const [newSellEntry, setNewSellEntry] = useState(SellEntryData);
  const [schemeName, setSchemeName] = useState([])

  const err = {
    Type: "",
    Co_Name: "",
    Type_Of_Investment: "",
    Type_Of_Transaction: "",
    ISIN: "",
    Redemption_Date: "",
    Investment_Date: "",
    Fund_Received_Date: "",
    Units: "",
    Balance_Units: "",
    Weighted_Avg_Cost: "",
    Sell_Nav: "",
    Sold_Receipt: "",
    Valuation: "",
    Scheme_Name: "",
    Remark: "",
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

  const handleDateChange = (date, method) => {
    // If a date is selected, generate the current time and combine it with the selected date

    let currentDate = "";
    currentDate +=
      date.slice(8, 10) + "-" + date.slice(5, 7) + "-" + date.slice(0, 4);
    if (method === "funds") {
      setNewSellEntry({
        ...newSellEntry,
        Fund_Received_Date: currentDate,
      });
      setError((prevErrors) => ({
        ...prevErrors,
        Fund_Received_Date: "",
      }));
    } else {
      setNewSellEntry({
        ...newSellEntry,
        Redemption_Date: currentDate,
        // Read_Date: currentDate,
      });
      setError((prevErrors) => ({
        ...prevErrors,
        Redemption_Date: "",
      }));
    }
  };

  // search user data
  async function handleSearchUser() {
    try {
      let data = {
        ID: searchInput ? searchInput : 0
      };
      const result = await RestfullApiService(data, "user/GetMFsellEntry");
      setUserInfo(result?.Result?.Table1);
    } catch (error) { }
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
        Object.entries(newSellEntry).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewSellEntry(trimmedUser);
      // Perform validation
      if (newSellEntry?.Type === "") {
        errors = { ...errors, Type: "Type is required." };
      }
      if (newSellEntry?.Co_Name === "") {
        errors = { ...errors, Co_Name: "Co. name is required." };
      }
      if (newSellEntry?.Type_Of_Investment === "") {
        errors = {
          ...errors,
          Type_Of_Investment: "Type Of investment is required.",
        };
      }
      if (newSellEntry?.Type_Of_Transaction === "") {
        errors = {
          ...errors,
          Type_Of_Transaction: "Type Of Transaction is required.",
        };
      }
      if (newSellEntry?.ISIN === "") {
        errors = { ...errors, ISIN: "ISIN is required." };
      }
      if (newSellEntry?.Units === "") {
        errors = { ...errors, Units: "Units is required." };
      }
      if (newSellEntry?.Scheme_Name === "") {
        errors = { ...errors, Scheme_Name: "Scheme name is required." };
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
          ID: newSellEntry?.ID,
          Type: newSellEntry?.Type,
          PurchaseType: '',
          ReCoId: 0,
          CoId: newSellEntry?.CoId,
          TypeOfInvestment: newSellEntry?.Type_Of_Investment,
          InvestmentDate: newSellEntry?.Investment_Date,
          ISINId: newSellEntry?.ISINId,
          Units: newSellEntry?.Units,
          PurchaseCost: newSellEntry?.Valuation,
          Remarks: newSellEntry?.Remark,
          TransactionType: "Sell",
          CreatedBy: userData?.EmpCode,
          SoldReceipt: newSellEntry?.Sold_Receipt ? newSellEntry?.Sold_Receipt : 0,
          WeightedAvgCost: newSellEntry?.Weighted_Avg_Cost ? newSellEntry?.Weighted_Avg_Cost : 0,
          FundReceivedDate: newSellEntry?.Fund_Received_Date,
          SellAgainstDate: newSellEntry?.Investment_Date,
          BalanceUnits: newSellEntry?.Balance_Units,
          SellNAV: newSellEntry?.Sell_Nav ? newSellEntry?.Sell_Nav : 0,
          DpidFolioNo: '',
          StatusOfPledge: null,
          NoOfUnits: 0,
          PledgeWith: 0,
          TypeOfLienAvailed: 0,
          FundCode: ''
        }
        const result = await RestfullApiService(
          data,
          "user/SaveMFBuyEntry"
        );

        if (result?.Status === 200) {
          setAddUser(false);
          setNewSellEntry(SellEntryData);
          notify = () => toast.success(result?.Description);
        }
        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        if (isEdit) {
          setIsEdit(false);
          handleSearchUser();
        } else {
          searchInput && handleSearchUser();
        }
        handleSearchUser();

      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
      }
      notify()
    } catch (error) {
      // Handle error
    }
  }

  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "remark") {
        setNewSellEntry({ ...newSellEntry, Remark: inputValue });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };


  function handleBackButton() {
    let errors = err;
    setNewSellEntry(SellEntryData);
    setError(errors);
    setIsEdit(false);
  }

  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "units") {
        setNewSellEntry({ ...newSellEntry, Units: inputValue });
        setError({ ...error, Units: "" });
      } else if (type === 'balanceUnit') {
        setNewSellEntry({ ...newSellEntry, Balance_Units: inputValue });
      }
      else if (type === 'valuation') {
        setNewSellEntry({ ...newSellEntry, Valuation: inputValue });
      }
      else if (type === 'searchInput') {
        setSearchInput(inputValue)
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };
  const handleDecimalNumber = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^-?\d*\.?\d*$/.test(inputValue)) {
      if (type === 'sellNav') {
        setNewSellEntry({ ...newSellEntry, Sell_Nav: inputValue })
        getNav(newSellEntry?.Redemption_Date)
      }
      else if (type === 'soldReceipt') {
        setNewSellEntry({ ...newSellEntry, Sold_Receipt: inputValue })
      }
      else if (type === 'weightCost') {
        setNewSellEntry({ ...newSellEntry, Weighted_Avg_Cost: inputValue });
      }

    }
  }
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

  async function handleEditUser(user1) {
    try {
      setNewSellEntry({ ...newSellEntry, Balance_Units: user1?.['Balance Units'] })
      const data = {
        ID: user1?.ID
      }
      const result = await RestfullApiService(data, 'user/GetSingleMFBuyEntryByID')
      const user = result?.Result?.Table1[0];
      setNewSellEntry({
        ID: user?.ID,
        Type: user?.Type,
        Co_Name: user?.['CompanyName'],
        CoId: user?.CoID,
        Type_Of_Investment: user?.['TypeOfInvestment'],
        Type_Of_Transaction: user?.['TransactionType'],
        ISIN: user?.ISIN,
        ISINId: user?.ISINId,
        Redemption_Date: user?.['InvestmentDate'].slice(0, 10),
        Investment_Date: user?.['SellAgainstDate'],
        Fund_Received_Date: user?.['FundReceivedDate'].slice(0, 10),
        Units: user?.Units,
        Weighted_Avg_Cost: user?.WeightedAvgCost,
        Sell_Nav: user?.['SellNAV'],
        Sold_Receipt: user?.['SoldReceipt'],
        Valuation: user?.PurchaseCost,
        Scheme_Name: user?.['SchemeName'],
        Remark: user?.Remarks,
      })
      getSchemeName()
    } catch (error) {

    }

  }

  const getCompanyName = async () => {
    try {

      const result = await RestfullApiService({}, 'user/GetMFBuyEntryCompanyMaster');
      setCoName(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getSchemeName() {
    try {
      const data = {
        Type1: newSellEntry?.Type,
        CoId: newSellEntry?.CoId,
        TypeOfInvestment: newSellEntry?.Type_Of_Investment,
        Type: newSellEntry?.Type_Of_Transaction === 'Sell' ? 'W' : 'P'
      }
      const result = await RestfullApiService(data, 'user/GetMFSellEntrySchemeName');
      setSchemeName(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function onChangeSchemeName(value) {
    try {
      const data = {
        ISINId: value
      }
      const result = await RestfullApiService(data, 'user/GetMFBuyEntryISIN');
      const isin = result?.Result?.ISINData?.Table1[0]
      console.log(isin);
      setNewSellEntry({
        ...newSellEntry,
        Scheme_Name: value,
        ISIN: isin?.ISIN,
        ISINId: isin?.ISINId,
        Investment_Date: ''
      });
      setError({ ...error, ISIN: '' })

      getInvestmentDate(isin?.ISINId)
    } catch (error) {

    }
  }

  const getInvestmentDate = async (isin) => {
    try {
      const data = {
        Type: newSellEntry?.Type,
        CoId: newSellEntry?.CoId,
        TypeOfInvestment: newSellEntry?.Type_Of_Investment,
        ISIN: parseInt(isin)
      }
      const result = await RestfullApiService(data, 'user/GetInvestmentDatesForSellEntry');
      setInvestmentDate(result?.Result?.Table1)
    } catch (error) {

    }
  }
  const onChangeOfInvestmentDate = async (label) => {
    try {
      const data = {
        Type: newSellEntry?.Type,
        CoId: newSellEntry?.CoId,
        TypeOfInvestment: newSellEntry?.Type_Of_Investment,
        ISIN: newSellEntry?.ISINId,
        InvestmentDate: label
      }
      const result = await RestfullApiService(data, 'user/GetMFUnits')
      setNewSellEntry({
        ...newSellEntry,
        Investment_Date: label,
        Balance_Units: result?.Result?.Table1[0]?.BalanceUnit,
        BalanceUnitInitial: result?.Result?.Table1[0]?.BalanceUnit
      });
    } catch (error) {

    }
  }


  async function getNav(date) {
    try {
      if (!isEdit) {
        const data = {
          UserDate: date,
          ISIN: newSellEntry?.ISIN
        }
        const result = await RestfullApiService(data, 'user/GetNAV');
        const nav_rs = result?.Result?.Table1[0]?.NAV_RS;
        let n = 0;
        if (newSellEntry?.Units) {
          n = nav_rs * parseInt(newSellEntry?.Units);
        }
        setNewSellEntry({ ...newSellEntry, Sell_Nav: nav_rs, Valuation: n })

      }
    } catch (error) {

    } finally {

    }
  }

  async function getTotalPurchaseCost() {
    try {
      const balanceUnits = newSellEntry?.BalanceUnitInitial - newSellEntry?.Units;
      const data = {
        Type: newSellEntry?.Type,
        CoId: newSellEntry?.CoId,
        ISINid: newSellEntry?.ISINId
      }
      const result = await RestfullApiService(data, 'user/GetTotalPurchaseCost')
      const TotalBalanceUnits = result?.Result?.Table1[0]?.TotalBalanceUnits
      const TotalPurchaseCost = result?.Result?.Table1[0]?.TotalPurchaseCost
      const WeightedAvgCost = result?.Result?.Table1[0]?.WeightedAvgCost

      const weightedCost = ((TotalPurchaseCost + WeightedAvgCost) / TotalBalanceUnits) * newSellEntry?.BalanceUnitInitial
      const totalWeightedAvgCost = ((weightedCost / newSellEntry?.BalanceUnitInitial) * newSellEntry?.Units)
      setNewSellEntry({ ...newSellEntry, Weighted_Avg_Cost: totalWeightedAvgCost ? totalWeightedAvgCost : '', Balance_Units: balanceUnits })
    } catch (error) {

    }
  }
  useEffect(() => {
    getInvestmentDate(newSellEntry?.ISINId)
  }, [newSellEntry?.Scheme_Name && newSellEntry?.ISIN])

  useEffect(() => {
    if (!isEdit) {
      getTotalPurchaseCost()
    }
  }, [newSellEntry?.Sell_Nav, newSellEntry?.Units])

  useEffect(() => {
    getCompanyName()
  }, []);

  useEffect(() => {
    handleSearchUser();
  }, []);

  useEffect(() => {
    const inputFields = document.querySelectorAll("input, textarea");
    const initialValues = {};
    inputFields.forEach((input) => {
      initialValues[input.name] = input.value;
    });
    setInitialFieldValues(initialValues);
  }, []);

  useEffect(() => {
    if (newSellEntry?.Type && newSellEntry?.Co_Name && newSellEntry?.Type_Of_Investment) {
      getSchemeName()
    }
  }, [newSellEntry])

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
  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addUser ? "Sell Entry" : "Create Sell Entry"} </h2>
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
                    setAddUser(false);
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
                        (option) => option.label === newSellEntry.Type
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Type: selectedOption?.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({ ...newSellEntry, Type: "" });
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
                      Co. Name
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={coName}
                      value={coName?.find(
                        (option) => option.label === newSellEntry.Co_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Co_Name: selectedOption.label,
                            CoId: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({ ...newSellEntry, Co_Name: "" });
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
                          option.label === newSellEntry.Type_Of_Investment
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Type_Of_Investment: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({
                            ...newSellEntry,
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
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Transaction Type
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={typeOfTransaction}
                      defaultValue={typeOfTransaction[0]}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSellEntry({
                            ...newSellEntry,
                            Type_Of_Transaction: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({
                            ...newSellEntry,
                            Type_Of_Transaction: "",
                          });
                        }
                        setError({ ...error, Type_Of_Transaction: "" });
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
                    {error.Type_Of_Transaction !== "" && (
                      <p className="error-validation">
                        {error.Type_Of_Transaction}
                      </p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
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
                        (option) => option.label === newSellEntry?.Scheme_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          onChangeSchemeName(selectedOption?.value)
                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({ ...newSellEntry, Scheme_Name: "", ISIN: '', Investment_Date: '', Balance_Units: '' });
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
                      value={newSellEntry?.ISIN}
                      onChange={(e) => {
                        setNewSellEntry({
                          ...newSellEntry,
                          ISIN: e.target.value,
                        });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error?.ISIN !== "" && (
                      <p className="error-validation">{error?.ISIN}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Redemption Date
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
                        onChange={(e) => {
                          setNewSellEntry({ ...newSellEntry, Redemption_Date: e.target.value });
                        }}
                        onBlur={() => { getNav(newSellEntry?.Redemption_Date); }}
                        value={newSellEntry?.Redemption_Date}
                      />
                    </div>
                  </div>

                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Investment Date
                    </label>
                    <ReactSelect
                      options={investmentDate}
                      value={(newSellEntry?.Investment_Date === '') ? '' : investmentDate?.find(
                        (option) => option.label === newSellEntry?.Investment_Date
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          onChangeOfInvestmentDate(selectedOption.label)

                        } else {
                          // Handle the case when the field is cleared
                          setNewSellEntry({ ...newSellEntry, Investment_Date: "", Balance_Units: '' });
                        }
                        setError({ ...error, Investment_Date: "" });
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
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Fund Received Date
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
                          // handleDateChange(e.target.value, "funds")
                          setNewSellEntry({ ...newSellEntry, Fund_Received_Date: e.target.value })
                        }
                        value={newSellEntry?.Fund_Received_Date}
                      />
                    </div>
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
                      value={newSellEntry?.Units}
                      onChange={(e) => {
                        handleNumberInput(e, "units");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      onBlur={() => {
                        getNav(newSellEntry?.Redemption_Date);
                        // getTotalPurchaseCost()
                      }}
                      maxLength="50"
                    />
                    {error.Units !== "" && (
                      <p className="error-validation">{error.Units}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Balance Units
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Balance Units"
                      autoComplete="off"
                      value={newSellEntry?.Balance_Units}
                      onChange={(e) => {
                        handleNumberInput(e, "balanceUnit");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>

                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Weighted Avg. Cost
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Weighted Avg. Cost"
                      autoComplete="off"
                      value={newSellEntry?.Weighted_Avg_Cost}
                      onChange={(e) => {
                        handleDecimalNumber(e, "weightCost");
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
                      Sell Nav
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Sell Nav"
                      autoComplete="off"
                      value={newSellEntry?.Sell_Nav}
                      onChange={(e) => {
                        handleDecimalNumber(e, "sellNav");
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
                      Sold Receipt
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Sold Receipt"
                      autoComplete="off"
                      value={newSellEntry?.Sold_Receipt}
                      onChange={(e) => {
                        handleDecimalNumber(e, "soldReceipt")
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
                      Valuation
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Valuation"
                      autoComplete="off"
                      value={newSellEntry?.Valuation}
                      onChange={(e) => {
                        handleNumberInput(e, "valuation");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}

                      maxLength="50"
                    />
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>

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
                      value={newSellEntry?.Remark}
                      onChange={(e) => {
                        handleTextField(e, "remark");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {error.Remark !== "" && (
                      <p className="error-validation">{error.Remark}</p>
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
                              Sell Entry ID
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="Sell Entry ID"
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
                          <SellEntryGrid
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

export default SellEntry;
