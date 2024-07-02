import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import TDSEntriesReportGrid from "../../../Grids/TreasuryGrids/Reports/FDModule/TDSEntriesReportGrid";

const reportData = {
    FDNo: "",
    CoName: '',
    Status: '',
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
const status = [
    {
        label: 'Active',
        value: '0'
    },
    {
        label: 'Prematured',
        value: '1'
    },
    {
        label: 'Renew',
        value: '2'
    },
    {
        label: 'Liquidate',
        value: '3'
    },
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

const TDSEntriesReport = () => {
    const [userInfo, setUserInfo] = useState([])
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [initialFieldValues, setInitialFieldValues] = useState({});

    const [newTDSReportData, setNewTDSReportData] = useState(reportData)
    const [error, setError] = useState(err)

    const [coName, setCoName] = useState([])
    var WhereClauseStr = '';

    const handleInputChange = () => {
        const inputFields = document.querySelectorAll("input, textarea");
        const refresh = Array.from(inputFields).some(
            (input) => input.value !== initialFieldValues[input.name]
        );
        setIsRefreshed(refresh);
    };

    const validateDate = (startDate, toDate) => {
        const sDate = new Date(startDate)
        const tDate = new Date(toDate)
        return sDate < tDate;
    }

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
                Object.entries(newTDSReportData)?.map(([key, value]) => [
                    key,
                    trimValue(value),
                ])
            );
            // Update newUser object with trimmed values
            setNewTDSReportData(trimmedUser);
            // Perform validation
            if (newTDSReportData?.FromDate === "") {
                errors = { ...errors, FromDate: "From Date is required." };
            }
            if (newTDSReportData?.ToDate === '') {
                errors = { ...errors, ToDate: "To Date is required." };
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

                let validation = false;
                validation = (newTDSReportData?.FDStartDate !== '' && newTDSReportData?.FDMaturityDate !== '') && validateDate(newTDSReportData?.FDStartDate, newTDSReportData?.FDMaturityDate);
                if (validation) {
                    WhereClauseStr = `WHERE FDD.FD_No like '%${newTDSReportData?.FDNo}%' AND (MaturityDate  between '${newTDSReportData?.FDStartDate}' AND '${newTDSReportData?.FDMaturityDate}') `

                    {
                        WhereClauseStr += newTDSReportData?.CoName ? ` AND CoName='${newTDSReportData?.CoName}'` + "" : ''
                    }
                    {
                        WhereClauseStr += newTDSReportData?.Status ? ` AND FDD.Status='${newTDSReportData?.Status}'` + "" : ''
                    }
                    const data = {
                        WhereClause: WhereClauseStr,
                    }
                    const result = await RestfullApiService(
                        data,
                        "user/GetFDTDSReport"
                    );
                    setUserInfo(result?.Result?.Table1)
                    if (result?.Status === 400) {
                        notify = () => toast.error(result?.Description);
                    }
                    // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
                    setIsRefreshed(false);

                }
                else {
                    notify = () => toast.error("Prematurity date field should be greater than maturity date.");
                }
            } else {
                notify = () => toast.error("Mandatory fields should not be empty.");
            }
            notify();
        }
        catch (error) {
            // Handle error 
        }
    }
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
                    <h2>TDS Entries Report </h2>

                    <div className="panel-toolbar ml-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-primary text-white mr-2"
                            id="btn_Save"
                            onClick={() => searchFdReport()}
                        >
                            Go
                        </button>
                        <button type="button" className="btn btn-sm btn-default" onClick={() => {
                            setNewTDSReportData(reportData)
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
                                    isClearable
                                    value={newTDSReportData?.CoName === '' ? '' : coName?.find(
                                        (option) => option.label === newTDSReportData?.CoName
                                    )
                                    }
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setNewTDSReportData({
                                                ...newTDSReportData,
                                                CoName: selectedOption.label,
                                            });
                                        } else {
                                            // Handle the case when the field is cleared
                                            setNewTDSReportData({
                                                ...newTDSReportData,
                                                CoName: "",
                                            });
                                        }
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
                                    value={newTDSReportData?.Status === '' ? '' : status?.find(
                                        (option) =>
                                            option.value === newTDSReportData?.Status
                                    )}
                                    isClearable
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setNewTDSReportData({
                                                ...newTDSReportData,
                                                Status: selectedOption.value,
                                            });
                                        } else {
                                            // Handle the case when the field is cleared
                                            setNewTDSReportData({
                                                ...newTDSReportData,
                                                Status: "",
                                            });
                                        }
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
                                    maxLength="50"
                                    value={newTDSReportData?.FDNo}
                                    onChange={(e) => setNewTDSReportData({ ...newTDSReportData, FDNo: e.target.value })}
                                />

                            </div>
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
                                            setNewTDSReportData({ ...newTDSReportData, FDStartDate: e.target.value });
                                            setError({ ...error, FDStartDate: '' })
                                            setIsRefreshed(true);
                                        }}
                                        defaultValue={newTDSReportData?.FDStartDate}
                                    />
                                </div>

                                {error?.FDStartDate && (
                                    <div className="error-validation">{error?.FDStartDate}</div>
                                )}
                            </div>
                        </div>
                        <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
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
                                        id="todate"
                                        style={{
                                            width: "100%",
                                            height: "2.8em",
                                            border: "0.1px solid rgb(216, 215, 215)",
                                            outline: "none",
                                            borderRadius: "3px",
                                            padding: "0px 8px",
                                        }}
                                        onChange={(e) => {
                                            setNewTDSReportData({ ...newTDSReportData, FDMaturityDate: e.target.value });
                                            setError({ ...error, FDMaturityDate: '' })
                                            setIsRefreshed(true);
                                        }}
                                        defaultValue={newTDSReportData?.FDMaturityDate}
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
                            userInfo?.length > 0 && <div className="table-responsive table-wrap watchlist-table tblheight">
                                <TDSEntriesReportGrid
                                    userInfo={userInfo}
                                    WhereClauseStr={WhereClauseStr}
                                />
                            </div>
                        }

                    </div>
                </div>
            </div >
        </>
    );
};

export default TDSEntriesReport;
