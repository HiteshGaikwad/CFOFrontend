import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import FDDailyInterestGrid from "../../../Grids/TreasuryGrids/Reports/FDModule/FDDailyInterestGrid";

const reportData = {
    FromDate: "",
    ToDate: "",
    CoName: "",
    FDType: ""
}
const err = {
    FromDate: "",
    ToDate: "",
}
const fdType = [
    {
        label: 'Client FD',
        value: '0'
    },
    {
        label: 'Own FD',
        value: '1'
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

const FDOnScreenReport = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [initialFieldValues, setInitialFieldValues] = useState({});
    const [coName, setCoName] = useState([]);

    const [newOnScreenData, setNewOnScreenData] = useState(reportData)
    const [error, setError] = useState(err)

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
                Object.entries(newOnScreenData).map(([key, value]) => [
                    key,
                    trimValue(value),
                ])
            );
            // Update newUser object with trimmed values
            setNewOnScreenData(trimmedUser);
            // Perform validation
            if (newOnScreenData?.FromDate === "") {
                errors = { ...errors, FromDate: "From Date is required." };
            }
            if (newOnScreenData?.ToDate === '') {
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
                validation = (newOnScreenData?.FromDate !== '' && newOnScreenData?.ToDate !== '') && validateDate(newOnScreenData?.FromDate, newOnScreenData?.ToDate);
                if (validation) {
                    const data = {
                        FromDate: newOnScreenData?.FromDate,
                        ToDate: newOnScreenData?.ToDate,
                        CoName: newOnScreenData?.CoName,
                        FDType: newOnScreenData?.FDType
                    }
                    const result = await RestfullApiService(
                        data,
                        "user/GetFDOnScreenReport"
                    );
                    setUserInfo(result?.Result?.Table1[0])
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
                    <h2>FD On-Screen Report </h2>

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
                            setNewOnScreenData(reportData)
                            setUserInfo(null)
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
                                    className="form-label fs-md"
                                    htmlFor="txtAddInterestDays"
                                >
                                    From Date<span className="text-danger">*</span>
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
                                            setNewOnScreenData({ ...newOnScreenData, FromDate: e.target.value })
                                            setError({ ...error, FromDate: '' })
                                            setIsRefreshed(true);
                                        }}
                                        defaultValue={(newOnScreenData?.FromDate)}
                                    />
                                    {error?.FromDate !== "" && (
                                        <p className="error-validation">{error?.FromDate}</p>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3  form-group mb-0">
                                <label
                                    className="form-label fs-md"
                                    htmlFor="txtAddInterestDays"
                                >
                                    To Date<span className="text-danger">*</span>
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
                                            setNewOnScreenData({ ...newOnScreenData, ToDate: e.target.value })
                                            setError({ ...error, ToDate: '' })
                                            setIsRefreshed(true);
                                        }}
                                        defaultValue={newOnScreenData?.ToDate}
                                    />
                                    {error?.ToDate !== "" && (
                                        <p className="error-validation">{error?.ToDate}</p>
                                    )}
                                </div>

                            </div>
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
                                    value={newOnScreenData?.CoName === '' ? '' : coName?.find(
                                        (option) => option.value === newOnScreenData.CoName
                                    )
                                    }
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setNewOnScreenData({
                                                ...newOnScreenData,
                                                CoName: selectedOption.value,
                                            });
                                        } else {
                                            // Handle the case when the field is cleared
                                            setNewOnScreenData({
                                                ...newOnScreenData,
                                                CoName: "",
                                            });
                                        }
                                        setError({ ...error, CoName: "" });
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
                                    FD Type

                                </label>
                                <ReactSelect
                                    options={fdType}
                                    isClearable
                                    value={newOnScreenData?.FDType === '' ? '' : fdType?.find(
                                        (option) => option.value === newOnScreenData?.FDType
                                    )
                                    }
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setNewOnScreenData({
                                                ...newOnScreenData,
                                                FDType: selectedOption.value,
                                            });
                                        } else {
                                            // Handle the case when the field is cleared
                                            setNewOnScreenData({
                                                ...newOnScreenData,
                                                FDType: "",
                                            });
                                        }
                                        setError({ ...error, FDType: "" });
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
                        </div>

                    </div>
                </div>
                {
                    userInfo !== null && <div className="panel-container show px-3 fdReport" >
                        <div className="panel-content" >
                            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        Avg FD
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.AvgFD}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        Interest Income
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.InterestIncome}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        Interest Income Received
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.InterestIncomeReceived}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        Provisional Interest Income
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.PII}
                                        disabled
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
                                        0-30
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.['0-30']}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        30-60
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.['30-60']}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        60-90
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.['60-90']}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        90-180
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.['90-180']}
                                        disabled
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
                                        180-365
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.['180-365']}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        365-700
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        autoComplete="off"
                                        value={userInfo?.['365-700']}
                                        disabled
                                        maxLength="50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>
        </>
    );
};

export default FDOnScreenReport;
