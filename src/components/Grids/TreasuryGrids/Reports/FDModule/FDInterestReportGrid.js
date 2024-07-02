import React, { useMemo } from "react";
import {
    useTable,
    useGlobalFilter,
    usePagination,
    useSortBy,
} from "react-table";
import { FaRegEdit } from "react-icons/fa";
import { BASE_URL } from "../../../../../config/url";

const FDInterestReportGrid = ({
    userInfo,
    searchData,
    whereCluse
}) => {
    console.log(userInfo);
    const columns = useMemo(

        () => [
            {
                Header: "Sr No.",
                accessor: (row, index) => index + 1,
                Cell: ({ value }) => <div className="text-left">{value}</div>,
                minWidth: 80,
            },
            {
                Header: "Company Name",
                accessor: "Company Name",
                minWidth: 120,
            },
            {
                Header: "Type Of FD",
                accessor: "Type Of FD",
                width: 150,
                minWidth: 150,
            },
            {
                Header: "Client Code",
                accessor: "Client Code",
                minWidth: 150,
            },
            // {
            //     Header: "RM Name",
            //     accessor: "FDAmount",
            //     minWidth: 120,
            // },
            // {
            //     Header: "RM Email_id",
            //     accessor: "InterestDate",
            //     minWidth: 120,
            // },
            {
                Header: "Bank Name",
                accessor: "Bank Name",
                width: 150,
                minWidth: 150,
            },
            {
                Header: "FD No",
                accessor: "FD No",
                minWidth: 150,
            },
            {
                Header: "FD Amt",
                accessor: "FD Amt",
                minWidth: 120,
            },
            {
                Header: "FD Rate",
                accessor: "FD Rate",
                minWidth: 120,
            },
            {
                Header: "FD Int. Type",
                accessor: "FD Int. Type",
                width: 150,
                minWidth: 150,
            },
            {
                Header: "Interest Term",
                accessor: "Interest Term",
                minWidth: 150,
            },
            {
                Header: "PreMatured FD Rate",
                accessor: "PreMatured FD Rate",
                minWidth: 120,
            },
            {
                Header: "From Date",
                accessor: "From Date",
                Cell: ({ value }) => value ? value.slice(0, 10) : '',
                minWidth: 120,
            },
            {
                Header: "Maturity Date",
                accessor: "Maturity Date",
                Cell: ({ value }) => value ? value.slice(0, 10) : '',
                width: 150,
                minWidth: 150,
            },
            {
                Header: "PreMaturity Date",
                accessor: "PreMaturity Date",
                Cell: ({ value }) => value ? value.slice(0, 10) : '',
                minWidth: 150,
            },
            {
                Header: "Sys Gross Int.",
                accessor: "Sys Gross Int.",
                minWidth: 120,
            },
            {
                Header: "TDS",
                accessor: "TDS",
                minWidth: 150,
            },
            {
                Header: "Int. After TDS",
                accessor: "Int. After TDS",
                minWidth: 120,
            },
            {
                Header: "Actual Gross Int. Received",
                accessor: "Actual Gross Int. Received",
                minWidth: 120,
            },
            {
                Header: "Actual TDS",
                accessor: "Actual TDS",
                width: 150,
                minWidth: 150,
            },
            {
                Header: "Actual Int. After TDS",
                accessor: "Actual Int. After TDS",
                minWidth: 150,
            },
            {
                Header: "Interest Income Passon to Client",
                accessor: "Interest Income Passon to Client",
                minWidth: 120,
            },
            {
                Header: "TDS - benefit given to client",
                accessor: "TDS - benefit given to client",
                minWidth: 150,
            },
            {
                Header: "Interest ((Short) / Excess)",
                accessor: "Interest ((Short) / Excess)",
                minWidth: 120,
            },
            {
                Header: "TDS ((Short )/ Excess)",
                accessor: "TDS ((Short )/ Excess)",
                minWidth: 120,
            },
            {
                Header: "Interest ((Excess) / Short) - Client",
                accessor: "Interest ((Excess) / Short) - Client",
                width: 150,
                minWidth: 150,
            },
            {
                Header: "TDS ((Excess) / Short) - Client",
                accessor: "TDS ((Excess) / Short) - Client",
                minWidth: 150,
            },
            {
                Header: "Status",
                accessor: "Status",
                minWidth: 120,
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

    const convertToCSV = () => {
        const csvContent = [
            // Header row
            columns.map((column) => column.Header).join(","),
            // Data rows
            ...data.map((row) =>
                columns.map((column) => row[column.accessor]).join(",")
            ),
        ].join("\n");
        return csvContent;
    };

    // Function to download CSV file
    const downloadCSV = async () => {
        try {

            const url = `${BASE_URL}user/DownloadFDIntrestReport?WhereClause=${whereCluse}&&FromDate=${searchData?.From_Date}&&ToDate=${searchData?.To_Date}`;
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = url;
            // Set the download attribute with a default file name
            link.setAttribute('download', 'Fd-Interest-Report.xlsx');
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
                <button onClick={downloadCSV} className="custom-export-button">
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
                    margin: "10px 10px",
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

export default FDInterestReportGrid;
