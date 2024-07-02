import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import { RestfullApiService } from "../../../../config/Api's";
import CreateBGGrid from "../../../Grids/TreasuryGrids/Transaction/BGModuleGrids/CreateBGGrid";


const bGReplicationCount = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
  {
    label: "5",
    value: "5",
  },
  {
    label: "6",
    value: "6",
  },
  {
    label: "7",
    value: "7",
  },
  {
    label: "8",
    value: "8",
  },
  {
    label: "9",
    value: "9",
  },
  {
    label: "10",
    value: "10",
  },
  {
    label: "11",
    value: "11",
  },
  {
    label: "12",
    value: "12",
  },
  {
    label: "13",
    value: "13",
  },
  {
    label: "14",
    value: "14",
  },
  {
    label: "15",
    value: "15",
  },
  {
    label: "16",
    value: "16",
  },
  {
    label: "17",
    value: "17",
  },
  {
    label: "18",
    value: "18",
  },
  {
    label: "19",
    value: "19",
  },
  {
    label: "20",
    value: "20",
  },
]
const FdTransactionData = {
  Entity: '',
  Entity_Id: 0,
  Bank_Name: '',
  Bank_Name_Id: 0,
  Bank_Branch: '',
  Bank_Branch_Id: 0,
  BG_No: '',
  Issued_To: '',
  Purpose: '',
  BG_Amt: '',
  Effective_Date: '',
  Expiry_Date: '',
  Withdrawal_Date: '',
  Status: '',
  Tenure: '',
  Rating_Recd: '',
  FD_Amt: '',
  Debit_Account_No: '',
  Commission: '',
  Commission_Charges: '',
  GST_Amt: '',
  Other_Charges: '',
  Total_Charges: '',
  BG_Scan_Upload: '',
  Invoice_Copy: '',
  BG_Replication_count: '',
  Approved_Reject_Reason: '',
  Prematured_BG_Rate: '',
  Prematurity_Date: '',
  Remarks: ''
};
const err = {
  Entity: '',
  Bank_Name: '',
  Bank_Branch: '',
  BG_No: '',
  Issued_To: '',
  Purpose: '',
  BG_Amt: '',
  Effective_Date: '',
  Expiry_Date: '',
  Withdrawal_Date: '',
  Status: '',
  Rating_Recd: '',
  FD_Amt: '',
  Debit_Account_No: '',
  Commission: '',
  Approved_Reject_Reason: '',
  Prematured_BG_Rate: '',
  Prematurity_Date: '',
};
const actions = [
  {
    label: 'Pending With Maker',
    value: 'Pending With Maker'
  },
  {
    label: 'Pending With Checker',
    value: 'Pending With Checker'
  },
  {
    label: 'Approved',
    value: 'Approved'
  },
  {
    label: 'Rejected',
    value: 'Rejected'
  },
]
const CreateBG = ({ props }) => {
  const [searchInput, setSearchInput] = useState('');
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [bankNames, setBankNames] = useState([]);
  const [bankBranches, setBankBranches] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [issuedTo, setIssuedTo] = useState([]);

  const [entityList, setEntityList] = useState([]);
  const [status, setStatus] = useState([]);
  const [action, setAction] = useState('');

  const fileInputRef = useRef(null);


  const [newBGTransactionEntry, setNewBGTransactionEntry] =
    useState(FdTransactionData);


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
    let notify = null;
    if (isEdit) {
      notify = () => toast.success("User updated successfully.");
    } else {
      notify = () => toast.success("User created successfully.");
    }
    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newBGTransactionEntry).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewBGTransactionEntry(trimmedUser);
      // Perform validation
      if (newBGTransactionEntry?.Entity === "" && newBGTransactionEntry?.Entity_Id === 0) {
        errors = { ...errors, Entity: "Please Select Entity." };
      }
      if (newBGTransactionEntry?.Bank_Name === "" && newBGTransactionEntry?.Bank_Name_Id === 0) {
        errors = { ...errors, Bank_Name: "Please Select Bank Name." };
      }
      if (newBGTransactionEntry?.Bank_Branch === "" && newBGTransactionEntry?.Bank_Branch_Id === 0) {
        errors = {
          ...errors,
          Bank_Branch: "Please Select Bank Branch.",
        };
      }
      if (newBGTransactionEntry?.BG_No === "") {
        errors = { ...errors, BG_No: "Please Enter BG No." };
      }

      if (newBGTransactionEntry?.Issued_To === "") {
        errors = {
          ...errors,
          Issued_To: "Please Select Issued To.",
        };
      }
      if (newBGTransactionEntry?.Purpose === "") {
        errors = { ...errors, Purpose: "Please Select Purpose." };
      }
      if (newBGTransactionEntry?.BG_Amt === "") {
        errors = { ...errors, BG_Amt: "Please Enter BG Amt." };
      }
      if (newBGTransactionEntry?.Effective_Date === "") {
        errors = {
          ...errors,
          Effective_Date: "Please Enter Effective Date.",
        };
      }
      if (newBGTransactionEntry?.Expiry_Date === "") {
        errors = {
          ...errors,
          Expiry_Date: "Please Enter Expiry Data.",
        };
      }
      if (newBGTransactionEntry?.Withdrawal_Date === "") {
        errors = {
          ...errors,
          Withdrawal_Date: "Please Enter Withdrawal Date.",
        };
      }
      if (newBGTransactionEntry?.Status === "") {
        errors = { ...errors, Status: "Please Select Status." };
      }

      if (newBGTransactionEntry?.Rating_Recd === "") {
        errors = { ...errors, Rating_Recd: "Please Enter Rating Recd." };
      }
      if (newBGTransactionEntry?.FD_Amt === "") {
        errors = { ...errors, FD_Amt: "Please Enter FD Amt." };
      }
      if (newBGTransactionEntry?.Debit_Account_No === "") {
        errors = { ...errors, Debit_Account_No: "Please Enter Debit Account No." };
      }

      if (newBGTransactionEntry?.Commission === "") {
        errors = { ...errors, Commission: "Please Enter Commission." };
      }

      if (newBGTransactionEntry?.Prematured_BG_Rate === "") {
        errors = {
          ...errors,
          Prematured_BG_Rate: "Please Enter Prematured BG Rate.",
        };
      }
      if (newBGTransactionEntry?.Prematurity_Date === "") {
        errors = {
          ...errors,
          Prematurity_Date: "Please Enter Prematured Date.",
        };
      }
      if (newBGTransactionEntry?.Approved_Reject_Reason === "") {
        errors = {
          ...errors,
          Approved_Reject_Reason: "Please Enter Approved Reject Reason.",
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
        const data = {

          BG_ID: 0,
          EntityId: newBGTransactionEntry?.Entity_Id,
          BankName: newBGTransactionEntry?.Bank_Name,
          BankBranchId: newBGTransactionEntry?.Bank_Branch_Id,
          BG_No: newBGTransactionEntry?.BG_No,
          BG_Amt: newBGTransactionEntry?.BG_Amt,
          Segement: newBGTransactionEntry?.Issued_To,
          Purpose: newBGTransactionEntry?.Purpose,
          EffectiveDate: newBGTransactionEntry?.Effective_Date,
          ExpiryDate: newBGTransactionEntry?.Expiry_Date,
          WithdrawalDate: newBGTransactionEntry?.Withdrawal_Date,
          TenureInDays: newBGTransactionEntry?.Tenure,
          Status: newBGTransactionEntry?.Status,
          Fd_Margin: "",
          FDNo: "",
          FDAmt: newBGTransactionEntry?.FD_Amt,
          RatingRecd: newBGTransactionEntry?.Rating_Recd,
          DebitAccountNo: newBGTransactionEntry?.Debit_Account_No,
          Commission: newBGTransactionEntry?.Commission,
          CommissionCharges: newBGTransactionEntry?.Commission_Charges,
          GSTAmt: newBGTransactionEntry?.GST_Amt,
          OtherCharges: newBGTransactionEntry?.Other_Charges,
          TotalCharges: newBGTransactionEntry?.Total_Charges,
          CreatedBy: "",
          Action: "",
          BGScanCopy: 'D:\\Treasury\\Transactions\\FileUpload' + (newBGTransactionEntry?.BG_Scan_Upload).slice(11),
          InvoiceCopy: 'D:\\Treasury\\Transactions\\FileUpload' + (newBGTransactionEntry?.Invoice_Copy).slice(11),
          PreMaturedFDRate: newBGTransactionEntry?.Prematured_BG_Rate,
          PreMaturityDate: newBGTransactionEntry?.Prematurity_Date,
          ReplicateBGCount: 0,
          Remark: newBGTransactionEntry?.Remarks,
          SourceOfFund: "",
          ApprovedRejectReason: newBGTransactionEntry?.Approved_Reject_Reason,
          ExchangeBenifitRemoval: ""

        }
        const result = await RestfullApiService(
          data,
          "user/SaveBGTransctionCreateBG"
        );

        if (result.Status === 200) {
          notify();
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
        setNewBGTransactionEntry(FdTransactionData);
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
        notify();
      }
    } catch (error) {
      // Handle error
    }
  }

  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "Approved_Reject_Reason") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Approved_Reject_Reason: inputValue,
        });
        setError({ ...error, Approved_Reject_Reason: "" });
      } else if (type === 'Remarks') {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Remarks: inputValue,
        });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };


  function handleBackButton() {
    let errors = err;
    setNewBGTransactionEntry(FdTransactionData);
    setError(errors);
    setIsEdit(false);
  }

  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "bg_no") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          BG_No: inputValue,
        });
        setError({ ...error, BG_No: "" });
      }
      else if (type === "bg_amt") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          BG_Amt: inputValue,
        });
        setError({ ...error, BG_Amt: "" });
      }
      else if (type === "tenure") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Tenure: inputValue,
        });
      }
      else if (type === "rating_recd") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Rating_Recd: inputValue,
        });
        setError({ ...error, Rating_Recd: "" });
      }
      else if (type === "fd_amt") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          FD_Amt: inputValue,
        });
        setError({ ...error, FD_Amt: "" });
      }
      else if (type === "commission") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Commission: inputValue,
        });
        setError({ ...error, Commission: "" });
      }
      else if (type === "commission_charges") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Commission_Charges: inputValue,
        });
      }
      else if (type === "gst_amt") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          GST_Amt: inputValue,
        });
      }
      else if (type === "other_charges") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Other_Charges: inputValue,
        });
      }
      else if (type === "total_charges") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Total_Charges: inputValue,
        });
      }
      else if (type === "prematured_bg_rate") {
        setNewBGTransactionEntry({
          ...newBGTransactionEntry,
          Prematured_BG_Rate: inputValue,
        });
        setError({ ...error, Prematured_BG_Rate: '' })
      }

    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  const handleDeleteUser = async (user) => {
    let notify = null;
    try {
      let data = {
        BG_ID: user?.BG_ID
      };
      // API call
      const result = await RestfullApiService(data, "user/DeleteBGTransctionCreateBG");
      if (result?.Status === 200) {
        notify = () => toast.success(result?.Description);
      }
      handleSearchUser();
      notify()
    } catch (error) { }
  };

  const handleSearchUser = async () => {
    try {
      const data = {
        BGNo: searchInput ? searchInput : '',
        Action: action ? action : ''
      }
      const result = await RestfullApiService(data, 'user/GetBGTransactionsCreateBG');
      setUserInfo(result?.Result?.Table1);
    } catch (error) {

    }
  }

  async function handleEditUser(user) {
    try {

      const data = {
        BG_ID: user?.BG_ID
      }
      const result = await RestfullApiService(data, 'user/GetSingleBGTransctionDataByID')
      const val = result?.Result?.Table1[0];
      setNewBGTransactionEntry({
        ...newBGTransactionEntry,
        Entity: '',
        Entity_Id: val?.EntityId,
        Bank_Name: '',
        Bank_Name_Id: val?.BankId,
        Bank_Branch: '',
        Bank_Branch_Id: val?.BankBranchId,
        BG_No: val?.BG_No,
        Issued_To: val?.SegmentId,
        Purpose: val?.Purpose_ID,
        BG_Amt: val?.BGAmt,
        Effective_Date: val?.EffectiveDate?.slice(0, 10),
        Expiry_Date: val?.ExpiryDate?.slice(0, 10),
        Withdrawal_Date: val?.WithdrawalDate?.slice(0, 10),
        Status: val?.Status,
        Tenure: val?.TenureInDays,
        Rating_Recd: val?.RatingRecd,
        FD_Amt: val?.FDAmt,
        Debit_Account_No: val?.DebitAccountNo,
        Commission: val?.Commission,
        Commission_Charges: val?.CommissionCharges,
        GST_Amt: val?.GSTAmt,
        Other_Charges: val?.OtherCharges,
        Total_Charges: val?.TotalCharges,
        BG_Scan_Upload: val?.BG_ScanCopyUpload,
        Invoice_Copy: val?.GSTInvoiceCopy,
        BG_Replication_count: '',
        Approved_Reject_Reason: val?.ApprovedRejectReason,
        Prematured_BG_Rate: val?.PreMaturedFDRate,
        Prematurity_Date: val?.PreMaturityDate?.slice(0, 10),
        Remarks: val?.Remark
      })
      console.log(newBGTransactionEntry);
    } catch (error) {

    }
  }

  async function getEntity() {
    try {
      const result = await RestfullApiService('', 'user/DDLFDTransactionsCoName')
      setEntityList(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getBankNames() {
    try {
      const data = {
        Type: 'bank',
        id: 0
      }
      const result = await RestfullApiService(data, 'user/DDLFDTransactionsBankName')
      setBankNames(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getBankBranchNames() {
    try {
      const result = await RestfullApiService('', 'user/DDLFDTransactionsBranchName')
      setBankBranches(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getPurposeList() {
    try {
      const data = {
        Type: 'Purpose',
        id: 0
      }
      const result = await RestfullApiService(data, 'user/DDLFDTransactionsPurpose')
      setPurpose(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getIssuedTo() {
    try {
      const data = {
        Type: 'Segment',
        id: 0
      }
      const result = await RestfullApiService(data, 'user/DDLFDTransactionsSegment')
      setIssuedTo(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getStatusList() {
    try {
      const data = {
        Type: 'Status',
        id: 0
      }
      const result = await RestfullApiService(data, 'user/DDLFDTransactionsStatus')
      setStatus(result?.Result?.Table1)
    } catch (error) {

    }
  }
  function handleFileUpload(e, type) {
    if (type === 'Invoice_Copy') {
      setNewBGTransactionEntry({ ...newBGTransactionEntry, Invoice_Copy: e.target.value })
    } else if (type === 'BG_Scan_Upload') {
      setNewBGTransactionEntry({ ...newBGTransactionEntry, BG_Scan_Upload: e.target.value })
    }

  }
  useEffect(() => {
    handleSearchUser();
    getBankNames()
    getBankBranchNames()
    getEntity()
    getIssuedTo()
    getPurposeList()
    getStatusList()
  }, []);

  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{!addUser ? "Create BG" : "Create BG"} </h2>
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
                      Entity
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={entityList}
                      value={entityList?.find(
                        (option) =>
                          option.value == newBGTransactionEntry?.Entity_Id
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Entity: selectedOption?.label,
                            Entity_Id: selectedOption?.value
                          })
                        } else {
                          // Handle the case when the field is cleared
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Entity: "",
                            Entity_Id: 0
                          });
                        }
                        setError({ ...error, Entity: "" });
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
                    {error.Entity !== "" && (
                      <p className="error-validation">{error.Entity}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Bank Name
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={bankNames}
                      value={bankNames?.find(
                        (option) =>
                          option.value === newBGTransactionEntry?.Bank_Name_Id
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Bank_Name: selectedOption.label,
                            Bank_Name_Id: selectedOption.value
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Bank_Name: "",
                            Bank_Name_Id: 0
                          });
                        }
                        setError({ ...error, Bank_Name: "" });
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
                    {error.Bank_Name !== "" && (
                      <p className="error-validation">{error.Bank_Name}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Bank Branch
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={bankBranches}
                      value={bankBranches?.find(
                        (option) =>
                          option.value === newBGTransactionEntry?.Bank_Branch_Id
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Bank_Branch: selectedOption?.label,
                            Bank_Branch_Id: selectedOption?.value
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Bank_Branch: "",
                            Bank_Branch_Id: 0,
                          });
                        }
                        setError({ ...error, Bank_Branch: "" });
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
                    {error.Bank_Branch !== "" && (
                      <p className="error-validation">{error.Bank_Branch}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      BG No. <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Bg no"
                      autoComplete="off"
                      value={newBGTransactionEntry?.BG_No}
                      onChange={(e) => {
                        handleNumberInput(e, 'bg_no')
                      }}
                      maxLength="50"
                    />
                    {error?.BG_No !== "" && (
                      <p className="error-validation">{error?.BG_No}</p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Issued To
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={issuedTo}
                      value={issuedTo?.find(
                        (option) =>
                          option.value === newBGTransactionEntry?.Issued_To
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Issued_To: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Issued_To: "",
                          });
                        }
                        setError({ ...error, Issued_To: "" });
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
                    {error?.Issued_To !== "" && (
                      <p className="error-validation">{error?.Issued_To}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Purpose
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={purpose}
                      value={purpose?.find(
                        (option) =>
                          option.value === newBGTransactionEntry?.Purpose
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Purpose: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Purpose: "",
                          });
                        }
                        setError({ ...error, Purpose: "" });
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
                    {error.Purpose !== "" && (
                      <p className="error-validation">{error.Purpose}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      BG Amt.
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="BG Amt."
                      autoComplete="off"
                      value={newBGTransactionEntry?.BG_Amt}
                      onChange={(e) => {
                        handleNumberInput(e, 'bg_amt');
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                    {error.BG_Amt !== "" && (
                      <p className="error-validation">{error.BG_Amt}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Effective Date
                      <span className="text-danger">*</span>
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
                          setNewBGTransactionEntry({ ...newBGTransactionEntry, Effective_Date: e.target.value });
                          setError({ ...error, Effective_Date: '' })
                          setIsRefreshed(true);
                        }}
                        value={newBGTransactionEntry?.Effective_Date}
                      />
                    </div>

                    {error?.Effective_Date && (
                      <div className="error-validation">{error?.Effective_Date}</div>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Expiry Date
                      <span className="text-danger">*</span>
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
                          setNewBGTransactionEntry({ ...newBGTransactionEntry, Expiry_Date: e.target.value })
                          setError({ ...error, Expiry_Date: '' })
                          setIsRefreshed(true);
                        }}
                        value={newBGTransactionEntry?.Expiry_Date}
                      />
                    </div>

                    {error?.Expiry_Date && (
                      <div className="error-validation">{error?.Expiry_Date}</div>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Withdrawal Date
                      <span className="text-danger">*</span>
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
                          setNewBGTransactionEntry({ ...newBGTransactionEntry, Withdrawal_Date: e.target.value })
                          setError({ ...error, Withdrawal_Date: '' })
                          setIsRefreshed(true);
                        }}
                        value={newBGTransactionEntry?.Withdrawal_Date}
                      />
                    </div>

                    {error.Withdrawal_Date && (
                      <div className="error-validation">{error.Withdrawal_Date}</div>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Status
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={status}
                      value={status?.find(
                        (option) =>
                          option.label === newBGTransactionEntry?.Status
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            Status: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
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
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Tenure (in days)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Tenture"
                      autoComplete="off"
                      value={newBGTransactionEntry?.Tenure}
                      onChange={(e) => {
                        handleNumberInput(e, "tenure");
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                    {error.Tenure !== "" && (
                      <p className="error-validation">
                        {error.Tenure}
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
                      Rating Recd
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Rating Recd"
                      autoComplete="off"
                      value={newBGTransactionEntry?.Rating_Recd}
                      onChange={(e) => {
                        handleNumberInput(e, "rating_recd");
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                    {error.Rating_Recd !== "" && (
                      <p className="error-validation">{error.Rating_Recd}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      FD Amt.
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="FD Amt."
                      value={newBGTransactionEntry?.FD_Amt}
                      onChange={(e) => {
                        handleNumberInput(e, "fd_amt");
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                    {error.FD_Amt !== "" && (
                      <p className="error-validation">{error.FD_Amt}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Debit Account No.
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Debit Account No."
                      value={newBGTransactionEntry?.Debit_Account_No}
                      onChange={(e) => {
                        setNewBGTransactionEntry({ ...newBGTransactionEntry, Debit_Account_No: e.target.value })
                        setError({ ...error, Debit_Account_No: '' })
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Debit_Account_No !== "" && (
                      <p className="error-validation">{error.Debit_Account_No}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Commission(%)
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Commission(%)"
                      value={newBGTransactionEntry?.Commission}
                      onChange={(e) => {
                        handleNumberInput(e, "commission");
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                    {error?.Commission !== "" && (
                      <p className="error-validation">{error?.Commission}</p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Commission Charges(%)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      value={newBGTransactionEntry?.Commission_Charges}
                      onChange={(e) => {
                        handleNumberInput(e, "commission_charges");
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      GST Amt.
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="GST Amt."
                      autoComplete="off"
                      value={newBGTransactionEntry?.GST_Amt}
                      onChange={(e) => {
                        handleNumberInput(e, "gst_amt");
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Other Charges(%)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Other Charges(%)"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      value={newBGTransactionEntry?.Other_Charges}
                      onChange={(e) => {
                        handleNumberInput(e, "other_charges");
                        // Set isRefreshed to true to indicate unsaved changes
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Total Charges(%)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      value={newBGTransactionEntry?.Total_Charges}
                      onChange={(e) => {
                        handleNumberInput(e, "total_charges");
                        // Set isRefreshed to true to indicate unsaved changes
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
                      BG Scan Upload
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      // value={newBGTransactionEntry?.BG_Scan_Upload}
                      ref={fileInputRef}
                      onChange={(e) => {
                        // Set isRefreshed to true to indicate unsaved changes
                        handleFileUpload(e, 'BG_Scan_Upload')
                        setIsRefreshed(true);
                      }}
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Invoice Copy
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      ref={fileInputRef}
                      // value={newBGTransactionEntry?.Invoice_Copy}
                      onChange={(e) => {
                        handleFileUpload(e, 'Invoice_Copy')
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      BG Replication Count
                    </label>
                    <ReactSelect
                      options={bGReplicationCount}
                      value={bGReplicationCount?.find(
                        (option) =>
                          option.value === newBGTransactionEntry?.BG_Replication_count
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            BG_Replication_count: selectedOption?.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewBGTransactionEntry({
                            ...newBGTransactionEntry,
                            BG_Replication_count: "",
                          });
                        }
                        setError({ ...error, BG_Replication_count: "" });
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
                    {error?.BG_Replication_count !== "" && (
                      <p className="error-validation">{error?.BG_Replication_count}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Approved/Reject Reason
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Approved/Reject Reason"
                      autoComplete="off"
                      value={newBGTransactionEntry?.Approved_Reject_Reason}
                      onChange={(e) => {
                        handleTextField(e, "Approved_Reject_Reason");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error?.Approved_Reject_Reason !== "" && (
                      <p className="error-validation">{error?.Approved_Reject_Reason}</p>
                    )}
                  </div>

                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>

                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Prematured BG Rate
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Prematured BG Rate"
                      autoComplete="off"
                      value={newBGTransactionEntry?.Prematured_BG_Rate}
                      onChange={(e) => {
                        handleNumberInput(e, "prematured_bg_rate");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {error?.Prematured_BG_Rate !== "" && (
                      <p className="error-validation">
                        {error?.Prematured_BG_Rate}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Prematurity Date
                      <span className="text-danger">*</span>
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
                          setNewBGTransactionEntry({ ...newBGTransactionEntry, Prematurity_Date: e.target.value })
                          setError({ ...error, Prematurity_Date: '' })
                          setIsRefreshed(true);
                        }}
                        value={newBGTransactionEntry?.Prematurity_Date}
                      />
                    </div>

                    {error?.Prematurity_Date && (
                      <div className="error-validation">{error?.Prematurity_Date}</div>
                    )}
                  </div>

                </div>
                <div className="col-lg-6 col-md-6  form-group mb-0">
                  <label
                    className="form-label global-label-tag"
                    htmlFor="ddlAddSecurityCategory"
                  >
                    Remarks
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="txtAddSecurityName"
                    placeholder="Remarks"
                    autoComplete="off"
                    value={newBGTransactionEntry?.Remarks}
                    onChange={(e) => {
                      handleTextField(e, "Remarks");
                      // Set isRefreshed to true to indicate unsaved changes
                      setIsRefreshed(true);
                    }}
                  />
                  {error?.Remarks !== "" && (
                    <p className="error-validation">
                      {error?.Remarks}
                    </p>
                  )}
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
                              BG No
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="BG No"
                              autoComplete="off"
                              defaultValue={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                            />
                            {error?.FD_No !== "" ? (
                              <p
                                className="error-validation"
                                style={{ fontWeight: "600" }}
                              >
                                {error?.FD_No}
                              </p>
                            ) : (
                              <p
                                className="error-validation"
                                style={{ fontWeight: "600" }}
                              ></p>
                            )}
                          </div>
                          <div className="col-lg-4 col-md-4  form-group mb-0">
                            <label
                              className="form-label-small global-label-tag"
                              htmlFor="txtSearchSecurity"
                            >
                              Action
                            </label>
                            <ReactSelect
                              options={actions}
                              value={actions?.find(
                                (option) =>
                                  option.label == action
                              )}
                              isClearable
                              onChange={(selectedOption) => {
                                if (selectedOption) {
                                  setAction(selectedOption?.label)
                                } else {
                                  // Handle the case when the field is cleared
                                  setAction('');
                                }
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
                          <div className="col-lg-4 col-md-4">
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
                          <CreateBGGrid
                            userInfo={userInfo}
                            handleEditUser={handleEditUser}
                            setAddUser={setAddUser}
                            setIsEdit={setIsEdit}
                            handleDeleteUser={handleDeleteUser}
                            action={action}
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

export default CreateBG;
