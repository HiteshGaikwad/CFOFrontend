import React, { useCallback, useEffect, useState } from "react";
import "../../App.css"
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";
import {
  getToken,
  getUserDataFromStorage,
  isUserAuthenticated,
} from "../../config/service";
import { Link } from "react-router-dom";
import excelLogo from "../../assets/images/excel-logo.svg";

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
const UploadRPTCompanyDetails = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

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
    if (file) {
      return <span className="text-info f-14">{file.name}</span>;
    } else {
      return (
        <p style={{ color: "red", fontWeight: "600", marginTop: "5px" }}>
          {error}
        </p>
      );
    }
  };

  const handleFileUpload = async () => {
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
        if(result?.Status===200){
          notify= ()=> toast.success(result?.Description);
          
        } else if(result?.Status===400){
          notify= ()=> toast.error(result?.Description);
        }
        setFile(null);
          document.getElementById('fileUpload').value = '';
      } else {
        notify = () => toast.error("Select a file to upload.");
      }
      notify();
    } catch (error) {}
  };

  const handleDownloadTeplate = () => {
    const url = 'http://localhost:5000/api/user/DownloadSampleCompanyDetails';
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

  return (
    <>
      <div>
        <div className="panel">
          <div className="panel-hdr">
            <h2>Upload Company Details</h2>
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
                      <div onClick={()=>handleDownloadTeplate()}>
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

                  <div
                    className="drag-area"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{ height: "20%" }}
                  >
                    <div className="icon" style={{fontSize:'50px'}}>
                      <i className="fas fa-cloud-upload-alt" style={{fontSize:'50px'}}></i>
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
                      id="fileUpload"
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
                    >
                      Upload
                    </button>
                  </div>
                </>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default UploadRPTCompanyDetails;
