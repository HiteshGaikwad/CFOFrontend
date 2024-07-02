import React, { useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import MFPledgeDetailsReportGrid from "../../../Grids/TreasuryGrids/Reports/MFModule/MFPledgeDetailsReportGrid";

const investmentType = [
  {
    label: "All",
    value: "1",
  },
  {
    label: "Sponsor Commitment",
    value: "2",
  },
  {
    label: "Treasury Investment",
    value: "3",
  },
  {
    label: "Client Investment",
    value: "4",
  },
];
const Type = [
  {
    label: "All",
    value: "0",
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
const pledgeDetailsReport = {
  Type: "0",
  Co_Name: 0,
  Type_Of_Investment: "All",
  Scheme_Name: "",
  As_On_Date: "",
  ISIN: "",
  ISINId: 0
};
const err = {
  Type: "",
  Co_Name: "",
  Type_Of_Investment: "",
  Scheme_Name: "",
  ISIN: "",
};
const MFPledgeDetailsReport = (props) => {

  const [mfPledgeDetailsReport, setMfPledgeDetailsReport] = useState(pledgeDetailsReport);
  const [error, setError] = useState({});
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});
  const [companyName, setCompanyName] = useState([]);
  const [scheme, setScheme] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);


  const handleNumberInput = (event, type) => {
    const inputValue = event.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      if (type === "ISIN") {
        setMfPledgeDetailsReport({
          ...mfPledgeDetailsReport,
          ISIN: inputValue,
        });
        setError({ ...error, ISIN: "" });
      }
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  async function handleMFPledgeDetailsReport() {
    let notify;
    try {
      setIsVisible(true);
      // Function to trim string values
      const trimValue = (value) => {
        return typeof value === "string" ? value.trim() : value;
      };

      // Trim string values in newUser object
      const trimmedUser = Object.fromEntries(
        Object.entries(mfPledgeDetailsReport).map(([key, value]) => [
          key,
          trimValue(value),
        ])
      );
      // Update newUser object with trimmed values
      setMfPledgeDetailsReport(trimmedUser);
      // Perform validation

      // If no validation errors, proceed to save
      if (mfPledgeDetailsReport?.As_On_Date) {
        const data = {
          Type: mfPledgeDetailsReport?.Type,
          CoId: mfPledgeDetailsReport?.Co_Name,
          ISINId: mfPledgeDetailsReport?.ISINId
        };
        const result = await RestfullApiService(
          data,
          "user/GetMFPledgeDetailsReportData"
        );
        if (result?.Status === 200) {
          setTableData(result?.Result?.Table1)
          notify = () => toast.success(result?.Description);

        }
        // Reset newUser object

        // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
        setIsRefreshed(false);
        setIsTableOpen(true);
      } else {
        notify = () => toast.error("Please Select As On Date.");
      }
      notify();
    } catch (error) {
      // Handle error
    } finally {
      setIsVisible(false);
    }
  }
  const handleReset = () => {
    setMfPledgeDetailsReport(pledgeDetailsReport)
    setError({});
    setIsTableOpen(false);
    document.getElementById('date').value = ''
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
        Type: mfPledgeDetailsReport.Type === 'All' ? '0' : mfPledgeDetailsReport.Type
      }
      const result = await RestfullApiService(data, 'user/DDLGetMFReportCompanyName');
      const firstObj = {
        value: 0,
        label: 'All'
      }
      const list = result?.Result?.Table1;
      list[0] = firstObj;
      setCompanyName(list)
    } catch (error) {

    }
  }
  const getSchemeName = async () => {
    try {
      const data = {
        Type: mfPledgeDetailsReport?.Type === 'All' ? '0' : mfPledgeDetailsReport?.Type,
        coName: mfPledgeDetailsReport?.Co_Name !== 0 ? mfPledgeDetailsReport?.Co_Name : '0',
        TypeOfInvestment: mfPledgeDetailsReport?.Type_Of_Investment !== 'All' ? mfPledgeDetailsReport?.Type_Of_Investment : '0'
      }
      const result = await RestfullApiService(data, 'user/DDLGetMFReportSchemeName')
      setScheme(result?.Result?.Table1)
    } catch (error) {

    }
  }
  const getIsin = async (selectedOption) => {
    try {
      const data = {
        SchemeName: selectedOption?.label
      }
      const result = await RestfullApiService(data, 'user/DDLGetTransactionSumaryISIN');
      const isin = result?.Result?.Table1[0]?.ISIN
      setMfPledgeDetailsReport({
        ...mfPledgeDetailsReport,
        Scheme_Name: selectedOption.label,
        ISINId: parseInt(selectedOption?.value),
        ISIN: isin
      });

    } catch (error) {

    }
  }
  useEffect(() => {
    getSchemeName()
  }, [mfPledgeDetailsReport?.Type, mfPledgeDetailsReport?.Type_Of_Investment, mfPledgeDetailsReport?.Co_Name])
  useEffect(() => {
    getCompanyNames()
  }, [mfPledgeDetailsReport?.Type])

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
          <h2>MF Pledge Details Report </h2>

          <div className="panel-toolbar ml-2">
            <button
              type="button"
              className="btn btn-sm btn-primary text-white mr-2"
              id="btn_Save"
              disabled={isVisible}
              onClick={() => handleMFPledgeDetailsReport()}
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
                </label>
                <ReactSelect
                  options={Type}
                  defaultValue={mfPledgeDetailsReport?.Type !== '0' ? mfPledgeDetailsReport?.Type : Type[0]}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
                        Type: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
                        Type: "",
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
                  Co.Name
                </label>
                <ReactSelect
                  options={companyName}
                  defaultValue={mfPledgeDetailsReport?.Co_Name !== 0 ? mfPledgeDetailsReport?.Co_Name : companyName[0]}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
                        Co_Name: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
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
                  Type of Investment
                </label>
                <ReactSelect
                  options={investmentType}
                  defaultValue={mfPledgeDetailsReport?.Type_Of_Investment !== 'All' ? mfPledgeDetailsReport?.Type_Of_Investment : investmentType[0]}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
                        Type_Of_Investment: selectedOption.value,
                      });
                    } else {
                      // Handle the case when the field is cleared
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
                        Type_Of_Investment: "",
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
                  Scheme Name

                </label>
                <ReactSelect
                  options={scheme}
                  defaultValue={scheme?.find(
                    (option) =>
                      option.label === mfPledgeDetailsReport?.Scheme_Name
                  )}
                  isClearable
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      getIsin(selectedOption)
                    } else {
                      // Handle the case when the field is cleared
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
                        Scheme_Name: "",
                        ISINId: 0,
                        ISIN: ''
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
            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label fs-md"
                  htmlFor="txtAddInterestDays"
                >
                  As On Date
                  <span className="text-danger">*</span>
                </label>

                <div>
                  <input
                    type="date"
                    id="date"
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
                      setMfPledgeDetailsReport({
                        ...mfPledgeDetailsReport,
                        As_On_Date: e.target.value,
                      });
                      setIsRefreshed(true);
                    }}
                    defaultValue={mfPledgeDetailsReport?.As_On_Date}
                  />
                </div>

              </div>

              <div className="col-lg-3 col-md-3  form-group mb-0">
                <label
                  className="form-label global-label-tag"
                  htmlFor="txtAddSecurityName"
                >
                  ISIN
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="txtAddSecurityName"
                  placeholder="ISIN"
                  autoComplete="off"
                  maxLength="50"
                  value={mfPledgeDetailsReport?.ISIN}
                  onChange={(e) => {
                    setMfPledgeDetailsReport({ ...mfPledgeDetailsReport, ISIN: e.target.value })
                    // Set isRefreshed to true to indicate unsaved changes
                    setIsRefreshed(true);
                  }}
                />

              </div>
            </div>
          </div>
        </div>
        <div className="panel-container show px-3 fdReport">
          <div className="panel-content  fdReport">
            {isTableOpen && (
              <>
                <MFPledgeDetailsReportGrid tableData={tableData} mfPledgeDetailsReport={mfPledgeDetailsReport} />
              </>
            )}
          </div></div>
      </div>
    </>
  );
};

export default MFPledgeDetailsReport;
