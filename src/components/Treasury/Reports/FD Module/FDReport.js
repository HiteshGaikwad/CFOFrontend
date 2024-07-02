import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { RestfullApiService } from "../../../../config/Api's";
import FDReportGrid from "../../../Grids/TreasuryGrids/Reports/FDModule/FDReportGrid";

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
const fdDataReport = {
  Bank_Name: "",
  Co_Name: "",
  Status: "",
  From_Date: null,
  To_Date: "",
  FD_No: "",
  Report_Name: "",
};

const FDReport = (props) => {

  const FdTransactionData = {};
  const [userInfo, setUserInfo] = useState([])
  const [fdReport, setFdReport] = useState(fdDataReport);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});

  const [bankName, setBankNames] = useState([])
  const [coName, setCoName] = useState([])
  const [reportName, setReportName] = useState([])


  const handleTextField = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      if (type === "FD_No") {
        setFdReport({
          ...fdReport,
          FD_No: inputValue,
        });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };
  async function searchFdReport() {
    let notify;
    try {
      if (fdReport?.Report_Name) {
        const data = {
          BankName: fdReport?.Bank_Name,
          CompanyName: fdReport?.Co_Name,
          Status: fdReport?.Status ? fdReport?.Status : null,
          fromDate: fdReport?.From_Date ? fdReport?.From_Date : null,
          toDate: fdReport?.To_Date ? fdReport?.To_Date : null,
          FDNo: fdReport?.FD_No,
          FDReportName: fdReport?.Report_Name,
        };
        const result = await RestfullApiService(
          data,
          "user/GetFDReportDataNameWise"
        );
        setUserInfo(result?.Result?.Table1)
      } else {
        const data = {
          BankName: fdReport?.Bank_Name,
          CompanyName: fdReport?.Co_Name,
          Status: fdReport?.Status,
          fromDate: fdReport?.From_Date ? fdReport?.From_Date : null,
          toDate: fdReport?.To_Date ? fdReport?.To_Date : null,
          FDNo: fdReport?.FD_No,
        };
        const result = await RestfullApiService(
          data,
          "user/GetFDReportData"
        );
        setUserInfo(result?.Result?.Table1)
      }
      // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
      setIsRefreshed(false);

    } catch (error) {
      // Handle error 
    }
  }

  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const refresh = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefreshed(refresh);
  };
  //Bank Name DropDown
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

  //Company Name Dropdown
  async function getCompanyNames() {
    try {
      const result = await RestfullApiService('', 'user/DDLFDTransactionsCoName')
      setCoName(result?.Result?.Table1)
    } catch (error) {

    }
  }

  //Report Name DropDown
  async function getReportNames() {
    try {
      const result = await RestfullApiService('', 'user/DDLGetFDReportName')
      setReportName(result?.Result?.Table1)
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
    getBankNames();
    getCompanyNames();
    getReportNames();
  }, []);
  return (
    <>
      <div className="panel fdReport">
        <div className="panel-hdr">
          <h2>FDReport </h2>

          <div className="panel-toolbar ml-2">
            <button
              type="button"
              className="btn btn-sm btn-primary text-white mr-2"
              id="btn_Save"
              onClick={() => searchFdReport()}
            >
              Search
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
                  setIsRefreshed(false);
                  setFdReport(fdDataReport)
                  setUserInfo([])
                  document.getElementById('fromDate').value = ''
                  document.getElementById('toDate').value = ''
                }
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="panel-container show fdReport">
          <div className="panel-content">
            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  Bank Name
                </label>
                <ReactSelect
                  options={bankName}
                  value={fdReport?.Bank_Name === '' ? '' : bankName?.find(
                    (option) => option.value === fdReport?.Bank_Name
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFdReport({
                        ...fdReport,
                        Bank_Name: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setFdReport({
                        ...fdReport,
                        Bank_Name: "",
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

              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  Company Name
                </label>
                <ReactSelect
                  options={coName}
                  value={fdReport?.Co_Name === '' ? '' : coName?.find(
                    (option) => option.value === fdReport?.Co_Name
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFdReport({
                        ...fdReport,
                        Co_Name: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setFdReport({
                        ...fdReport,
                        Co_Name: "",
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

              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  Status
                </label>
                <ReactSelect
                  options={status}
                  value={fdReport?.Status === '' ? '' : status?.find(
                    (option) => option.value === fdReport?.Status
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFdReport({
                        ...fdReport,
                        Status: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setFdReport({
                        ...fdReport,
                        Status: "",
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

              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  From Date
                </label>

                <div>
                  <input
                    type="date"
                    className="input-date"
                    id="fromDate"
                    style={{
                      width: "100%",
                      height: "2.8em",
                      border: "0.1px solid rgb(216, 215, 215)",
                      outline: "none",
                      borderRadius: "3px",
                      padding: "0px 8px",
                    }}
                    onChange={(e) => {
                      setFdReport({ ...fdReport, From_Date: e.target.value });
                      setIsRefreshed(true);
                    }}
                    defaultValue={fdReport?.From_Date}
                  />
                </div>


              </div>
            </div>
            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  To Date
                </label>

                <div>
                  <input
                    type="date"
                    className="input-date"
                    id="toDate"
                    style={{
                      width: "100%",
                      height: "2.8em",
                      border: "0.1px solid rgb(216, 215, 215)",
                      outline: "none",
                      borderRadius: "3px",
                      padding: "0px 8px",
                    }}
                    onChange={(e) => {
                      setFdReport({ ...fdReport, To_Date: e.target.value });
                      setIsRefreshed(true);
                    }}
                    defaultValue={fdReport?.To_Date}
                  />
                </div>

              </div>
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
                  value={fdReport?.FD_No}
                  onChange={(e) => {
                    handleTextField(e, "FD_No");
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
                  Report Name
                </label>
                <ReactSelect
                  options={reportName}
                  value={fdReport?.Report_Name === '' ? '' : reportName?.find(
                    (option) => option.value === fdReport?.Report_Name
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFdReport({
                        ...fdReport,
                        Report_Name: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setFdReport({
                        ...fdReport,
                        Report_Name: "",
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

              </div>{" "}
            </div>
          </div>
        </div>
        <div className="panel-container show px-3 fdReport" >
          <div className="panel-content fdReport" >
            {
              userInfo?.length !== 0 && <div className="table-responsive table-wrap watchlist-table tblheight">
                <FDReportGrid
                  userInfo={userInfo}
                  searchData={fdDataReport}
                />
              </div>
            }

          </div>
        </div>
      </div>
    </>
  );
};



export default FDReport;
