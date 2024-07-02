import React, { useMemo } from "react";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useFilters,
} from "react-table";
import { FaRegEdit } from "react-icons/fa";
import DeleteButton from "../../.././config/DeleteButton";
import { RestfullApiService } from "../../../config/Api's";
import { BASE_URL } from "../../../config/url";
import { getUserDataFromStorage } from "../../../config/service";
// Default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;
  return (
    <input
      defaultValue={filterValue}
      onChange={(e) => {
        setFilter(e.target.value); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
      style={{
        width: "100%",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "12px",
        marginTop: "5px"
      }}
    />
  );
}
const PanDetailsMasterGrid = ({
  searchInput,
  panDetails,
  handleEditPanDetails,
  handleDeletePanDetails,
  setAddPanDetails,
  setIsEdit,
}) => {
  const userData = getUserDataFromStorage();
  const columns = useMemo(
    () => [
      {
        Header: "Sr No.",
        accessor: (row, index) => index + 1,
        Cell: ({ value }) => <div className="text-left">{value}</div>,
        width: 100,
        minWidth: 80,
        Filter: () => null, // No filter for Sr No. column
      },
      {
        Header: "Party Name",
        accessor: "PartyName",
        width: 300,
        minWidth: 200,
        Filter: DefaultColumnFilter,
        disableSortBy: true
      },
      {
        Header: "Entity",
        accessor: "Entity",
        width: 300,
        minWidth: 150,
        Filter: DefaultColumnFilter,
        disableSortBy: true
      },
      {
        Header: "Pan Number",
        accessor: "PanNumber",
        width: 500,
        minWidth: 170,
        Filter: DefaultColumnFilter,
        disableSortBy: true
      },
      {
        Header: "Criteria",
        accessor: "Criteria",
        width: 200,
        minWidth: 150,
        Filter: DefaultColumnFilter,
        disableSortBy: true
      },
      {
        Header: "Relation",
        accessor: "Relation",
        width: 200,
        minWidth: 170,
        Filter: DefaultColumnFilter,
        disableSortBy: true
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="action-button">
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
                if (userData?.Role === 'Maker') {
                  handleEditPanDetails(row.original);
                  setAddPanDetails(true);
                  setIsEdit(true);
                }
              }}
            >
              <FaRegEdit style={{ color: "#EB6400", fontSize: "18px" }} />
            </button>
            <DeleteButton onDelete={() => handleDeletePanDetails(row.original)} />
          </div>
        ),
        disableSortBy: true,
        Filter: () => null, // No filter for Actions column
        width: 150,
        minWidth: 150,
        headerClassName: "header-center",
      },
    ],
    []
  );
  const data = useMemo(() => panDetails || [], [panDetails]);
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
    useFilters,
    useSortBy,
    usePagination
  );
  const column = [
    { Header: "ID", accessor: "Id" },
    { Header: "PartyName", accessor: "PartyName" },
    { Header: "Entity", accessor: "Entity" },
    { Header: "PanNumber", accessor: "PanNumber" },
    { Header: "Criteria", accessor: "Criteria" },
    { Header: "Relation", accessor: "Relation" },
    { Header: "CreatedBy", accessor: "CreatedBy" },
    { Header: "Status", accessor: "Status" }
  ];

  const convertToCSV = () => {
    const csvContent = [
      // Header row
      column.map((column) => column.Header).join(","),
      // Data rows
      ...panDetails.map((row) =>
        column.map((column) => row[column.accessor]).join(",")
      ),
    ].join("\n");
    return csvContent;
  };

  // Function to download CSV file
  const downloadCSV = async () => {
    try {

      const url = `${BASE_URL}user/DownloadRPTPANMaster?accountcode=${searchInput ? searchInput : ''}`;
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      // Set the download attribute with a default file name
      link.setAttribute('download', 'pan-details-master.xlsx');
      // Append the link to the body
      document.body.appendChild(link);
      // Programmatically click the link to trigger the download
      link.click();
      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {

    }
  }
  return (
    <div className="city-table-container" style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      // className="custom-export-button"
      >
        <button onClick={() => downloadCSV()} className="custom-export-button">
          EXPORT
        </button>
      </div>
      <style>
        {`
        .city-table-container table {
          min-width: 100%; / Make the table fill its container /
        }
          .city-table-container table tbody tr td {
            padding: 5px 10px; / Adjust the padding as needed /
            font-size: 12px; / Adjust the font size as needed /
           
          }
          .city-table-container .fa-solid {
            font-size: 9px;
            line-height: 1;
          }

          .city-table-container th {
            font-size: 12px;
            width: 250px; / Fixed width for header cells /
            white-space: nowrap; / Prevent text wrapping /
            overflow: hidden; / Hide overflow /
            text-overflow: ellipsis; / Show ellipsis for overflow text /
            padding-right: 30px;
            
          }
          .city-table-container .page-info {
            font-size: 8px; / Reduce font size for page info /
          }
         
          .city-table-container .header-center {
            text-align: center; / Center the header content /
          }
          .city-table-container th:last-child {
            text-align: center; / Center the Actions header content /
          }
          @media only screen and (max-width: 600px) {
            .city-table-container .pagination {
              display: none; / Hide pagination on small screens /
            }
          }

          @media only screen and (max-width: 400px) {
            .city-table-container span.page-info {
              display: none; / Hide page info on extra small screens /
            }
          }
          @media only screen and (max-width: 800px) {
            .city-table-container .page-info {
              font-size: 8px; / Reduce font size further for smaller screens /
              width:100px
            }
          }

          @media only screen and (max-width: 1000px) {
            .city-table-container .page-info {
              font-size: 8px; / Reduce font size for 1000px screens /
              width:100px
            }
            .city-table-container .action-button {
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
          }
          @media only screen and (max-width: 1600px) {
           
            .city-table-container .action-button {
              display: flex;
              justify-content: space-evenly;
            
            .city-table-container .action-button {
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
          }
        
        `}
      </style>
      <div style={{ overflowX: "auto" }}>
        <table
          {...getTableProps()}
          id="tableMaturity"
          className="table table-bordered table-hover table-striped w-100 overflow-x-scroll"
        >
          <thead className="bg-highlight">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps({
                      ...(column.disableSortBy ? {} : column.getSortByToggleProps()),
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                        position: "relative",
                        display: index === 0 || index === 6 ? 'flex' : ''
                      },
                    })}
                  >
                    <div style={{ display: "inline-block", fontSize: "12px" }}>
                      {column.render("Header")}
                    </div>
                    {!column.disableSortBy && (
                      <span
                        style={{
                          position: "absolute", // Position the sorting icon absolutely
                          whiteSpace: "nowrap",
                          padding: "5px",
                          right: "0px", // Adjust the position from the right
                          top: "50%", // Align vertically in the middle
                          transform: "translateY(-50%)", // Adjust for vertical alignment
                        }}
                      >
                        {column.isSorted ? (
                          <i
                            className={`fa-solid ${column.isSortedDesc ? "fa-arrow-down" : "fa-arrow-up"
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
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
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
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: '10px'
        }}
      >
        <div>
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length}{" "}
          entries
        </div>
        <div
          className="pagination"
          style={{ position: "relative", bottom: "0", left: "0" }}
        >
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="btn btn-sm btn-default transition-3d-hover SearchButton"
            style={{ height: "calc(1.47em + 1rem + 2px)" }}
            type="button"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              width: "100px",
              justifyContent: "center",
              margin: "0px 10px",
            }}
          >
            Page{" "}
            <strong style={{ marginLeft: "3px" }}>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          {/* <div>
            {Array.from(
              { length: Math.min(10, pageOptions.length) },
              (_, i) => {
                const pageIdx = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      gotoPage(i);
                    }}
                    className={`btn btn-sm btn-default transition-3d-hover SearchButton ${pageIndex === i ? "active" : ""
                      }`}
                    style={{
                      height: "calc(1.47em + 1rem + 2px)",
                      marginLeft: "5px",
                      backgroundColor: " #EB6400",
                    }}
                    type="button"
                  >
                    {pageIdx}
                  </button>
                );
              }
            )}
          </div> */}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="btn btn-sm btn-default transition-3d-hover SearchButton"
            style={{ height: "calc(1.47em + 1rem + 2px)", marginLeft: "5px" }}
            type="button"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanDetailsMasterGrid;
