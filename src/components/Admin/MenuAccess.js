import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../config/url";
import { json, useNavigate } from "react-router-dom";

import '../../flag.css'
import {
  getToken,
  getUserDataFromStorage,
  isUserAuthenticated,
} from "../../config/service";
import { toast } from "react-toastify";
import { RestfullApiService } from "../../config/Api's";
import { Tree } from "primereact/tree";
import ReactSelect from "react-select";

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

const MenuAccess = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [roleInfo, setRoleInfo] = useState([]);
  const [addRole, setAddRole] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const userData = getUserDataFromStorage();
  const [editRoleInfo, setEditRoleInfo] = useState({
    Role_Id: "",
    Role_Name: "",
    Is_Active: 0,
  });
  const [roleJsonObj, setRoleJsonObj] = useState([]);
  const [menuData, setMenuData] = useState([])
  const [roleMenuList, setRoleMenuList] = useState([]);
  const [employees, setEmployees] = useState([])
  const [keys, setKeys] = useState([]);

  const selectedValue = useRef(null)



  const buildTree = (items, parentId = 0, keyPrefix = '0') => {
    return items?.filter(item => item?.ParentId === parentId)?.map((item, index) => ({
      key: `${keyPrefix}-${index}`,
      label: item?.Name,
      data: item?.Url,
      // icon: getIcon(item.Name),
      children: buildTree(items, item?.SId, `${keyPrefix}-${index}`)
    }));
  };


  const [isRefresh, setIsRefresh] = useState(false);

  const [initialFieldValues, setInitialFieldValues] = useState({});



  const handleInputChange = () => {
    const inputFields = document.querySelectorAll("input, textarea");
    const anyDirty = Array.from(inputFields).some(
      (input) => input.value !== initialFieldValues[input.name]
    );
    setIsRefresh(anyDirty);
  };



  async function handleSaveRole() {
    let notify;
    try {
      if (searchInput) {
        let checkedData = [];
        for (const key in selectedKeys) {
          if (selectedKeys[key].checked === true) {
            checkedData.push(selectedKeys[key]);
          }
        }
        const data = {
          EmpCode: searchInput?.toString(),
          JsonString: JSON.stringify(checkedData)
        }
        console.log('sent', checkedData);
        const result = await RestfullApiService(data, 'user/InsertTreeDataEmployeeWise');
        if (result?.Status === 200) {
          setSearchInput('');
          if (selectedValue.current) {
            selectedValue.current.clearValue();
          }
          notify = () => toast.success(result?.Description);

        } else if (result?.Status === 400) {
          notify = () => toast.success(result?.Description);
        }
      }
      else {
        notify = () => toast.error("Please Select Employee Name.");
      }

      notify()
      // window.location.reload()
    } catch (error) { }
  }

  async function getMenuList() {
    try {
      const data = {
        EmpCode: userData?.EmpID,
        RoleId: "-1"
      }
      const result = await RestfullApiService(data, 'user/GetMenuData')
      setMenuData(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function getEmployess() {
    try {
      const data = {
        EmpCode: ''
      }
      const result = await RestfullApiService(data, 'user/GetEmployeeDropDownData');
      setEmployees(result?.Result?.Table1)
    } catch (error) {

    }
  }
  async function handleEmployeeChange(input) {
    try {
      const data = {
        EmpCode: input
      }
      const result = await RestfullApiService(data, 'user/GetTreeCheckNodesEmployee');
      setSelectedKeys(convertPrimeDataToObjectJson(result?.Result?.Table1))
    } catch (error) {

    }
  }
  const convertPrimeDataToObjectJson = (data) => {
    const result = [];
    const processNode = (node, parentKey = '') => {
      const idx = node?.MenuOrderBy.split('.');
      const key = parentKey ? `${parentKey}-${idx[idx.length - 1] - 1}` : `0-${idx[idx.length - 1] - 1}`;
      result[key] = { checked: node?.isChecked === 1, partialChecked: node?.isChecked === -1, label: node?.Name, SId: node?.SId, parentId: node.ParentId };
      const children = data.filter(item =>
        item.ParentId === node.SId).sort((a, b) => a.key - b.key);
      children.forEach((child, index) => processNode(child, key));
    };
    const rootNodes = data.filter(item => item.ParentId === 0).sort((a, b) => a.key - b.key);
    rootNodes.forEach((rootNode, index) => processNode(rootNode, ''));
    return result;
  };

  const handleSelectedKeys = (e) => {
    const response = e.value;
    // Create a copy of selectedKeys to update
    let updatedSelectedKeys = { ...selectedKeys };
    setSelectedKeys(response)
    for (const key in updatedSelectedKeys) {
      if (updatedSelectedKeys[key] !== response[key]) {
        updatedSelectedKeys = {
          ...updatedSelectedKeys,
          [key]: {
            ...updatedSelectedKeys[key],
            checked: response[key]?.checked,
            partialChecked: response[key]?.partialChecked,
          }
        }
      }
    }
    setSelectedKeys(updatedSelectedKeys);
  };

  const handleExport = async () => {
    try {
      const url = `${BASE_URL}user/DownloadEmployeeMenuAccessData`;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Menu-access-details.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download CSV", error);
    }
  }

  useEffect(() => {
    getMenuList()
    getEmployess()
  }, []);

  useEffect(() => {
    const treeData = buildTree(menuData);
    setRoleMenuList(treeData);
  }, [menuData]);

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

  // useEffect to listen for changes in input fields
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isRefresh) {
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
  }, [isRefresh]);
  useEffect(() => {
    const inputFields = document.querySelectorAll("input, textarea");
    const initialValues = {};
    inputFields.forEach((input) => {
      initialValues[input.name] = input.value;
    });
    setInitialFieldValues(initialValues);
  }, []);
  useEffect(() => {
    handleEmployeeChange(searchInput);
  }, [searchInput === ''])
  return (
    <>
      <div className="panel">
        <div className="panel-hdr">
          <h2> Assign Menu To Employee</h2>
          <div className="panel-toolbar ml-2">
            <button
              type="button"
              className="btn btn-sm btn-primary text-white mr-2"
              onClick={() => {
                handleSaveRole();
                setIsActive(!isActive);
                setIsEdit(false);
              }}
              id="btn_Save"
            >
              Save
            </button>
            {/* <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={() => {
                  if (
                    !isRefresh ||
                    window.confirm(
                      "You have unsaved changes. Are you sure you want to leave this page?"
                    )
                  ) {
                    setAddRole(!addRole);
                    setIsActive(true);
                    handleBackButton();
                    setIsEdit(false);
                    setIsRefresh(false);
                  }
                }}
                // onclick="CloseAddEntry()"
              >
                Clear
              </button> */}
          </div>
        </div>
        <div className="panel-container show">
          <div className="panel-content">

            <>
              <div className="row">
                <div id="divSearch" className="col-lg-12 col-md-12">
                  <div className="panel-container show">
                    <div className="panel-content">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  form-group mb-0">
                          <label
                            className="form-label global-label-tag"
                            htmlFor="ddlAddSecurityCategory"
                          >
                            Employee Name
                            <span className="text-danger">*</span>
                          </label>
                          <ReactSelect
                            ref={selectedValue}
                            id='react-select'
                            options={employees}
                            value={employees?.find(
                              (option) => option.value === searchInput
                            )}
                            isClearable
                            onChange={(selectedOption) => {
                              handleEmployeeChange(selectedOption?.value)
                              setSearchInput(selectedOption?.value)
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
                      {/* </div> */}
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'right', paddingRight: '20px' }}>
                        <button className="custom-export-button" style={{ fontSize: '15px', fontWeight: '500' }} onClick={() => handleExport()}>Export</button>
                      </div>
                      {
                        roleMenuList?.length > 0 &&
                        <Tree value={roleMenuList} selectionMode="checkbox" selectionKeys={selectedKeys}
                          onSelectionChange={(e) => handleSelectedKeys(e)} className="w-full mt-0 tree-menu" style={{ fontSize: '14px' }} />
                      }
                    </div>
                  </div>
                </div>
                <div id="divContent" className="col-lg-12 col-md-12"></div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuAccess;
