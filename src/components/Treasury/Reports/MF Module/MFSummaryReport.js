import React, { useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import MFSummeryReportsGrid from "../../../Grids/TreasuryGrids/Reports/MFModule/MFSummeryReportsGrid";

const Type = [
  {
    label: "All",
    value: "1",
  },
  {
    label: "Equity",
    value: "2",
  },
  {
    label: "Liquid",
    value: "3",
  },
  {
    label: "AIF",
    value: "4",
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
const summaryReport = {
  Type: "All",
  Co_Name: "",
  Date_1: "",
  Date_2: "",
  Date_3: "",
  Date_4: "",
  Date_5: "",
};
const err = {
  Type: "",
  Co_Name: "",
  Date_1: "",
};
const MFSummaryReport = (props) => {

  const [mfSummaryReport, setMfSummaryReport] = useState(summaryReport);
  const [error, setError] = useState({});
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [companyName, setCompanyName] = useState([]);
  const [tableData, setTableData] = useState([])
  const [isVisible, setIsVisible] = useState(false)


  async function handleMFSummaryReport() {
    let notify;

    try {
      let errors = err;
      setIsVisible(true)
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(mfSummaryReport).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setMfSummaryReport(trimmedUser);
      // Perform validation

      if (mfSummaryReport?.Type === "") {
        errors = {
          ...errors,
          Type: "Type is required.",
        };
      }
      if (mfSummaryReport?.Co_Name === "") {
        errors = { ...errors, Co_Name: "Co Name is required." };
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
        if (mfSummaryReport?.Date_1) {
          const data = {
            Type: mfSummaryReport?.Type === 'All' ? '0' : mfSummaryReport?.Type,
            CoId: mfSummaryReport?.Co_Name,
            ISINId: 0,
            DtAsOnDate1: (mfSummaryReport?.Date_1) ? (mfSummaryReport?.Date_1) + 'T00:00:00.000' : null,
            DtAsOnDate2: (mfSummaryReport?.Date_2) ? (mfSummaryReport?.Date_2) + 'T00:00:00.000' : null,
            DtAsOnDate3: (mfSummaryReport?.Date_3) ? (mfSummaryReport?.Date_3) + 'T00:00:00.000' : null,
            DtAsOnDate4: (mfSummaryReport?.Date_4) ? (mfSummaryReport?.Date_4) + 'T00:00:00.000' : null,
            DtAsOnDate5: (mfSummaryReport?.Date_5) ? (mfSummaryReport?.Date_5) + 'T00:00:00.000' : null,
          };
          const result = await RestfullApiService(
            data,
            "user/GetMFSummaryReportData"
          );
          console.log(result);
          setTableData(result?.Result?.Table1)
          // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
          setIsRefreshed(false);
          setIsTableOpen(true);
        } else {
          notify = () => toast.error('Please Enter To Date');
        }
      } else {

      }
      notify();
    } catch (error) {
      // Handle error
    } finally {
      setIsVisible(false)
    }
  }
  const handleReset = () => {
    setMfSummaryReport(summaryReport)
    setError({});
    setIsTableOpen(false);
    document.getElementById('date1').value = ''
    document.getElementById('date2').value = ''
    document.getElementById('date3').value = ''
    document.getElementById('date4').value = ''
    document.getElementById('date5').value = ''
  };

  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const refresh = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefreshed(refresh);
  };

  const getCompanyNames = async () => {
    try {
      const data = {
        Type: mfSummaryReport.Type === 'All' ? '0' : mfSummaryReport.Type
      }
      const result = await RestfullApiService(data, 'user/DDLGetMFReportCompanyName');
      const firstObj = {
        label: 'All',
        value: '0'
      }
      const list = result?.Result?.Table1;
      list[0] = firstObj;
      setCompanyName(list)
    } catch (error) {

    }
  }

  useEffect(() => {
    getCompanyNames()
  }, [mfSummaryReport?.Type])
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
          <h2>MF Summary Report </h2>

          <div className="panel-toolbar ml-2">
            <button
              type="button"
              className="btn btn-sm btn-primary text-white mr-2"
              id="btn_Save"
              disabled={isVisible}
              onClick={() => handleMFSummaryReport()}
              style={{ minWidth: '75px' }}
            >
              {isVisible ? (
                <i
                  className="fa fa-spinner fa-spin"
                  style={{ fontSize: "14px" }}
                ></i>
              ) : (
                <span id="labelsignin">Search</span>
              )}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-default"
              onClick={() => handleReset()}
            >
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
                  Type
                  <span className="text-danger">*</span>
                </label>
                <ReactSelect
                  options={Type}
                  defaultValue={mfSummaryReport?.Type !== 'All' ? mfSummaryReport?.Type : Type[0]}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Type: selectedOption?.label,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Type: "",
                      });
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
              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="ddlAddSecurityCategory"
                >
                  Co. Name
                  <span className="text-danger">*</span>
                </label>
                <ReactSelect
                  options={companyName}
                  value={mfSummaryReport?.Co_Name === '' ? '' : companyName?.find(
                    (option) => option.value === mfSummaryReport?.Co_Name
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Co_Name: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setMfSummaryReport({
                        ...mfSummaryReport,
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
                {error.Co_Name !== "" && (
                  <p className="error-validation">{error.Co_Name}</p>
                )}
              </div>{" "}
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  Date 1{/* <span className="text-danger">*</span> */}
                </label>

                <div>
                  <input
                    type="date"
                    className="input-date"
                    id="date1"
                    style={{
                      width: "100%",
                      height: "2.8em",
                      border: "0.1px solid rgb(216, 215, 215)",
                      outline: "none",
                      borderRadius: "3px",
                      padding: "0px 8px",
                    }}
                    onChange={(e) => {
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Date_1: e.target.value,
                      });
                      setIsRefreshed(true);
                    }}
                    defaultValue={mfSummaryReport?.Date_1}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  Date 2{/* <span className="text-danger">*</span> */}
                </label>

                <div>
                  <input
                    type="date"
                    className="input-date"
                    id="date2"
                    style={{
                      width: "100%",
                      height: "2.8em",
                      border: "0.1px solid rgb(216, 215, 215)",
                      outline: "none",
                      borderRadius: "3px",
                      padding: "0px 8px",
                    }}
                    onChange={(e) => {
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Date_2: e.target.value,
                      });
                      setIsRefreshed(true);
                    }}
                    defaultValue={mfSummaryReport?.Date_2}
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
                  Date 3{/* <span className="text-danger">*</span> */}
                </label>

                <div>
                  <input
                    type="date"
                    className="input-date"
                    id="date3"
                    style={{
                      width: "100%",
                      height: "2.8em",
                      border: "0.1px solid rgb(216, 215, 215)",
                      outline: "none",
                      borderRadius: "3px",
                      padding: "0px 8px",
                    }}
                    onChange={(e) => {
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Date_3: e.target.value,
                      });
                      setIsRefreshed(true);
                    }}
                    defaultValue={mfSummaryReport?.Date_3}
                  />
                </div>

              </div>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  Date 4{/* <span className="text-danger">*</span> */}
                </label>
                <div>
                  <input
                    type="date"
                    className="input-date"
                    id="date4"
                    style={{
                      width: "100%",
                      height: "2.8em",
                      border: "0.1px solid rgb(216, 215, 215)",
                      outline: "none",
                      borderRadius: "3px",
                      padding: "0px 8px",
                    }}
                    onChange={(e) => {
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Date_4: e.target.value,
                      });
                      setIsRefreshed(true);
                    }}
                    defaultValue={mfSummaryReport?.Date_4}
                  />
                </div>

              </div>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  Date 5{/* <span className="text-danger">*</span> */}
                </label>

                <div>
                  <input
                    type="date"
                    className="input-date"
                    id="date5"
                    style={{
                      width: "100%",
                      height: "2.8em",
                      border: "0.1px solid rgb(216, 215, 215)",
                      outline: "none",
                      borderRadius: "3px",
                      padding: "0px 8px",
                    }}
                    onChange={(e) => {
                      setMfSummaryReport({
                        ...mfSummaryReport,
                        Date_5: e.target.value,
                      });
                      setIsRefreshed(true);
                    }}
                    defaultValue={mfSummaryReport?.Date_5}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="panel-container show px-3 fdReport">
          <div className="panel-content  fdReport">
            {isTableOpen && (
              <>
                <MFSummeryReportsGrid tableData={tableData} mfSummaryReport={mfSummaryReport} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MFSummaryReport;
