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

const UpdateSchemeName = ({ props }) => {
    const [searchInput, setSearchInput] = useState("");
    const [userInfo, setUserInfo] = useState([]);
    const [addBankBranch, setAddBankBranch] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [initialFieldValues, setInitialFieldValues] = useState({});

    const [isin, setIsin] = useState([]);
    const [error, setError] = useState("");
    const [newMFEntry, setNewMFEntry] = useState({
        Isin: '',
        SchemeName: '',
        NewSchemeName: ''
    });

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
            let flag = false;
            for (const key in newMFEntry) {
                if (newMFEntry[key] !== '') {
                    flag = true;
                }
            }

            // If no validation errors, proceed to save
            if (flag) {
                const data = {
                    ISIN: newMFEntry?.Isin,
                    NewScheme: newMFEntry?.NewSchemeName,

                }
                const result = await RestfullApiService(
                    data,
                    "user/UpdateMFTransactionSchemeName"
                );
                if (result.Status === 200) {
                    notify = () => toast.success(result?.Description);
                    setNewMFEntry({
                        Isin: '',
                        SchemeName: '',
                        NewSchemeName: ''
                    })
                }
                // window.location.reload()
                // After saving, reset the isRefreshed state to indicate that there are no unsaved changes
                setIsRefreshed(false);

            } else {
                notify = () => toast.error("Select at least one field.");
            }
            notify();
        } catch (error) {
            // Handle error
        }
    }
    const handleTextField = (e) => {
        const inputValue = e.target.value;
        if (inputValue !== "") {
            // || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)
            setNewMFEntry({ ...newMFEntry, NewSchemeName: inputValue })
        }
        // Set isRefreshed to true to indicate unsaved changes
        setIsRefreshed(true);
    };

    const getSchemeName = async (selectedOption) => {
        try {
            const data = {
                ISIN: selectedOption?.value
            }
            const result = await RestfullApiService(data, 'user/GetMFTransactionSchemeName')
            setNewMFEntry({ ...newMFEntry, SchemeName: result?.Result?.Table1[0]?.SchemeName, Isin: selectedOption?.value })
        } catch (error) {

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
                    <h2> Update Scheme Name</h2>

                    <div className="panel-toolbar ml-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-primary text-white mr-2"
                            onClick={() => {
                                handleSave();
                                setIsEdit(false);
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
                                        "You have unsaved changes. Are you sure you want to leave this page?"
                                    )
                                ) {
                                    setIsRefreshed(false);
                                    setNewMFEntry({
                                        Isin: '',
                                        SchemeName: '',
                                        NewSchemeName: ''
                                    })
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
                                        value={newMFEntry?.Isin === '' ? '' : isin?.find(
                                            (option) => option.label === newMFEntry?.Isin
                                        )}
                                        onChange={(selectedOption) => {
                                            if (selectedOption) {
                                                getSchemeName(selectedOption)

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
                                <div className="col-lg-5 col-md-5  form-group mb-0">
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
                                        autoComplete="off"
                                        value={newMFEntry?.SchemeName}
                                        maxLength="50"
                                        disabled
                                    />

                                </div>
                                <div className="col-lg-4 col-md-4  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        New Scheme Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter New Scheme Name"
                                        value={newMFEntry?.NewSchemeName}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            handleTextField(e);
                                            // Set isRefreshed to true to indicate unsaved changes
                                            setIsRefreshed(true);
                                        }}
                                        maxLength="50"
                                    />

                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateSchemeName;
