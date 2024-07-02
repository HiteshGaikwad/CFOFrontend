import React, { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../url";
import { getToken, getUserDataFromStorage, isUserAuthenticated } from "../service";
import { toast } from "react-toastify";
import excelLogo from "../../assets/images/excel-logo.svg";
import { useCompany } from "./companyContext";
import Backdrop from '@mui/material/Backdrop'

const CompanyModal = () => {
    const { isCompanyOpen, closeCompany } = useCompany();
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isErrorPresent, setIsErrorPresent] = useState(false);
    const [result, setResult] = useState([]);
    const [isUploadVisible, setIsUploadVisible] = useState(false);


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
        setError("");
    };

    const inputFileRef = React.createRef();

    const showFileName = () => {

        let notify;
        if (file) {
            if (file?.name.length <= 50) {
                const cnt = file?.name.split('.')
                if (cnt.length < 3) {
                    if (file?.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                        return <span className="text-info f-14">{file?.name}</span>;
                    } else {
                        setFile('');
                        notify = () => toast.error('Kindly select valid file. Please Select .xls or .xlsx File !!')
                    }
                } else {
                    setFile('');
                    notify = () => toast.error('Double Extention File Not Allowed. !!')
                }
            } else {
                setFile('');
                notify = () => toast.error('Filename should be upto 50 characters only. !!')
            }
        } else {
            return (
                <p style={{ color: "red", fontWeight: "600", marginTop: "5px" }}>
                    {error}
                </p>
            );
        }
        notify();
    };

    const handleFileUpload = async () => {
        setIsUploadVisible(true)
        let notify = () => toast.success("File uploaded successfully.");
        const formData = new FormData();
        formData.append("File", file);
        formData.append("UserID", userData?.EmpID);
        try {
            if (file) {
                let token;
                if (isUserAuthenticated()) {
                    token = getToken();
                }

                const respose = await fetch(
                    BASE_URL + "user/UploadCompanyDetails",
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
                    if (result?.Result) {
                        setIsErrorPresent(true);
                        setResult(result?.Result)
                    }
                    notify = () => toast.error(result?.Description);
                }
                setFile(null);
                document.getElementById('fileUpload').value = '';
            } else {
                notify = () => toast.error("Select a file to upload.");
            }
            notify();
        } catch (error) { }
        setIsUploadVisible(false)
    };

    const handleDownloadTeplate = () => {
        const url = `${BASE_URL}user/DownloadSampleCompanyDetails`;
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        // Set the download attribute with a default file name
        link.setAttribute('download', 'sample-company-details.xlsx');
        // Append the link to the body
        document.body.appendChild(link);
        // Programmatically click the link to trigger the download
        link.click();
        // Remove the link from the document
        document.body.removeChild(link);
    };


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains("modal")) {
            }
        };

        // Add event listener when the modal component mounts
        document.addEventListener("click", handleOutsideClick);

        // Clean up the event listener when the modal component unmounts
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isCompanyOpen]);

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isCompanyOpen}
            >
                <div
                    className="modal fade example-modal-centered-transparent show"
                    id="modal"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: "block", paddingRight: "17px", left: (isErrorPresent ? '10% ' : '15%'), top: '10%', maxHeight: (isErrorPresent ? '70%' : '80%') }}
                    aria-modal="true"
                >

                    <div className="modal-content" style={{ width: (isErrorPresent ? '80%' : '70%') }}>
                        <div className="modal-header">
                            <div className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'black' }}>Upload Company Details</h2>

                            </div>
                            {
                                isErrorPresent ?
                                    <button
                                        type="button"
                                        className="back-btn"
                                        title="Back"
                                        onClick={() => setIsErrorPresent(false)}
                                        style={{ color: 'black', padding: '5px 15px', color: 'white', borderRadius: '5px', border: 'none', backgroundColor: '#eb6400' }}
                                    >
                                        Back
                                    </button>
                                    :
                                    <button
                                        type="button"
                                        className="close text-white"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => closeCompany()}
                                    >
                                        <span aria-hidden="true">
                                            <i className="fa fa-times" style={{ color: 'black' }}></i>
                                        </span>
                                    </button>
                            }

                        </div>
                        <div className="modal-body">
                            <>
                                {
                                    isErrorPresent ?
                                        <>
                                            <div style={{ color: 'black', }}>
                                                <h5>Wrong Details</h5>
                                                <div style={{ maxHeight: '280px', overflow: 'auto', paddingBottom: '10px' }}>
                                                    <table className="error-table" style={{ fontSize: '12px', textAlign: 'center', overflowY: 'scroll' }}>
                                                        <thead >
                                                            <tr style={{}}>
                                                                <th>Sr No</th>
                                                                <th>Account Code</th>
                                                                <th>Company1 Pan</th>
                                                                <th>Company2 Pan</th>
                                                                <th>Relationship</th>
                                                                <th>RPT Analysis Code</th>
                                                                <th>Audit Limit</th>
                                                                <th>Transaction Type</th>
                                                                <th>Justification</th>
                                                                <th>BasePrice</th>
                                                                <th>Validation Remark</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                result?.map((item) =>
                                                                (
                                                                    console.log(item),
                                                                    <tr key={item?.SrNo}>
                                                                        <td>{item?.SrNo}</td>
                                                                        <td>{item?.AccountCode}</td>
                                                                        <td>{item?.Company1Pan}</td>
                                                                        <td>{item?.Company2Pan}</td>
                                                                        <td>{item?.Relationship}</td>
                                                                        <td>{item?.RPT_Analysis_Code}</td>
                                                                        <td>{item?.AuditLimit}</td>
                                                                        <td>{item?.TransactionType}</td>
                                                                        <td>{item?.Justification}</td>
                                                                        <td>{item?.BasePrice}</td>
                                                                        <td>{item?.ErrorMessage}</td>
                                                                    </tr>
                                                                )
                                                                )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <div className="panel-content">
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
                                                    type="file"
                                                    accept=".xls,.xlsx,.csv"
                                                    id="fileUpload"
                                                    required
                                                    data-parsley-required-message="Please select with extension .xls,.xlsx."
                                                    hidden
                                                    onChange={handleInputChange}
                                                    ref={inputFileRef}
                                                />
                                            </div>
                                        </div>
                                }
                            </>
                        </div>
                        {
                            !isErrorPresent && <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', }}>
                                <div onClick={() => handleDownloadTeplate()}>
                                    <img
                                        src={excelLogo}
                                        alt="excel file logo"
                                        title="Excel file "
                                        style={{ width: "40px" }}

                                    />
                                </div>
                                <div

                                >
                                    <button
                                        className="upload-btn bulkupload-btn"
                                        title="Upload"
                                        onClick={() => handleFileUpload()}
                                        style={{ height: "2rem" }}
                                    >

                                        {isUploadVisible ? (
                                            <i
                                                className="fa fa-spinner fa-spin"
                                                style={{ fontSize: "14px" }}
                                            ></i>
                                        ) : (
                                            <span id="labelsignin">Upload</span>
                                        )}
                                    </button>

                                </div>
                            </div>
                        }

                    </div>
                </div>
                {/* { !isErrorPresent && </div>} */}
            </Backdrop>
        </>
    );
};

export default CompanyModal;
