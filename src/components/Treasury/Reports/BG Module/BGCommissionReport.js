import React, { useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import BGCommissionReportGrid from "../../../Grids/TreasuryGrids/Reports/BG Module/BGCommissionReportGrid";


const status = [
    {
        value: "1",
        label: "Active",
    },
    {
        value: "2",
        label: "Matured",
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
    Entity_Name: 0,
    Bank_Name: 0,
    From_Date: '',
    To_Date: '',
    Status: "",
    Bg_No: ''
};

const err = {
    From_Date: '',
    To_Date: ''
}

const BGCommissionReport = (props) => {

    const [fdInterestReport, setFdInterestReport] = useState(
        fdInterest
    );
    const [error, setError] = useState({});
    const [isTableOpen, setIsTableOpen] = useState(false);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [initialFieldValues, setInitialFieldValues] = useState({});
    const [coName, setCoName] = useState([]);

    const [userInfo, setUserInfo] = useState([]);
    const [bankName, setBankName] = useState([]);
    const [entity, setEntity] = useState([]);

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
        return sDate <= tDate;
    }

    async function handleInterestReport() {
        let notify;
        try {
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
            let errors = err;
            if (fdInterestReport?.From_Date === '') {
                errors = { ...errors, From_Date: 'Please Select From Date.' }
            }
            if (fdInterestReport?.To_Date === '') {
                errors = { ...errors, To_Date: 'Please Select To Date.' }
            }
            setError(errors)
            // Perform validation

            let flag = false;
            for (const key in errors) {
                if (errors[key] !== "") {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                const validate = validateDate(fdInterestReport?.From_Date, fdInterestReport?.To_Date);
                if (validate) {
                    // If no validation errors, proceed to save
                    const data = {
                        PDFCode: 0,
                        BankName: fdInterestReport?.Bank_Name,
                        Status: fdInterestReport?.Status,
                        CompanyName: fdInterestReport?.Entity_Name,
                        BGNo: fdInterestReport?.Bg_No,
                        FromDate: fdInterestReport?.From_Date === '' ? null : fdInterestReport?.From_Date,
                        ToDate: fdInterestReport?.To_Date === '' ? null : fdInterestReport?.To_Date
                    }
                    const result = await RestfullApiService(
                        data,
                        "user/GetBGCommissionReportData"
                    );

                    setUserInfo(result?.Result?.Table1)
                    console.log(result?.Result?.Table1);

                    // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
                    setIsRefreshed(false);
                    setIsTableOpen(true);
                } else {
                    notify = () => toast.error('From Date should be less than To Date.')
                }
            } else {
                notify = () => toast.error('Mandatory fields should not be empty.')
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
    async function getBankNames() {
        try {
            const data = {
                Type: 'bank',
                id: 0
            }
            const result = await RestfullApiService(data, 'user/DDLFDTransactionsBankName')
            setBankName(result?.Result?.Table1)
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
        getBankNames()
    }, [])
    return (
        <>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>BG Commission Report </h2>
                    <div className="panel-toolbar ml-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-primary text-white mr-2"
                            id="btn_Save"
                            onClick={() => handleInterestReport()}
                        >
                            Search
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
                                    Bank Name
                                </label>
                                <ReactSelect
                                    options={bankName}
                                    value={fdInterestReport?.Bank_Name === 0 ? "" : bankName?.find(
                                        (option) => option.label === fdInterestReport?.Bank_Name
                                    )}
                                    isClearable
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setFdInterestReport({
                                                ...fdInterestReport,
                                                Bank_Name: selectedOption.label,
                                            });
                                        } else {
                                            // Handle the case when the field is cleared
                                            setFdInterestReport({
                                                ...fdInterestReport,
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
                            </div>
                            <div className="col-lg-3 col-md-3  form-group mb-0">
                                <label
                                    className="form-label global-label-tag"
                                    htmlFor="ddlAddSecurityCategory"
                                >
                                    Entity Name
                                </label>
                                <ReactSelect
                                    options={coName}
                                    value={fdInterestReport?.Entity_Name === 0 ? "" : coName?.find(
                                        (option) => option.label === fdInterestReport?.Entity_Name
                                    )}
                                    isClearable
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setFdInterestReport({
                                                ...fdInterestReport,
                                                Entity_Name: selectedOption.label,
                                            });
                                        } else {
                                            // Handle the case when the field is cleared
                                            setFdInterestReport({
                                                ...fdInterestReport,
                                                Entity_Name: "",
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
                                    className="form-label global-label-tag"
                                    htmlFor="txtAddSecurityName"
                                >
                                    BG No.
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="txtAddSecurityName"
                                    placeholder="BG No."
                                    autoComplete="off"
                                    maxLength="50"
                                    value={fdInterestReport?.Bg_No}
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
                                    From Date <span className="text-danger">*</span>
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
                                    To Date <span className="text-danger">*</span>
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

                        </div>

                    </div>
                </div>
                <div className="panel-container show px-3 fdReport" >
                    <div className="panel-content fdReport" >
                        {
                            userInfo?.length !== 0 && <div className="table-responsive table-wrap watchlist-table tblheight">
                                <BGCommissionReportGrid
                                    userInfo={userInfo}
                                    searchData={fdInterestReport}
                                />
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    );
};

export default BGCommissionReport;
