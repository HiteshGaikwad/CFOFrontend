import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import FDDailyInterestGrid from "../../../Grids/TreasuryGrids/Reports/FDModule/FDDailyInterestGrid";

const reportData = {
  FDNo: "",
  FDAmt: 0,
  FD_ROI: 0,
  FDInt_Type: "",
  FDInterestTerm: "",
  FDStartDate: "",
  FDMaturityDate: ""
}
const err = {
  FDNo: "",
  FDAmt: '',
  FD_ROI: '',
  FDInt_Type: "",
  FDInterestTerm: "",
  FDStartDate: "",
  FDMaturityDate: ""
}
const fdInterestType = [
  {
    label: 'Cumulative',
    value: 'Cumulative'
  },
  {
    label: 'Simple',
    value: 'Simple'
  }
]
const fdInterestTerm = [
  {
    label: 'Quarterly',
    value: 'Quarterly'
  },
  {
    label: 'On Maturity',
    value: 'On Maturity'
  }
]

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

const FDDailyInterestReport = () => {
  const [userInfo, setUserInfo] = useState([])
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [newReportData, setNewReportData] = useState(reportData)
  const [error, setError] = useState(err)


  const interestTerm = [
    {
      value: "Quarterly",
      label: "Quarterly",
    },
    {
      value: "Half Yearly",
      label: "Half Yearly",
    },
  ];
  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const refresh = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefreshed(refresh);
  };

  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "FdAmt") {
        setNewReportData({ ...newReportData, FDAmt: inputValue })
        setError({ ...error, FDAmt: '' })
      }
      else if (type === "fd_rate_of_interest") {
        setNewReportData({ ...newReportData, FD_ROI: inputValue })
        setError({ ...error, FD_ROI: '' })
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  async function searchFdReport() {
    let notify;
    try {
      let errors = err;
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(newReportData).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setNewReportData(trimmedUser);
      // Perform validation
      if (newReportData?.FDNo === "") {
        errors = { ...errors, FDNo: "FD No. is required." };
      }
      if (newReportData?.FDAmt === 0) {
        errors = { ...errors, FDAmt: "FD Amt. is required." };
      }
      if (newReportData?.FD_ROI === 0) {
        errors = { ...errors, FD_ROI: "FD Rate Of Interest is required." };
      }
      if (newReportData?.FDInterestTerm === "") {
        errors = { ...errors, FDInterestTerm: "FD Interest Term is required." };
      }
      if (newReportData?.FDInt_Type === "") {
        errors = { ...errors, FDInt_Type: "FD Interest Type is required." };
      }
      if (newReportData?.FDStartDate === "") {
        errors = { ...errors, FDStartDate: "Start Date is required." };
      }
      if (newReportData?.FDMaturityDate === "") {
        errors = { ...errors, FDMaturityDate: "Maturity Date is required." };
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
      if (!flag) {
        const data = {
          FDNo: newReportData?.FDNo,
          FDAmt: newReportData?.FDAmt,
          FD_ROI: newReportData?.FD_ROI,
          FDInt_Type: newReportData?.FDInt_Type,
          FDInterestTerm: newReportData?.FDInterestTerm,
          FDStartDate: newReportData?.FDStartDate,
          FDMaturityDate: newReportData?.FDMaturityDate
        }
        const result = await RestfullApiService(
          data,
          "user/GetFDDailyInterestReport"
        );
        setUserInfo(result?.Result?.Table1)
        if (result?.Status === 400) {
          notify = () => toast.error(result?.Description);
        }
        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
      } else {
        notify = () => toast.error("Mandatory fields should not be empty.");
      }
      notify();
    }
    catch (error) {
      // Handle error 
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

  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2>FD Daily Interest Report </h2>

          <div className="panel-toolbar ml-2">
            <button
              type="button"
              className="btn btn-sm btn-primary text-white mr-2"
              id="btn_Save"
              onClick={() => searchFdReport()}
            >
              Get Daily Interest Report
            </button>
            <button type="button" className="btn btn-sm btn-default" onClick={() => {
              setNewReportData(reportData)
              document.getElementById('FDNo').value = ''
              setUserInfo([])
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
                  htmlFor="txtAddSecurityName"
                >
                  FD No.
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="FDNo"
                  placeholder="FD No."
                  autoComplete="off"
                  maxLength="50"
                  defaultValue={newReportData?.FDNo}
                  onChange={(e) => { setNewReportData({ ...newReportData, FDNo: e.target.value }); setError({ ...error, FDNo: '' }) }}
                />
                {error.FDNo !== "" && (
                  <p className="error-validation">{error.FDNo}</p>
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
                  maxLength="50"
                  value={newReportData?.FDAmt === 0 ? '' : newReportData?.FDAmt}
                  onChange={(e) => handleNumberInput(e, 'FdAmt')}
                />
                {error.FDAmt !== "" && (
                  <p className="error-validation">{error.FDAmt}</p>
                )}
              </div>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="txtAddSecurityName"
                >
                  FD Rate Of Interest
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="txtAddSecurityName"
                  placeholder="FD Rate Of Interest."
                  autoComplete="off"
                  maxLength="50"
                  value={newReportData?.FD_ROI === 0 ? '' : newReportData?.FD_ROI}
                  onChange={(e) => handleNumberInput(e, 'fd_rate_of_interest')}
                />
                {error.FD_ROI !== "" && (
                  <p className="error-validation">{error.FD_ROI}</p>
                )}
              </div>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  FD Interest Type
                  <span className="text-danger">*</span>
                </label>
                <ReactSelect
                  options={fdInterestType}
                  isClearable
                  value={newReportData?.FDInt_Type === '' ? '' : fdInterestType?.find(
                    (option) => option.value === newReportData.FDInt_Type
                  )
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setNewReportData({
                        ...newReportData,
                        FDInt_Type: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setNewReportData({
                        ...newReportData,
                        FDInt_Type: "",
                      });
                    }
                    setError({ ...error, FDInt_Type: "" });
                    // Set isRefreshed to true to indicate unsaved changes
                    setIsRefreshed(true);
                  }}
                  styles={customStyles}
                  // {...props}
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
                {error?.FDInt_Type !== "" && (
                  <p className="error-validation">{error?.FDInt_Type}</p>
                )}
              </div>{" "}
            </div>
            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  FD Interest Term
                  <span className="text-danger">*</span>
                </label>
                <ReactSelect
                  options={interestTerm}
                  value={newReportData?.FDInterestTerm === '' ? '' : interestTerm?.find(
                    (option) =>
                      option.value === newReportData?.FDInterestTerm
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setNewReportData({
                        ...newReportData,
                        FDInterestTerm: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setNewReportData({
                        ...newReportData,
                        FDInterestTerm: "",
                      });
                    }
                    setError({ ...error, FDInterestTerm: "" });
                    // Set isRefreshed to true to indicate unsaved changes
                    setIsRefreshed(true);
                  }}
                  styles={customStyles}
                  // {...props}
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
                {error.FDInterestTerm !== "" && (
                  <p className="error-validation">{error.FDInterestTerm}</p>
                )}
              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  Start Date
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
                      setNewReportData({ ...newReportData, FDStartDate: e.target.value });
                      setError({ ...error, FDStartDate: '' })
                      setIsRefreshed(true);
                    }}
                    value={newReportData?.FDStartDate}
                  />
                </div>

                {error?.FDStartDate && (
                  <div className="error-validation">{error?.FDStartDate}</div>
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
                      setNewReportData({ ...newReportData, FDMaturityDate: e.target.value });
                      setError({ ...error, FDMaturityDate: '' })
                      setIsRefreshed(true);
                    }}
                    value={newReportData?.FDMaturityDate}
                  />
                </div>

                {error?.FDMaturityDate && (
                  <div className="error-validation">{error?.FDMaturityDate}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="panel-container show px-3 fdReport" >
          <div className="panel-content fdReport" >
            {
              userInfo?.length !== 0 && <div className="table-responsive table-wrap watchlist-table tblheight">
                <FDDailyInterestGrid
                  userInfo={userInfo}
                  searchData={newReportData}
                />
              </div>
            }

          </div>
        </div>
      </div>
    </>
  );
};

export default FDDailyInterestReport;
