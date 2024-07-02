import React, { useEffect, useMemo, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";
import { FaRegEdit } from "react-icons/fa";
import DeleteButton from "../../../config/DeleteButton";
import { BASE_URL } from "../../../config/url";

const UserMasterGrid = ({
  searchInput,
  userInfo,
  handleEditUser,
  handleDeleteUser,
  setAddUser,
  setIsEdit,
}) => {
  const [visible, setVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Sr No.",
        accessor: (row, index) => index + 1,
        Cell: ({ value }) => <div className="text-left">{value}</div>,
        width: 90,
        minWidth: 90,
      },
      {
        Header: "Name",
        accessor: "FullName",
        width: 200,
      },
      {
        Header: "Employee Code",
        accessor: "EmpCode",
        width: 120,
        minWidth: 120,
      },
      {
        Header: "Reporting Manager",
        accessor: "ReportingManager",
        width: 200,
        minWidth: 200
      },
      {
        Header: "Mobile",
        accessor: "MobileNumber",
        width: 200,
      },
      {
        Header: "Email Id",
        accessor: "EmailAddress",
        width: 100,
        minWidth: 100
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className=" action-button">
            <button
              title="Edit"
              style={{
                border: "none",
                height: "36px",
                backgroundColor: "transparent",
                width: "36px",
                borderRadius: "18px",
                margin: "0px 13px",
              }}
              onClick={() => {
                handleEditUser(row.original);
                setAddUser(true);
                setIsEdit(true);
              }}
            >
              <FaRegEdit style={{ color: "#EB6400", fontSize: "18px" }} />
            </button>
          </div>
        ),
        disableSortBy: true,
        width: 200,
        maxWidth: 200,
        headerClassName: "header-center",
      },
    ],
    []
  );

  const data = useMemo(() => userInfo || [], [userInfo]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, pageSize },
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const downloadCSV = async () => {
    try {
      const url = `${BASE_URL}user/DownloadAdminEmployeeDetail?name=${searchInput ? searchInput : ''}`;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employee-details-master.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
    }
  }

  const toggleSticky = () => {
    if (window.scroll > 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleSticky);
    return () => {
      window.removeEventListener('scroll', toggleSticky);
    }
  }, []);

  return (
    <>
      <div className="city-table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <button onClick={downloadCSV} className="custom-export-button">
            EXPORT
          </button>
        </div>
        <table
          {...getTableProps()}
          id="tableMaturity"
          className="table table-bordered table-hover table-striped w-100"
        >
          <thead className={`bg-highlight sticky-on  ${isSticky ? 'sticky-on' : ''}`}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps({
                      ...(column.disableSortBy
                        ? {}
                        : column.getSortByToggleProps()),
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                        position: "relative",
                      },
                    })}
                  >
                    <div style={{ display: "inline-block", fontSize: "12px" }}>
                      {column.render("Header")}
                    </div>
                    {!column.disableSortBy && (
                      <span
                        style={{
                          position: "absolute",
                          whiteSpace: "nowrap",
                          padding: "5px",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {column.isSorted ? (
                          <i
                            className={`fa-solid ${column.isSortedDesc
                              ? "fa-arrow-down"
                              : "fa-arrow-up"
                              }`}
                            style={{ color: "gray" }}
                          ></i>
                        ) : (
                          <>
                            <i
                              className="fa-solid fa-arrow-up"
                              style={{ color: "#A9A9A9" }}
                            ></i>
                            <i
                              className="fa-solid fa-arrow-down"
                              style={{ color: "#A9A9A9" }}
                            ></i>
                          </>
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} style={{ overflowY: 'auto', height: '10%' }}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns?.length} className="text-center">
                  Record not found
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} style={{ fontSize: "11px" }}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            width: cell.column.width,
                            verticalAlign: "middle",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot className={"bg-highlight"} >
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps({
                      ...(column.disableSortBy
                        ? {}
                        : column.getSortByToggleProps()),
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                        position: "relative",
                      },
                    })}
                  >
                    <div style={{ display: "inline-block", fontSize: "12px" }}>
                      {column.render("Header")}
                    </div>
                    {!column.disableSortBy && (
                      <span
                        style={{
                          position: "absolute",
                          whiteSpace: "nowrap",
                          padding: "5px",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {column.isSorted ? (
                          <i
                            className={`fa-solid ${column.isSortedDesc
                              ? "fa-arrow-down"
                              : "fa-arrow-up"
                              }`}
                            style={{ color: "gray" }}
                          ></i>
                        ) : (
                          <>
                            <i
                              className="fa-solid fa-arrow-up"
                              style={{ color: "#A9A9A9" }}
                            ></i>
                            <i
                              className="fa-solid fa-arrow-down"
                              style={{ color: "#A9A9A9" }}
                            ></i>
                          </>
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default UserMasterGrid;
