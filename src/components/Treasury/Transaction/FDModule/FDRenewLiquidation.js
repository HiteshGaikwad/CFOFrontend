import React, { useEffect, useState } from "react";
import { RestfullApiService } from "../../../../config/Api's";
import { toast } from "react-toastify";
import ReactSelect from "react-select";
import { getUserDataFromStorage } from "../../../../config/service";
import FDRenewLiquidationGrid from "../../../Grids/TreasuryGrids/Transaction/FDModuleGrids/FDRenewLiquidationGrid";

const searchNodes={
    BankName:'',
    CompanyName:'',
    MaturityDate:'',
    FDNo:''
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

const FDRenewLiquidation = ({ props }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [error, setError] = useState({});
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [initialFieldValues, setInitialFieldValues] = useState({});


  const [newSearchData, setNewSearchData] = useState(searchNodes);
  const [bankNames, setBankNames] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);

  const userData = getUserDataFromStorage()

  // const handleDateChange = (date) => {
  //   // If a date is selected, generate the current time and combine it with the selected date

  //   let currentDate = "";
  //   currentDate +=
  //     date.slice(8, 10) + "/" + date.slice(5, 7) + "/" + date.slice(0, 4);

  //   setNewSearchData({
  //     ...newSearchData,
  //     From_Date: currentDate,
  //     // Read_Date: currentDate,
  //   });
  //   setError((prevErrors) => ({
  //     ...prevErrors,
  //     From_Date: "",
  //   }));
  // };

  // search user data
  
  async function handleSearchUser() {
    try {
        let notify;
let flag=true;
for(const key in newSearchData){
    if(newSearchData[key]!==''){
flag=false;
break;
    }
}
if(!flag){
      let data = {
            BankName: newSearchData?.BankName,
            MaturityDate: newSearchData?.MaturityDate?newSearchData?.MaturityDate:null,
            CompanyName: newSearchData?.CompanyName,
            FDNo: newSearchData?.FDNo
      };
      const result = await RestfullApiService(data, "user/GetFDTransctionRenewLiquidation");
      setUserInfo(result?.Result?.Table1);
    } else{
notify= ()=> toast.error('Please Select At Least One Value.')
    }
    notify()
    } catch (error) { }
  }


  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const refresh = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefreshed(refresh);
  };


  const handleTextField = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[a-zA-Z][a-zA-Z\s]*$/.test(inputValue)) {
      setNewSearchData({ ...newSearchData, FDNo: inputValue });
    }
    // Set isRefreshed to true to indicate unsaved changes
    setIsRefreshed(true);
  };

  function handleClearButton() {
    setNewSearchData(searchNodes);
    setUserInfo({})
    window.location.reload(true);
    // Set isRefreshed to true to indicate unsaved changes
    // setIsRefreshed(true);
  }

  const handleDeleteUser = async (user) => {
    let notify ;
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
      const data={
        ISINId: user?.ISINId?.toString()
      }
      const result= await RestfullApiService(data,'user/GetSingleMFISINByID')
      const val= result?.Result?.Table1[0];
      setNewSearchData({
        ...newSearchData,
        
      })
    } catch (error) {
      
    }
  }

  async function getCompanyNames(){
    try {
        const result= await RestfullApiService('','user/DDLFDTransactionsCoName')
        setCompanyNames(result?.Result?.Table1)
    } catch (error) {
        
    }
  }
  async function getBankNames(){
    try {
        const data={
            Type: "bank",
  id: 0
        }
        const result= await RestfullApiService(data,'user/DDLFDTransactionsBankName')
        setBankNames(result?.Result?.Table1)
    } catch (error) {
        
    }
  }
  useEffect(()=>{
getCompanyNames()
getBankNames()
  },[])
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
                id="btn_Save"
              >
                Search
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
                      value={bankNames?.find(
                        (option) => option.label === newSearchData.BankName
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSearchData({
                            ...newSearchData,
                            BankName: selectedOption.label,
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
                      Company Name
                    </label>
                    <ReactSelect
                      options={companyNames}
                      value={companyNames?.find(
                        (option) => option.label === newSearchData?.CompanyName
                      )}
                      isClearable
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setNewSearchData({
                            ...newSearchData,
                            CompanyName: selectedOption?.label
                          });
                        } else {
                          // Handle the case when the field is cleared
                          setNewSearchData({
                            ...newSearchData,
                            CompanyName: "",
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
                      Maturity Date 
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
                        onChange={(e) => 
                          { setNewSearchData({ ...newSearchData, MaturityDate: (e.target.value) }) ;
                        }
                          }
                      value={newSearchData?.MaturityDate}
                      />
                    </div>
                   
                  </div>
                  <div className="col-lg-3 col-md-3  form-group mb-0">
                    <label
                      className="form-label global-label-tag"
                      htmlFor="txtAddSecurityName"
                    >
                      FD No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtAddSecurityName"
                      autoComplete="off"
                      defaultValue={newSearchData?.FDNo}
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
              {
                userInfo?.length>0 && <div className="table-responsive table-wrap watchlist-table tblheight mt-0">
                <FDRenewLiquidationGrid
                  userInfo={userInfo}
                  handleEditUser={handleEditUser}
                  handleDeleteUser={handleDeleteUser}
                />
              </div>
              }
              
          </div>
          
        </div>
      </div>
    </>
  );
};

export default FDRenewLiquidation;
