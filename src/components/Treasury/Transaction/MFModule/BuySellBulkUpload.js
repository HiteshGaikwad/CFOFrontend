import React, { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../../../../config/url";
import { toast } from "react-toastify";
import {
    getToken,
    getUserDataFromStorage,
    isUserAuthenticated,
} from "../../../../config/service";
import { Link } from "react-router-dom";
import excelLogo from "../../../../assets/images/excel-logo.svg";

import ReactSelect from "react-select";
import ErrorModal from "../../../../config/ErrorModal";

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
const UploadType = [
    {
        label: 'Buy',
        value: '0'
    },
    {
        label: 'Sell',
        value: '1'
    }
]
const BuySellBulkUpload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [uploadType, setUploadType] = useState('');
    const [errorText, setErrorText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);


    const handleInputChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };
    const userData = getUserDataFromStorage();

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        setFile(selectedFile);
    };

    const handleBrowseClick = () => {
        inputFileRef.current.click();
        // setError("");
    };

    const inputFileRef = React.createRef();

    const showFileName = () => {
        if (file) {
            return <span className="text-info f-14">{file.name}</span>;
        } else {
            return (
                <p style={{ color: "red", fontWeight: "600", marginTop: "5px" }}>
                    {/* {error} */}
                </p>
            );
        }
    };

    const handleFileUpload = async () => {
        let notify;
        try {

            setIsVisible(true);
            if (uploadType === '') {
                setError('Please Select An Upload Type.')
            }

            if (uploadType !== '') {
                const formData = new FormData();
                formData.append("File", file);
                formData.append("UserID", userData?.EmpID);
                formData.append("UploadType", uploadType);
                if (file) {
                    let token;
                    if (isUserAuthenticated()) {
                        token = getToken();
                    }

                    const respose = await fetch(
                        BASE_URL + "user/MFBuySellBulkUpload",
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const result = await respose.json();
                    console.log(result);
                    if (result?.Status === 200) {
                        notify = () => toast.success(result?.Description);
                    } else if (result?.Status === 400) {
                        setIsModalOpen(true);
                        const val = (result?.Description)
                        console.log(typeof (result?.Description));
                        setErrorText(val)
                    }
                    setFile(null);
                    document.getElementById('fileUpload').value = '';
                } else {
                    notify = () => toast.error("Select a file to upload.");
                }
            } else {
                notify = () => toast.error('Please Select An Upload Type.');
            }
            notify();
        } catch (error) { } finally {
            document.getElementById('fileUpload').value = '';
            setIsVisible(false)
        }
    };


    const handleDownloadTeplate = () => {
        // const url = 'http://localhost:5000/api/user/DownloadSampleFDBulkUpload';
        if (uploadType === '') {
            const notify = () => toast.error('Please Select Upload Type.');
            notify()
        } else {
            const url = `${BASE_URL}user/DownloadSampleMFBuySellBulkUpload?UploadType=${uploadType}`;
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = url;
            // Set the download attribute with a default file name
            link.setAttribute('download', 'MF-BuySell-BulkUpload.xlsx');
            // Append the link to the body
            document.body.appendChild(link);
            // Programmatically click the link to trigger the download
            link.click();
            // Remove the link from the document
            document.body.removeChild(link);
        }
    };

    return (
        <>

            <div>
                <div className="panel">
                    <div className="panel-hdr">
                        <h2>Buy Sell Bulk Upload</h2>
                        <div
                            className=" mb-2"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "5px",
                                marginLeft: "12px",
                            }}
                        >
                            <span style={{ fontWeight: "600", fontSize: "14px" }}>
                                Download Sample File
                            </span>
                            <div onClick={() => handleDownloadTeplate()}>
                                <img
                                    src={excelLogo}
                                    alt="excel file logo"
                                    title="Excel file "
                                    style={{ width: "45px" }}

                                />
                            </div>
                        </div>
                    </div>
                    <>
                        <div className="panel-container show pl-3">
                            <div className="panel-content">
                                <>
                                    <div className="col-lg-5 col-md-5 form-group mb-3">
                                        <label
                                            className="form-label global-label-tag"
                                            htmlFor="ddlAddSecurityCategory"
                                        >
                                            Upload Type
                                            <span className="text-danger">*</span>
                                        </label>
                                        <ReactSelect
                                            options={UploadType}
                                            value={UploadType?.find(
                                                (option) =>
                                                    option.label === uploadType
                                            )}
                                            isClearable
                                            // isDisabled={newBuyEntry?.Type_Of_Investment === 'Sponser Commitment'}
                                            onChange={(selectedOption) => {
                                                if (selectedOption) {
                                                    setUploadType(selectedOption?.label);
                                                } else {
                                                    // Handle the case when the field is cleared
                                                    setUploadType('')
                                                }
                                                setError('');
                                            }}
                                            styles={customStyles}

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
                                    {!isModalOpen ? <>

                                        <div
                                            className="drag-area"
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            style={{ height: "20%" }}
                                        >
                                            <div className="icon" style={{ fontSize: '50px' }}>
                                                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '50px' }}></i>
                                            </div>
                                            <header style={{ fontSize: "14px" }}>
                                                Drag & Drop to Upload File
                                            </header>
                                            <span style={{ fontSize: "14px" }}>OR</span>
                                            <button
                                                type="button"
                                                style={{
                                                    fontSize: "14px",
                                                    width: "130px",
                                                    height: "35px",
                                                }}
                                                onClick={handleBrowseClick}
                                            >
                                                Browse File
                                            </button>
                                            {showFileName()}
                                            <input
                                                id="fileUpload"
                                                type="file"
                                                accept=".xls,.xlsx,.csv"
                                                required
                                                data-parsley-required-message="Please select with extension .xls,.xlsx."
                                                hidden
                                                onChange={handleInputChange}
                                                ref={inputFileRef}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row-reverse",
                                                gap: "10px",
                                            }}
                                        >
                                            <button
                                                className="upload-btn bulkupload-btn"
                                                title="Upload"
                                                onClick={() => handleFileUpload()}
                                                style={{ height: "2rem" }}
                                                disabled={isVisible}
                                            >
                                                {isVisible ? (
                                                    <i
                                                        className="fa fa-spinner fa-spin"
                                                        style={{ fontSize: "14px" }}
                                                    ></i>
                                                ) : (
                                                    <span id="labelsignin">Upload</span>
                                                )}
                                            </button>
                                        </div>
                                    </> :
                                        <>
                                            <div style={{ height: "20%", border: '1px solid rgb(247, 243, 243)', borderRadius: '10px', padding: '10px', backgroundColor: 'rgb(247, 243, 243)' }} >
                                                <p style={{ fontSize: '16px', fontWeight: '600' }}>Validation Error</p>
                                                <p>{errorText.split('\r').map((errorline) => {
                                                    return (
                                                        <h6>{errorline}</h6>
                                                    )
                                                })}
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row-reverse",
                                                    gap: "10px",
                                                }}
                                            >
                                                <button
                                                    className=""
                                                    // title="Upload"
                                                    onClick={() => { setIsModalOpen(false); }}
                                                    style={{ height: "2rem", width: '4rem', border: '0.1px solid grey', borderRadius: '5px', marginTop: '10px' }}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </>
                                    }
                                </>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

export default BuySellBulkUpload