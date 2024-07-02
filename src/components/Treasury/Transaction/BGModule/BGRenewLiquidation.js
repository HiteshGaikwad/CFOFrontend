import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import { getUserDataFromStorage } from "../../../../config/service";
import BGRenewLiquidationGrid from "../../../Grids/TreasuryGrids/Transaction/BGModuleGrids/BGRenewLiquidationGrid";

const searchNodes = {
    BankName: '',
    Entity: '',
    ExpiryDate: null,
    BGNo: '',
    BGRefNo: ''
}
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

const BGRenewLiquidation = ({ props }) => {
    const [userInfo, setUserInfo] = useState([]);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [initialFieldValues, setInitialFieldValues] = useState({});


    const [newSearchData, setNewSearchData] = useState(searchNodes);
    const [bankNames, setBankNames] = useState([]);
    const [entity, setEntity] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const userData = getUserDataFromStorage()

    // search user data

    async function handleSearchUser() {
        try {
            setIsLoading(true)
            let notify;
            let flag = true;
            for (const key in newSearchData) {
                if (newSearchData[key] !== '' && newSearchData[key] !== 0 && newSearchData[key] !== null) {
                    flag = false;
                    break;
                }
            }
            if (!flag) {
                let data = {
                    BankName: newSearchData?.BankName === '' ? 0 : newSearchData?.BankName,
                    Entity: newSearchData?.Entity === '' ? 0 : newSearchData?.Entity,
                    BG_No: newSearchData?.BGNo,
                    ExpiryDate: newSearchData?.ExpiryDate,
                    BG_RefNo: newSearchData?.BGRefNo
                };

                const result = await RestfullApiService(data, "user/GetBGTransctionRenewLiquidation");
                setUserInfo(result?.Result?.Table1);
                if (result?.Status === 400) {
                    notify = () => toast.error(result?.Description)
                }
            } else {
                notify = () => toast.error('Please Select At Least One Value.')
            }
            notify()
        } catch (error) { }
        finally {
            setIsLoading(false)
        }
    }


    const handleInputChange = () => {
        const inputFields = document.querySelectorAll("input, textarea");
        const refresh = Array.from(inputFields).some(
            (input) => input.value !== initialFieldValues[input.name]
        );
        setIsRefreshed(refresh);
    };


    const handleTextField = (e, type) => {
        const inputValue = e.target.value;

        if (inputValue === "" || /^[0-9A-Za-z-/\\\\,.#=&():%@']+$/.test(inputValue)) {
            if (type === 'bgno') {
                setNewSearchData({ ...newSearchData, BGNo: inputValue });
            } else {
                setNewSearchData({ ...newSearchData, BGRefNo: inputValue });
            }
        }
        // Set isRefreshed to true to indicate unsaved changes
        setIsRefreshed(true);
    };

    function handleClearButton() {
        setNewSearchData(searchNodes);
        setUserInfo({})
        document.getElementById('expiryDate').value = '';
    }

    const handleDeleteUser = async (user) => {
        let notify;
        try {
            let data = {
                ISINId: user?.ISINId
            };
            // API call
            const result = await RestfullApiService(data, "user/DeleteMFISIN");
            if (result?.Status === 200) {
                notify = () => toast.success(result?.Description)
            }
            notify();
        } catch (error) { }
    };

    async function handleEditUser(user) {
        try {
            const data = {
                ISINId: user?.ISINId?.toString()
            }
            const result = await RestfullApiService(data, 'user/GetSingleMFISINByID')
            const val = result?.Result?.Table1[0];
            setNewSearchData({
                ...newSearchData,

            })
        } catch (error) {

        }
    }

    async function getEntity() {
        try {
            const result = await RestfullApiService('', 'user/DDLFDTransactionsCoName')
            setEntity(result?.Result?.Table1)
        } catch (error) {

        }
    }
    async function getBankNames() {
        try {
            const data = {
                Type: "bank",
                id: 0
            }
            const result = await RestfullApiService(data, 'user/DDLFDTransactionsBankName')
            setBankNames(result?.Result?.Table1)
        } catch (error) {

        }
    }
    useEffect(() => {
        getEntity()
        getBankNames()
    }, [])
    useEffect(() => {
        const inputFields = document.querySelectorAll("input, textarea");
        const initialValues = {};
        inputFields.forEach((input) => {
            initialValues[input.name] = input.value;
        });
        setInitialFieldValues(initialValues);
    }, []);

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


    return (
        <>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>Renew & Liquidation</h2>

                    <div className="panel-toolbar ml-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-primary text-white mr-2"
                            onClick={() => {
                                handleSearchUser()
                            }}
                            disabled={isLoading}
                            id="btn_Save"
                            style={{ minWidth: '75px' }}
                        >
                            {isLoading ? (
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
                            onClick={() => {
                                //   if (
                                //     !isRefreshed ||
                                //     window.confirm(
                                //       "You have unsaved changes. Are you sure you want to leave this page?"
                                //     )
                                //   ) {
                                // }
                                handleClearButton();
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
                                        Bank Name
                                    </label>
                                    <ReactSelect
                                        options={bankNames}
                                        value={newSearchData?.BankName === '' ? '' : bankNames?.find(
                                            (option) => option.label === newSearchData?.BankName
                                        )}
                                        isClearable
                                        onChange={(selectedOption) => {
                                            if (selectedOption) {
                                                setNewSearchData({
                                                    ...newSearchData,
                                                    BankName: selectedOption?.value,
                                                });
                                            } else {
                                                // Handle the case when the field is cleared
                                                setNewSearchData({
                                                    ...newSearchData,
                                                    BankName: "",
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
                                        Entity
                                    </label>
                                    <ReactSelect
                                        options={entity}
                                        value={newSearchData?.Entity === '' ? '' : entity?.find(
                                            (option) => option.label === newSearchData?.Entity
                                        )}
                                        isClearable
                                        onChange={(selectedOption) => {
                                            if (selectedOption) {
                                                setNewSearchData({
                                                    ...newSearchData,
                                                    Entity: selectedOption?.value
                                                });
                                            } else {
                                                // Handle the case when the field is cleared
                                                setNewSearchData({
                                                    ...newSearchData,
                                                    Entity: "",
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
                                        className="form-label fs-md"
                                        htmlFor="txtAddInterestDays"
                                    >
                                        Expiry Date
                                    </label>

                                    <div>
                                        <input
                                            type="date"
                                            id="expiryDate"
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
                                                setNewSearchData({ ...newSearchData, ExpiryDate: (e.target.value) });
                                            }
                                            }
                                            value={newSearchData?.ExpiryDate}
                                        />
                                    </div>

                                </div>
                                <div className="col-lg-3 col-md-3  form-group mb-0">
                                    <label
                                        className="form-label global-label-tag"
                                        htmlFor="txtAddSecurityName"
                                    >
                                        BG No
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter BG No"
                                        autoComplete="off"
                                        value={newSearchData?.BGNo}
                                        onChange={(e) => {
                                            handleTextField(e, 'bgno');
                                            // Set isRefreshed to true to indicate unsaved changes
                                            setIsRefreshed(true);
                                        }}
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
                                        BG Ref No
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtAddSecurityName"
                                        placeholder="Enter BG Ref No"
                                        autoComplete="off"
                                        value={newSearchData?.BGRefNo}
                                        onChange={(e) => {
                                            handleTextField(e, 'bgrefno');
                                            // Set isRefreshed to true to indicate unsaved changes
                                            setIsRefreshed(true);
                                        }}
                                        maxLength="50"
                                    />

                                </div>
                            </div>
                        </>
                        {
                            userInfo?.length > 0 && <div className="table-responsive table-wrap watchlist-table tblheight mt-0">
                                <BGRenewLiquidationGrid
                                    userInfo={userInfo}
                                    handleEditUser={handleEditUser}
                                    handleDeleteUser={handleDeleteUser}
                                    handleSearchUser={handleSearchUser}
                                />
                            </div>
                        }

                    </div>

                </div>
            </div>
        </>
    );
};

export default BGRenewLiquidation;
