import React, { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../url";
import { getToken, getUserDataFromStorage, isUserAuthenticated } from "../service";
import { toast } from "react-toastify";
import { useUpload } from "./uploadModalContext";
import excelLogo from "../../assets/images/excel-logo.svg";
import Backdrop from '@mui/material/Backdrop'

const UploadModal = () => {
    const { isUploadOpen, closeUpload } = useUpload();
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const handleInputChange = (event) => {
        console.log(event);
        if (event) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
        } else {
            const notify = () => toast.error("vhjbbve")
            notify()
        }
    };
    const userData = getUserDataFromStorage();

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
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
        let notify = null;
        try {
            //  = () => toast.success("File uploaded successfully.");
            const formData = new FormData();
            formData.append("File", file);
            formData.append("UserID", userData?.EmpID);
            if (file) {
                let token;
                if (isUserAuthenticated()) {
                    token = getToken();
                }

                const respose = await fetch(
                    BASE_URL + "user/UploadPanDetails",
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const result = await respose.json();
                if (result?.Status === 200) {
                    closeUpload()
                    notify = () => toast.success(result?.Description);
                } else if (result?.Status === 400) {
                    notify = () => toast.error(result?.Description);
                }

                notify();
            }
            else {
                notify = () => toast.error("Select a file to upload.");

                notify();
            }
            setFile(null);
            document.getElementById('fileUpload').value = '';
        } catch (error) { }
        // finally {
        //     if (file) {
        //         setFile(null);
        //         document.getElementById('fileUpload').value = '';
        //     }
        // }
    };


    const handleDownloadTeplate = () => {
        const url = `${BASE_URL}user/DownloadSamplePanDetails`;
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        // Set the download attribute with a default file name
        link.setAttribute('download', 'sample-pan-details.xlsx');
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
    }, [isUploadOpen]);

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isUploadOpen}
            >
                <div
                    className="modal fade example-modal-centered-transparent show"
                    id="modal"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: "block", paddingRight: "17px", left: '15% ', top: '10%' }}
                    aria-modal="true"
                >
                    {/* <div
                        className="modal-dialog "
                        role="document"
                    > */}
                    <div className="modal-content" style={{ width: '70%' }}>
                        <div className="modal-header">
                            <div className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'black' }}>Upload Pan Details</h2>

                            </div>
                            <button
                                type="button"
                                className="close text-white"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={() => closeUpload()}
                            >
                                <span aria-hidden="true">
                                    <i className="fa fa-times" style={{ color: 'black' }}></i>
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* <div className="panel"> */}

                            <>
                                {/* <div className="panel-container show pl-3"> */}
                                <div className="panel-content">
                                    <>

                                        <div
                                            className="drag-area"
                                            accept=".xls,.xlsx,.csv"
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

                                    </>
                                </div>
                                {/* </div> */}
                            </>
                            {/* </div> */}
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', }}>
                            <div onClick={() => handleDownloadTeplate()}>
                                <img
                                    src={excelLogo}
                                    alt="excel file logo"
                                    title="Excel file "
                                    style={{ width: "40px" }}

                                />
                            </div>
                            <div
                            // style={{
                            //     display: "flex",
                            //     flexDirection: "row-reverse",
                            //     gap: "10px",
                            //     justifyContent:'space-between'
                            // }}
                            >
                                <button
                                    className="upload-btn bulkupload-btn"
                                    title="Upload"
                                    onClick={() => handleFileUpload()}
                                    style={{ height: "2rem" }}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </Backdrop>
        </>
    );
};

export default UploadModal;
