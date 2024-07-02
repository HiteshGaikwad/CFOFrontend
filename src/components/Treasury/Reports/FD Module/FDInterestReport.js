import React, { useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import FDInterestReportGrid from "../../../Grids/TreasuryGrids/Reports/FDModule/FDInterestReportGrid";
const FDInterestReport = (props) => {
  const companyName = [
    {
      label: "HCL",
      value: "1",
    },
    {
      label: "Mahindra",
      value: "2",
    },
  ];
  const typeOfFD = [
    {
      label: "Client FD",
      value: "0",
    },
    {
      label: "Own FD",
      value: "1",
    },
  ];
  const status = [
    {
      value: "1",
      label: "Active",
    },
    {
      value: "2",
      label: "Liquidate",
    },
    {
      value: "3",
      label: "Renew",
    },
    {
      value: "4",
      label: "Prematured",
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
  const fdInterest = {
    Co_Name: "",
    Type_Of_Fd: "",
    Bank_Name: "",
    FD_No: "",
    From_Date: "",
    To_Date: "",
    Status: "",
  };
  const err = {
    From_Date: "",
    To_Date: "",
  };
  const [fdInterestReport, setFdInterestReport] = useState(
    fdInterest
  );
  const [error, setError] = useState({});
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [coName, setCoName] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  var whereClauseStr;
  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "FD_No") {
        setFdInterestReport({
          ...fdInterestReport,
          FD_No: inputValue,
        });
        setError({ ...error, FD_No: "" });
      } else if (type === "Bank_Name") {
        setFdInterestReport({
          ...fdInterestReport,
          Bank_Name: inputValue,
        });
        setError({ ...error, Bank_Name: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };
  const validateDate = (startDate, toDate) => {
    const sDate = new Date(startDate)
    const tDate = new Date(toDate)
    return sDate < tDate;
  }
  async function handleInterestReport() {
    let notify;
    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(fdInterestReport).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setFdInterestReport(trimmedUser);
      // Perform validation

      if (fdInterestReport?.From_Date === "") {
        errors = {
          ...errors,
          From_Date: " From Date is required.",
        };
      }
      if (fdInterestReport?.To_Date === "") {
        errors = { ...errors, To_Date: "To Date is required." };
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
        let validation = false;
        validation = (fdInterestReport?.From_Date !== '' && fdInterestReport?.To_Date !== '') && validateDate(fdInterestReport?.From_Date, fdInterestReport?.To_Date);
        if (validation) {
          whereClauseStr = `WHERE FDD.FD_No like '%${fdInterestReport?.FD_No}%' AND
        ((FDD.From_Date  between '${fdInterestReport?.From_Date}' AND '${fdInterestReport?.To_Date}') OR (FDD.To_Date  between '${fdInterestReport?.From_Date}' AND '${fdInterestReport?.To_Date}'))`
          {
            whereClauseStr += fdInterestReport?.Co_Name ? `AND CoName='${fdInterestReport?.Co_Name}'` + "" : ''
          }
          {
            whereClauseStr += fdInterestReport?.Type_Of_Fd ? `AND TypeofFD='${fdInterestReport?.Type_Of_Fd}'` + "" : ''
          }
          {
            whereClauseStr += fdInterestReport?.Status ? `AND FD.Status='${fdInterestReport?.Status}'` + "" : ''
          }

          const data = {
            WhereClause: whereClauseStr,
            FromDate: fdInterestReport?.From_Date,
            ToDate: fdInterestReport?.To_Date
          };

          const result = await RestfullApiService(
            data,
            "user/GetFDIntrestReport"
          );
          console.log(result);
          setUserInfo(result?.Result?.Table1)
          if (result?.Status === 200) {
            notify = () => toast.success(result?.Description);
          }
          else if (result?.Status === 400) {
            notify = () => toast.error(result?.Description);
          }
          // Reset newUser object

          // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
          setIsRefreshed(false);
          setIsTableOpen(true);
        } else {
          notify = () => toast.error("Prematurity date field should be greater than maturity date.");
        }
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
      }
      notify();
    } catch (error) {
      // Handle error
    }
  }
  const handleReset = () => {
    // setFdDailyInterestReport({ ...fdDailyInterest });
    setError({});
    setIsTableOpen(false);
  };

  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const refresh = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefreshed(refresh);
  };
  async function getCoName() {
    try {
      const result = await RestfullApiService({}, 'user/DDLFDTransactionsCoName');
      setCoName(result?.Result?.Table1)
    } catch (error) {

    }
  }
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
  useEffect(() => {
    getCoName()
  }, [])
  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>FD Interest Report </h2>
          <div className="panel-toolbar ml-2">
            <button
              type="button"
              className="btn btn-sm btn-primary text-white mr-2"
              id="btn_Save"
              onClick={() => handleInterestReport()}
            >
              Go
            </button>
            <button type="button" className="btn btn-sm btn-default" onClick={() => {
              setFdInterestReport(fdInterest)
              setUserInfo([])
              document.getElementById('todate').value = '';
              document.getElementById('fromDate').value = '';
            }}>
              Reset
            </button>
          </div>
        </div>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  Co Name
                </label>
                <ReactSelect
                  options={coName}
                  value={fdInterestReport?.Co_Name === '' ? "" : coName?.find(
                    (option) => option.label === fdInterestReport?.Co_Name
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFdInterestReport({
                        ...fdInterestReport,
                        Co_Name: selectedOption.label,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setFdInterestReport({
                        ...fdInterestReport,
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
              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  Type Of FD
                </label>
                <ReactSelect
                  options={typeOfFD}
                  value={fdInterestReport?.Type_Of_Fd === '' ? '' : typeOfFD?.find(
                    (option) => option.label === fdInterestReport?.Type_Of_Fd
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFdInterestReport({
                        ...fdInterestReport,
                        Type_Of_Fd: selectedOption.label,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setFdInterestReport({
                        ...fdInterestReport,
                        Type_Of_Fd: "",
                      });
                    }
                    setError({ ...error, Type_Of_Fd: "" });
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

              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="txtAddSecurityName"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="txtAddSecurityName"
                  placeholder="Bank Name."
                  autoComplete="off"
                  maxLength="50"
                  value={fdInterestReport?.Bank_Name}
                  onChange={(e) => {
                    handleTextField(e, "Bank_Name");
                    // Set isRefreshed to true to indicate unsaved changes
                    setIsRefreshed(true);
                  }}
                />

              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="txtAddSecurityName"
                >
                  FD No.
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="txtAddSecurityName"
                  placeholder="FD No."
                  autoComplete="off"
                  maxLength="50"
                  value={fdInterestReport?.FD_No}
                  onChange={(e) => {
                    handleTextField(e, "FD_No");
                    // Set isRefreshed to true to indicate unsaved changes
                    setIsRefreshed(true);
                  }}
                />

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
                    id="fromDate"
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
                      setFdInterestReport({
                        ...fdInterestReport,
                        From_Date: e.target.value,
                      });
                      setError({ ...error, From_Date: "" });
                      setIsRefreshed(true);
                    }}
                    defaultValue={fdInterestReport?.From_Date}
                  />
                </div>

                {error.From_Date && (
                  <div className="error-validation">{error.From_Date}</div>
                )}
              </div>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  To Date
                  <span className="text-danger">*</span>
                </label>

                <div>
                  <input
                    id="todate"
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
                      setFdInterestReport({
                        ...fdInterestReport,
                        To_Date: e.target.value,
                      });
                      setError({ ...error, To_Date: "" });
                      setIsRefreshed(true);
                    }}
                    defaultValue={fdInterestReport?.To_Date}
                  />
                </div>

                {error.To_Date && (
                  <div className="error-validation">{error.To_Date}</div>
                )}
              </div>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  Status
                </label>
                <ReactSelect
                  options={status}
                  value={fdInterestReport?.Status === '' ? "" : status?.find(
                    (option) => option.value === fdInterestReport?.Status
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFdInterestReport({
                        ...fdInterestReport,
                        Status: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setFdInterestReport({
                        ...fdInterestReport,
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

              </div>{" "}
            </div>

          </div>
        </div>
        <div className="panel-container show px-3 fdReport" >
          <div className="panel-content fdReport" >
            {
              userInfo?.length !== 0 && <div className="table-responsive table-wrap watchlist-table tblheight">
                <FDInterestReportGrid
                  userInfo={userInfo}
                  searchData={fdInterestReport}
                  whereCluse={whereClauseStr}
                />
              </div>
            }

          </div>
        </div>
      </div>
    </>
  );
};

export default FDInterestReport;
