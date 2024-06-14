import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import CreateFdGrid from "../../../Grids/TreasuryGrids/Transaction/FDModuleGrids/CreateFdGrid";
import { getUserDataFromStorage } from "../../../../config/service";
import { useRef } from "react";
import { Link } from "react-router-dom";

const FDType = [
  {
    label: "Callable-Physical",
    value: "1",
  },
  {
    label: "Non Callable-Physical",
    value: "2",
  },
  {
    label: "Callable-E-FDR",
    value: "3",
  },
  {
    label: "Non Callable-E-FDR",
    value: "4",
  },
];

const FdInterestType = [
  {
    label: "Simple",
    value: "0",
  },
  {
    label: "Cumulative",
    value: "1",
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
const sourceOfFund = [
  {
    label: "Own",
    value: "1",
  },
  {
    label: "Client",
    value: "2",
  },
];
const fdReplicationCount = [
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
  Co_Name: "",
  FD_Favouring: "",
  Type_Of_FD: "",
  Bank_Name: "",
  Bank_Branch: "",
  Customer_ID: "",
  FD_No: "",
  FD_Amt: "",
  FD_Rate: "",
  FD_Interest_Tpye: "",
  Interest_Term: "",
  FD_Debit_Acc_No: "",
  From_Date: "",
  Tenure: '',
  Maturity_Date: "",
  Purpose: "",
  Purpose_Id: 0,
  Segment: "",
  Segment_Id: '',
  FD_Initiator_name_Team: "",
  FD_Replication_Count: "",
  File_Upload: "",
  Prematured_FD_Rate: "",
  Prematurity_Date: "",
  Status: "",
  Remark: "",
  Source_of_Fund: "",
  Approved_Reject_Reason: "",
};
const CreateFD = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [coName, setCoName] = useState([]);
  const [bankNames, setBankNames] = useState([]);
  const [bankBranches, setBankBranches] = useState([]);
  const [interestTerm, setInterestTerm] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [segment, setSegment] = useState([]);
  // const [fdReplicationCount, setFdReplicationCount] = useState([]);
  const [status, setStatus] = useState([]);
  const fileInputRef = useRef(null);


  const [newFdTransactionEntry, setNewFdTransactionEntry] =
    useState(FdTransactionData);
  const err = {
    Co_Name: "",
    Type_Of_FD: "",
    Bank_Name: "",
    Bank_Branch: "",
    FD_No: "",
    FD_Amt: "",
    FD_Rate: "",
    FD_Interest_Tpye: "",
    Interest_Term: "",
    From_Date: "",
    Tenure: "",
    Maturity_Date: "",
    Purpose: "",
    Segment: "",
    FD_Replication_Count: "",
    Prematured_FD_Rate: "",
    Prematurity_Date: "",
    Source_of_Fund: "",
    Approved_Reject_Reason: "",
  };
  const userData = getUserDataFromStorage();


  const handleDateChange = (date) => {
    // If a date is selected, generate the current time and combine it with the selected date

    let currentDate = "";
    currentDate +=
      date.slice(8, 10) + "-" + date.slice(5, 7) + "-" + date.slice(0, 4);

    setNewFdTransactionEntry({
      ...newFdTransactionEntry,
      Investment_Date: currentDate,
      // Read_Date: currentDate,
    });
    setError((prevErrors) => ({
      ...prevErrors,
      Investment_Date: "",
    }));
  };

  // search user data
  async function handleSearchUser() {
    try {
      setError({});

      let data = {
        FDNo: searchInput ? searchInput : ''
      };
      const result = await RestfullApiService(data, "user/GetFDTransactionsCreateFD");
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
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newFdTransactionEntry).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewFdTransactionEntry(trimmedUser);
      // Perform validation
      if (newFdTransactionEntry?.Co_Name === "") {
        errors = { ...errors, Co_Name: "Co. name is required." };
      }
      if (newFdTransactionEntry?.Type_Of_FD === "") {
        errors = { ...errors, Type_Of_FD: "Type Of FD is required." };
      }
      if (newFdTransactionEntry?.Bank_Name === "") {
        errors = { ...errors, Bank_Name: "Bank Name is required." };
      }
      if (newFdTransactionEntry?.Bank_Branch === "") {
        errors = {
          ...errors,
          Bank_Branch: "Bank Branch is required.",
        };
      }

      if (newFdTransactionEntry?.FD_No === "") {
        errors = {
          ...errors,
          FD_No: "FD No is required.",
        };
      }
      if (newFdTransactionEntry?.FD_Amt === "") {
        errors = { ...errors, FD_Amt: "FD Amt is required." };
      }
      if (newFdTransactionEntry?.FD_Rate === "") {
        errors = { ...errors, FD_Rate: "FD Rate is required." };
      }
      if (newFdTransactionEntry?.FD_Interest_Tpye === "") {
        errors = {
          ...errors,
          FD_Interest_Tpye: "FD Interest Tpye is required.",
        };
      }
      if (newFdTransactionEntry?.Interest_Term === "") {
        errors = { ...errors, Interest_Term: "Interest Term is required." };
      }
      if (newFdTransactionEntry?.From_Date === "") {
        errors = { ...errors, From_Date: "From Date is required." };
      }
      if (newFdTransactionEntry?.Tenure === "") {
        errors = { ...errors, Tenure: "Tenure is required." };
      }
      if (newFdTransactionEntry?.Maturity_Date === "") {
        errors = { ...errors, Maturity_Date: "Maturity Date is required." };
      }
      if (newFdTransactionEntry?.Purpose === "") {
        errors = { ...errors, Purpose: "Purpose is required." };
      }
      if (newFdTransactionEntry?.Segment === "") {
        errors = { ...errors, Segment: "Segment is required." };
      }
      if (newFdTransactionEntry?.FD_Replication_Count === "") {
        errors = {
          ...errors,
          FD_Replication_Count: "FD Replication Count is required.",
        };
      }
      if (newFdTransactionEntry?.Prematured_FD_Rate === "") {
        errors = {
          ...errors,
          Prematured_FD_Rate: "Prematured FD Rate is required.",
        };
      }
      if (newFdTransactionEntry?.Prematurity_Date === "") {
        errors = {
          ...errors,
          Prematurity_Date: "Prematurity Date is required.",
        };
      }
      if (newFdTransactionEntry?.Source_of_Fund === "") {
        errors = { ...errors, Source_of_Fund: "Source of Fund is required." };
      }
      if (newFdTransactionEntry?.Approved_Reject_Reason === "") {
        errors = {
          ...errors,
          Approved_Reject_Reason: "Approved Reject Reason is required.",
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
          FDInt_ID: 0,
          Co_Name: newFdTransactionEntry?.Co_Name?.toString(),
          TypeofFD: newFdTransactionEntry?.Type_Of_FD,
          ClientCode: "",
          RMName: "",
          RMEmail_ID: "",
          BankName: newFdTransactionEntry?.Bank_Name,
          CustomerId: newFdTransactionEntry?.Customer_ID,
          FD_No: newFdTransactionEntry?.FD_No,
          FDAmt: newFdTransactionEntry?.FD_Amt,
          FDRate: newFdTransactionEntry?.FD_Rate,
          FDInt_Type: newFdTransactionEntry?.FD_Interest_Tpye,
          InterestTerm: newFdTransactionEntry?.Interest_Term,
          PreMaturedFDRate: newFdTransactionEntry?.Prematured_FD_Rate,
          DebitBankAccn: newFdTransactionEntry?.FD_Debit_Acc_No,
          FromDate: newFdTransactionEntry?.From_Date,
          MaturityDate: newFdTransactionEntry?.Maturity_Date,
          PreMaturityDate: newFdTransactionEntry?.Prematurity_Date,
          Exchange: newFdTransactionEntry?.Purpose,
          Exch_ID: newFdTransactionEntry?.Purpose_Id,
          Segement: newFdTransactionEntry?.Segment,
          Seg_ID: newFdTransactionEntry?.Segment_Id,
          TypeofLien: "",
          FDScanCopy: 'D:\\Treasury\\Transactions\\FileUpload' + (newFdTransactionEntry?.File_Upload).slice(11),
          Remarks: newFdTransactionEntry?.Remark,
          Status: newFdTransactionEntry?.Status,
          CreatedBy: userData?.EmpID,
          AddBankGuarantee: "",
          BankBranchId: 0,
          TenureInDays: newFdTransactionEntry?.Tenure,
          FDInitiatorTeam: newFdTransactionEntry?.FD_Initiator_name_Team,
          FDFavouring: newFdTransactionEntry?.FD_Favouring,
          ReplicateFDCount: newFdTransactionEntry?.FD_Replication_Count,
          Action: "Pending With Maker",
          SourceOfFund: newFdTransactionEntry?.Source_of_Fund
        }
        const result = await RestfullApiService(
          data,
          "user/SaveFDTransctionCreateFD"
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
        } else {
          searchInput && handleSearchUser();
        }
        handleSearchUser();
        setNewFdTransactionEntry(FdTransactionData);
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
      if (type === "FD_No") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          FD_No: inputValue,
        });
        setError({ ...error, FD_No: "" });
      }

      else if (type === "FD_Initiator_name_Team") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          FD_Initiator_name_Team: e.target.value,
        });
        setError({ ...error, FD_Initiator_name_Team: "" });
      }

      else if (type === "Remark") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          Remark: e.target.value,
        });
        setError({ ...error, Remark: "" });
      }
      else if (type === "ApprovedReason") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          Approved_Reject_Reason: e.target.value,
        });
        setError({ ...error, Approved_Reject_Reason: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  function handleBackButton() {
    let errors = err;
    setNewFdTransactionEntry(FdTransactionData);
    setError(errors);
    setIsEdit(false);
  }

  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "FD_Amt") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          FD_Amt: inputValue,
        });
        setError({ ...error, FD_Amt: "" });
      }
      else if (type === "FD_Rate") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          FD_Rate: inputValue,
        });
        setError({ ...error, FD_Rate: "" });
      }
      else if (type === "FD_Debit_ACC_No") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          FD_Debit_Acc_No: inputValue,
        });
        setError({ ...error, FD_Debit_Acc_No: "" });
      }
      else if (type === "Prematured_FD_Rate") {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          Prematured_FD_Rate: inputValue,
        });
        setError({ ...error, Prematured_FD_Rate: "" });
      }
      else if (type === 'Tenure') {
        setNewFdTransactionEntry({
          ...newFdTransactionEntry,
          Tenure: inputValue,
        });
        setError({ ...error, Tenure: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  const handleDeleteUser = async (user) => {
    const notify = () => toast.success("User deleted successfully.");
    try {
      let data = {
        //   Org_Id: userData?.OrgId,
        //   Method_Name: "Delete",
        //   Login_User_Id: userData?.UserId,
        //   User_Id: user.User_Id,
        //   User_Name: "",
        //   UserType_Id: 0,
        //   User_Password: "",
        //   Employee_Id: "",
        //   User_Display_Name: "",
        //   Role_Id: "",
        //   Is_Employee: -1,
        //   Designation: "",
        //   Mobile: "",
        //   Landline: "",
        //   Email: "",
        //   Is_Active: 1,
      };
      // API call
      const result = await RestfullApiService(data, "master/SaveUserMaster");
      if (result.Status === 200) {
        notify();
      }
      handleSearchUser();
    } catch (error) { }
  };

  async function handleEditUser(user) {

    try {
      const data = {
        FDID: user?.FDID
      }
      // debugger
      const result = await RestfullApiService(data, 'user/GetSingleFDTransctionDataByID')
      const val = result?.Result?.Table1[0]
      console.log(val);
      const filepath = val?.FDScanCopy?.split('\\');
      const filename = filepath[filepath.length - 1];
      setNewFdTransactionEntry({
        ...newFdTransactionEntry,
        Co_Name: val?.CoName,
        FD_Favouring: val?.FDFavouring,
        Type_Of_FD: val?.TypeofFD,
        Bank_Name: val?.BankName,
        Bank_Branch: val?.BankBranchId,
        Customer_ID: val?.CustomerId,
        FD_No: val?.FD_No,
        FD_Amt: val?.FDAmt,
        FD_Rate: val?.FDRate,
        FD_Interest_Tpye: val?.FDInt_Type,
        Interest_Term: val?.InterestTerm,
        FD_Debit_Acc_No: val?.DebitBankAccn,
        From_Date: val?.FromDate?.slice(0, 10),
        Tenure: val?.TenureInDays,
        Maturity_Date: val?.Maturitydate?.slice(0, 10),
        Purpose: val?.Exchange,
        Segment: val?.Segement,
        Segment_Id: val?.Seg_id,
        FD_Initiator_name_Team: val?.FDInitiatorName,
        FD_Replication_Count: "",
        File_Upload: filename,
        Prematured_FD_Rate: val?.PreMaturedFDRate,
        Prematurity_Date: val?.PreMaturityDate?.slice(0, 10),
        Status: val?.Status,
        Remark: val?.Remarks,
        Source_of_Fund: val?.SourceOfFund,
        Approved_Reject_Reason: val?.ApprovedRejectReason,
      });
    } catch (error) {

    }
  }
  async function getCompanyNames() {
    try {
      const result = await RestfullApiService('', 'user/DDLFDTransactionsCoName')
      setCoName(result?.Result?.Table1)
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
  async function getInterestTerm() {
    try {
      const data = {
        Type: 'InterestTerm',
        id: 0
      }
      const result = await RestfullApiService(data, 'user/DDLFDTransactionsIntrestTerm')
      setInterestTerm(result?.Result?.Table1)
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
  async function getSegmentList() {
    try {
      const data = {
        Type: 'Segment',
        id: 0
      }
      const result = await RestfullApiService(data, 'user/DDLFDTransactionsSegment')
      setSegment(result?.Result?.Table1)
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
  function handleFileUpload(e) {
    setNewFdTransactionEntry({ ...newFdTransactionEntry, File_Upload: e.target.value })
  }


  useEffect(() => {
    handleSearchUser();
    getCompanyNames();
    getBankNames()
    getBankBranchNames()
    getInterestTerm()
    getPurposeList()
    getSegmentList()
    getStatusList()
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
          <h2>{!addUser ? "Create FD" : "Create FD"} </h2>
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
                      Co. Name
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={coName}
                      value={coName?.find(
                        (option) =>
                          option.value?.toString() === newFdTransactionEntry?.Co_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Co_Name: selectedOption?.value,
                          });

                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Co_Name: "",
                          });

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
                    {error?.Co_Name !== "" && (
                      <p className="error-validation">{error?.Co_Name}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      FD Favouring
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="FD Favouring"
                      autoComplete="off"
                      value={newFdTransactionEntry?.FD_Favouring}
                      onChange={(e) => {
                        setNewFdTransactionEntry({
                          ...newFdTransactionEntry,
                          FD_Favouring: e.target.value,
                        });
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.FD_Favouring !== "" && (
                      <p className="error-validation">{error.FD_Favouring}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Type Of FD
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={FDType}
                      value={FDType?.find(
                        (option) =>
                          option.label === newFdTransactionEntry?.Type_Of_FD
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Type_Of_FD: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Type_Of_FD: "",
                          });
                        }
                        setError({ ...error, Type_Of_FD: "" });
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
                    {error.Type_Of_FD !== "" && (
                      <p className="error-validation">{error.Type_Of_FD}</p>
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
                          option.label === newFdTransactionEntry.Bank_Name
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Bank_Name: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Bank_Name: "",
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
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
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
                          option.value === newFdTransactionEntry?.Bank_Branch
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Bank_Branch: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Bank_Branch: "",
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
                      Customer ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Customer ID"
                      autoComplete="off"
                      value={newFdTransactionEntry?.Customer_ID}
                      onChange={(e) => {
                        setNewFdTransactionEntry({
                          ...newFdTransactionEntry,
                          Customer_ID: e.target.value,
                        });
                        setError({ ...error, Customer_ID: '' })
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Customer_ID !== "" && (
                      <p className="error-validation">{error.Customer_ID}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      FD No.
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="FD No."
                      autoComplete="off"
                      value={newFdTransactionEntry?.FD_No}
                      onChange={(e) => {
                        handleTextField(e, "FD_No");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.FD_No !== "" && (
                      <p className="error-validation">{error.FD_No}</p>
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
                      autoComplete="off"
                      value={newFdTransactionEntry?.FD_Amt}
                      onChange={(e) => {
                        handleNumberInput(e, "FD_Amt");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.FD_Amt !== "" && (
                      <p className="error-validation">{error.FD_Amt}</p>
                    )}
                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      FD Rate
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="FD Rate"
                      autoComplete="off"
                      value={newFdTransactionEntry?.FD_Rate}
                      onChange={(e) => {
                        handleNumberInput(e, "FD_Rate");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.FD_Rate !== "" && (
                      <p className="error-validation">{error.FD_Rate}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      FD Interest Tpye
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={FdInterestType}
                      value={FdInterestType?.find(
                        (option) =>
                          option.label ===
                          newFdTransactionEntry?.FD_Interest_Tpye
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            FD_Interest_Tpye: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            FD_Interest_Tpye: "",
                          });
                        }
                        setError({ ...error, FD_Interest_Tpye: "" });
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
                    {error.FD_Interest_Tpye !== "" && (
                      <p className="error-validation">
                        {error.FD_Interest_Tpye}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Interest Term
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={interestTerm}
                      value={interestTerm?.find(
                        (option) =>
                          option.label === newFdTransactionEntry?.Interest_Term
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Interest_Term: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Interest_Term: "",
                          });
                        }
                        setError({ ...error, Interest_Term: "" });
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
                    {error.Interest_Term !== "" && (
                      <p className="error-validation">{error.Interest_Term}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      FD Debit Acc No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="FD Debit Acc No"
                      autoComplete="off"
                      value={newFdTransactionEntry.Number_Of_Units}
                      onChange={(e) => {
                        handleNumberInput(e, "FD_Debit_ACC_No");
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
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      From Date
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
                          setNewFdTransactionEntry({ ...newFdTransactionEntry, From_Date: e.target.value });
                          setError({ ...error, From_Date: '' })
                          setIsRefreshed(true);
                        }}
                        value={newFdTransactionEntry?.From_Date}
                      />
                    </div>

                    {error.From_Date && (
                      <div className="error-validation">{error.From_Date}</div>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Tenure (in days)
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="Tenure"
                      autoComplete="off"
                      value={newFdTransactionEntry?.Tenure}
                      onChange={(e) => {
                        handleNumberInput(e, 'Tenure')
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Tenure !== "" && (
                      <p className="error-validation">{error.Tenure}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label fs-md"
                      htmlFor="txtAddInterestDays"
                    >
                      Maturity Date
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
                          setNewFdTransactionEntry({ ...newFdTransactionEntry, Maturity_Date: e.target.value });
                          setError({ ...error, Maturity_Date: '' })
                          setIsRefreshed(true);
                        }}
                        value={newFdTransactionEntry?.Maturity_Date}
                      />
                    </div>

                    {error.Maturity_Date && (
                      <div className="error-validation">
                        {error.Maturity_Date}
                      </div>
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
                          option.label === newFdTransactionEntry.Purpose
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Purpose: selectedOption.label,
                            Purpose_Id: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Purpose: "",
                            Purpose_Id: 0
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
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Segment
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={segment}
                      value={segment?.find(
                        (option) =>
                          option.label === newFdTransactionEntry.Segment
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Segment: selectedOption.label,
                            Segment_Id: selectedOption.value
                          });
                          setError({ ...error, Segment: "" });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Segment: "",
                            Segment_Id: 0
                          });
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
                    {error.Segment !== "" && (
                      <p className="error-validation">{error.Segment}</p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      FD Initiator name & Team
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder="FD Initiator name & Team"
                      autoComplete="off"
                      value={newFdTransactionEntry?.FD_Initiator_name_Team}
                      onChange={(e) => {
                        handleTextField(e, "FD_Initiator_name_Team");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
                    >
                      FD Replication Count
                    </label>
                    <ReactSelect
                      options={fdReplicationCount}
                      value={fdReplicationCount?.find(
                        (option) =>
                          option.value ===
                          newFdTransactionEntry?.FD_Replication_Count
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            FD_Replication_Count: selectedOption.value,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            FD_Replication_Count: "",
                          });
                        }
                        setError({ ...error, FD_Replication_Count: "" });
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
                    {error.FD_Replication_Count !== "" && (
                      <p className="error-validation">
                        {error.FD_Replication_Count}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      File Upload
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      ref={fileInputRef}
                      onChange={(e) => {
                        handleFileUpload(e)
                        // handleTextField(e, "userName");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {
                      isEdit && <div title="View File" ><Link style={{ color: 'blue' }}>{newFdTransactionEntry?.File_Upload}</Link></div>
                    }

                  </div>
                </div>
                <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Prematured FD Rate
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      placeholder=" Prematured FD Rate"
                      autoComplete="off"
                      value={newFdTransactionEntry?.Prematured_FD_Rate}
                      onChange={(e) => {
                        handleNumberInput(e, "Prematured_FD_Rate");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                      maxLength="50"
                    />
                    {error.Prematured_FD_Rate !== "" && (
                      <p className="error-validation">
                        {error.Prematured_FD_Rate}
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
                          setNewFdTransactionEntry({ ...newFdTransactionEntry, Prematurity_Date: e.target.value });
                          setError({ ...error, Prematurity_Date: '' })
                          setIsRefreshed(true);
                        }}
                        value={newFdTransactionEntry?.Prematurity_Date}
                      />
                    </div>

                    {error.Prematurity_Date && (
                      <div className="error-validation">
                        {error.Prematurity_Date}
                      </div>
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
                          option.label ===
                          newFdTransactionEntry?.Status
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Status: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
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
                    {error.FD_Replication_Count !== "" && (
                      <p className="error-validation">
                        {error.FD_Replication_Count}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      Remarks
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      value={newFdTransactionEntry?.Remark}
                      onChange={(e) => {
                        handleTextField(e, "Remark");
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
                      htmlFor="ddlAddSecurityCategory"
                    >
                      Source of Fund
                      <span className="text-danger">*</span>
                    </label>
                    <ReactSelect
                      options={sourceOfFund}
                      value={sourceOfFund?.find(
                        (option) =>
                          option.label === newFdTransactionEntry?.Source_of_Fund
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Source_of_Fund: selectedOption.label,
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewFdTransactionEntry({
                            ...newFdTransactionEntry,
                            Source_of_Fund: "",
                          });
                        }
                        setError({ ...error, Source_of_Fund: "" });
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
                    {error.Source_of_Fund !== "" && (
                      <p className="error-validation">{error.Source_of_Fund}</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="ddlAddSecurityCategory"
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
                      value={newFdTransactionEntry?.Approved_Reject_Reason}
                      onChange={(e) => {
                        handleTextField(e, "ApprovedReason");
                        // Set isRefreshed to true to indicate unsaved changes
                        setIsRefreshed(true);
                      }}
                    />
                    {error.Approved_Reject_Reason !== "" && (
                      <p className="error-validation">
                        {error.Approved_Reject_Reason}
                      </p>
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
                              FD No
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="txtSearchSecurity"
                              placeholder="FD No"
                              autoComplete="off"
                              defaultValue={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                            />
                            {error.FD_No !== "" ? (
                              <p
                                className="error-validation"
                                style={{ fontWeight: "600" }}
                              >
                                {error.FD_No}
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
                          <CreateFdGrid
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

export default CreateFD;
