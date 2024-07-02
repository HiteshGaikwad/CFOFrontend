import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import { getUserDataFromStorage } from "../../../../config/service";


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

const mfData = {
    Isin: '',
    SchemeName: '',
    FromDate: '',
    ToDate: '',
    Nav: '',
    AmcCode: '',
    Type1: '',
    Type2: '',
    Type3: ''
}

const err = {
    Nav: '',
    AmcCode: '',
    Type1: '',
    Type2: '',
    Type3: ''
}

const UpdateAifNav = ({ props }) => {
    const [addBankBranch, setAddBankBranch] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [initialFieldValues, setInitialFieldValues] = useState({});

    const [isin, setIsin] = useState([]);
    const [error, setError] = useState(err);
    const [newMFEntry, setNewMFEntry] = useState(mfData);

    const userData = getUserDataFromStorage();

    // search user data

    const handleInputChange = () => {
        const inputFields = document.querySelectorAll("input, textarea");
        const refresh = Array.from(inputFields).some(
            (input) => input.value !== initialFieldValues[input.name]
        );
        setIsRefreshed(refresh);
    };



    // save user data
    async function handleSave() {
        let notify;
        try {
            console.log(newMFEntry);
            // Perform validation
            let errors = err;
            // Function to trim string values
            const trimValue = (value) => {
                return typeof value === "string" ? value.trim() : value;
            };

            // Trim string values in newUser object
            const trimmedUser = Object.fromEntries(
                Object.entries(newMFEntry).map(([key, value]) => [
                    key,
                    trimValue(value),
                ])
            );
            // Update newUser object with trimmed values
            setNewMFEntry(trimmedUser);

            if (newMFEntry?.Nav === "") {
                errors = {
                    ...errors,
                    Nav: "NAV is required.",
                };
            }
            if (newMFEntry?.AmcCode === "") {
                errors = {
                    ...errors,
                    AmcCode: "AMC Code is required.",
                };
            }
            if (newMFEntry?.Type1 === "") {
                errors = {
                    ...errors,
                    Type1: "Type 1 is required.",
                };
            }
            if (newMFEntry?.Type2 === "") {
                errors = {
                    ...errors,
                    Type2: "Type 2 is required.",
                };
            }
            if (newMFEntry?.Type3 === "") {
                errors = {
                    ...errors,
                    Type3: "Type 3 is required.",
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
                    ISIN: newMFEntry?.Isin,
                    FromDate: newMFEntry?.FromDate,
                    AMCCode: newMFEntry?.AmcCode,
                    Type1: newMFEntry?.Type1,
                    Type2: newMFEntry?.Type2,
                    Type3: newMFEntry?.Type3,
                    ToDate: newMFEntry?.ToDate,
                    Scheme: newMFEntry?.SchemeName,
                    NAV: newMFEntry?.Nav

                }
                const result = await RestfullApiService(
                    data,
                    "user/UpdateMFTransactionAIFNavData"
                );
                if (result.Status === 200) {
                    notify = () => toast.success(result?.Description);
                }
                // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
                setIsRefreshed(false);

            } else {
                notify = () => toast.error("Mandatory fields should not be empty.");
            }
            notify();
        } catch (error) {
            // Handle error
        }
    }
    const getISIN = async () => {
        try {
            const data = {
                ISIN: ''
            }
            const result = await RestfullApiService(data, 'user/DDLMFTransactionsISIN');
            setIsin(result?.Result?.Table1);
        } catch (error) {

        }
    }

    const getSchemeName = async (selectedOption) => {
        try {
            const data = {
                ISIN: selectedOption?.value
            }
            const result = await RestfullApiService(data, 'user/GetMFTransactionSchemeName')
            setNewMFEntry({ ...newMFEntry, SchemeName: result?.Result?.Table1[0]?.SchemeName, Isin: selectedOption?.label })
        } catch (error) {

        }
    }
    const handleIsinSelect = (selectedOption) => {
        try {

            getSchemeName(selectedOption)
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

    useEffect(() => {
        const inputFields = document.querySelectorAll("input, textarea");
        const initialValues = {};
        inputFields.forEach((input) => {
            initialValues[input.name] = input.value;
        });
        setInitialFieldValues(initialValues);
    }, []);

    useEffect(() => {
        getISIN();
    }, [])
    return (
        <>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>  Update AIF NAV </h2>

                    <div className="panel-toolbar ml-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-primary text-white mr-2"
                            onClick={() => {
                                handleSave();
                            }}
                            id="btn_Save"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-default"
                            onClick={() => {
                                if (
                                    !isRefreshed ||
                                    window.confirm(
                                        "You have unsaved changes. Are you sure you want clear all fields?"
                                    )
                                ) {
                                    setIsRefreshed(false);
                                    setNewMFEntry(mfData)
                                    window.location.reload()
                                }
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
                <div className="panel-container show">
                    <div className="panel-content">
                        <>
                            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="ddlAddSecurityCategory"
                                    >
                                        ISIN
                                    </label>
                                    <ReactSelect
                                        options={isin}
                                        isClearable
                                        onChange={(selectedOption) => {
                                            if (selectedOption) {
                                                handleIsinSelect(selectedOption)

                                            } else {
                                                // Handle the case when the field is cleared
                                                setNewMFEntry({
                                                    ...newMFEntry,
                                                    Isin: '',
                                                    SchemeName: ''
                                                })

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
                                        Scheme Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter Scheme Name"
                                        autoComplete="off"
                                        value={(newMFEntry?.SchemeName) ? (newMFEntry?.SchemeName) : ''}
                                        // onChange={(e) => {
                                        //     handleTextField(e);
                                        //     setIsRefreshed(true);
                                        // }}
                                        disabled
                                        maxLength="50"
                                    />

                                </div>
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
                                            style={{
                                                width: "100%",
                                                height: "2.8em",
                                                border: "0.1px solid rgb(216, 215, 215)",
                                                outline: "none",
                                                borderRadius: "3px",
                                                padding: "0px 8px",
                                            }}
                                            onChange={(e) => {
                                                setNewMFEntry({ ...newMFEntry, FromDate: e.target.value });
                                                setIsRefreshed(true);
                                            }}
                                            value={newMFEntry?.FromDate}
                                        />
                                    </div>

                                </div>
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
                                            style={{
                                                width: "100%",
                                                height: "2.8em",
                                                border: "0.1px solid rgb(216, 215, 215)",
                                                outline: "none",
                                                borderRadius: "3px",
                                                padding: "0px 8px",
                                            }}
                                            onChange={(e) => {
                                                setNewMFEntry({ ...newMFEntry, ToDate: e.target.value });

                                                setIsRefreshed(true);
                                            }}
                                            value={newMFEntry?.ToDate}
                                        />
                                    </div>

                                </div>

                            </div>
                            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >NAV
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter NAV"
                                        autoComplete="off"
                                        value={newMFEntry?.Nav}
                                        onChange={(e) => {
                                            setNewMFEntry({ ...newMFEntry, Nav: e.target.value })
                                            setError({ ...error, Nav: '' })
                                            setIsRefreshed(true);
                                        }}
                                        maxLength="50"
                                    />
                                    {error?.Nav !== "" && (
                                        <p className="error-validation">{error?.Nav}</p>
                                    )}
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        AMC Code <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter AMC Code"
                                        autoComplete="off"
                                        value={newMFEntry?.AmcCode}
                                        onChange={(e) => {
                                            setNewMFEntry({ ...newMFEntry, AmcCode: e.target.value })
                                            setError({ ...error, AmcCode: '' })
                                            setIsRefreshed(true);
                                        }}
                                        maxLength="50"
                                    />
                                    {error?.AmcCode !== "" && (
                                        <p className="error-validation">{error?.AmcCode}</p>
                                    )}
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        Type 1 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter Type 1"
                                        autoComplete="off"
                                        value={newMFEntry?.Type1}
                                        onChange={(e) => {
                                            setNewMFEntry({ ...newMFEntry, Type1: e.target.value })
                                            setError({ ...error, Type1: '' })
                                            setIsRefreshed(true);
                                        }}
                                        maxLength="50"
                                    />
                                    {error?.Type1 !== "" && (
                                        <p className="error-validation">{error?.Type1}</p>
                                    )}
                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        Type 2 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter Type 2"
                                        autoComplete="off"
                                        value={newMFEntry?.Type2}
                                        onChange={(e) => {
                                            setNewMFEntry({ ...newMFEntry, Type2: e.target.value })
                                            setError({ ...error, Type2: '' })
                                            setIsRefreshed(true);
                                        }}
                                        maxLength="50"
                                    />
                                    {error?.Type2 !== "" && (
                                        <p className="error-validation">{error?.Type2}</p>
                                    )}
                                </div>
                            </div>
                            <div className="row mt-2 mb-0 px-3" style={{ height: "80px" }}>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        Type 3 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter Type 3"
                                        autoComplete="off"
                                        value={newMFEntry?.Type3}
                                        onChange={(e) => {
                                            setNewMFEntry({ ...newMFEntry, Type3: e.target.value })
                                            setError({ ...error, Type3: '' })
                                            setIsRefreshed(true);
                                        }}
                                        maxLength="50"
                                    />
                                    {error?.Type3 !== "" && (
                                        <p className="error-validation">{error?.Type3}</p>
                                    )}
                                </div>

                            </div>
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateAifNav;
