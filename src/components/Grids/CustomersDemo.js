import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { FilterMatchMode, FilterService } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import { InputNumber } from "primereact/inputnumber";
import { CustomerService } from "./CustomerService";
// The rule argument should be a string in the format "custom_[field]".
FilterService.register("custom_activity", (value, filters) => {
  const [from, to] = filters ?? [null, null];
  if (from === null && to === null) return true;
  if (from !== null && to === null) return from <= value;
  if (from === null && to !== null) return value <= to;
  return from <= value && value <= to;
});

export default function CustomFilterDemo() {
  const [customers, setCustomers] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    // For using custom filters, you must set FilterMatchMode.CUSTOM to matchMode.
    activity: { value: null, matchMode: FilterMatchMode.CUSTOM },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [representatives] = useState([
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ]);
  const [statuses] = useState([
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ]);

  const getSeverity = (status) => {
    switch (status) {
      case "unqualified":
        return "danger";

      case "qualified":
        return "success";

      case "new":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;
    }
  };

  useEffect(() => {
    CustomerService.getCustomersMedium().then((data) => {
      setCustomers(getCustomers(data));
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);

      return d;
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Header search bar
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end" style={{ width: "100%" }}>
        {/* <span className="p-input-icon-left"> */}
        {/* <i className="pi pi-search" /> */}
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
          style={{
            padding: "3px 8px",
            fontSize: "0.8rem",
            fontWeight: "500",
            border: "0.1px solid rgb(238, 234, 234)",
            maxWidth: "95%",
            width: "18rem",
            height: "2rem",
            borderRadius: "5px",
          }}
        />
        {/* </span> */}
      </div>
    );
  };

  // country column data
  const countryBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2 mx-2">
        <img
          alt="flag"
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${rowData.country.code}`}
          style={{ width: "20px" }}
        />
        <span style={{ fontSize: "0.9rem" }}>{rowData.country.name}</span>
      </div>
    );
  };

  // agent column data
  const representativeBodyTemplate = (rowData) => {
    const representative = rowData.representative;

    return (
      <div className="flex align-items-center gap-2 mr-4 my-2">
        <img
          alt={representative.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
          style={{ width: "20px" }}
        />
        <span style={{ fontSize: "0.9rem" }}>{representative.name}</span>
      </div>
    );
  };

  // agent dropdown list
  const representativesItemTemplate = (option) => {
    return (
      <div
        className="flex align-items-center gap-2 p-2"
        style={{ width: "8rem" }}
      >
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          style={{ width: "18px" }}
        />
        <span style={{ fontSize: "0.7rem" }}>{option.name}</span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status}
        severity={getSeverity(rowData.status)}
        className="mr-2 px-2 py-1 rounded-sm"
      />
    );
  };

  // dropdown list of status column
  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option}
        severity={getSeverity(option)}
        className="mx-2 px-1 font-semibold"
      />
    );
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": rowData.verified,
          "false-icon pi-times-circle": !rowData.verified,
        })}
      ></i>
    );
  };

  const representativeRowFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ width: "10rem" }}
      />
    );
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="px-2"
        showClear
        style={{ minWidth: "8rem" }}
      />
    );
  };

  const verifiedRowFilterTemplate = (options) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
      />
    );
  };

  const activityRowFilterTemplate = (options) => {
    const [from, to] = options.value ?? [null, null];

    return (
      <div className="flex gap-1">
        <InputNumber
          value={from}
          onChange={(e) => options.filterApplyCallback([e.value, to])}
          className="w-full"
          placeholder="from"
        />
        <InputNumber
          value={to}
          onChange={(e) => options.filterApplyCallback([from, e.value])}
          className="w-full"
          placeholder="to"
        />
      </div>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="mx-2">
        <span className="text-[0.9rem]">{rowData.name}</span>
      </div>
    );
  };

  const columnHeader = (title) => {
    return (
      <>
        <h6 className="mt-2 px-2 font-semibold">{title}</h6>
      </>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={customers}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        size="small"
        stripedRows
        showGridlines
        loading={loading}
        globalFilterFields={[
          "name",
          "country.name",
          "representative.name",
          "status",
        ]}
        header={header}
        emptyMessage="No customers found."
      >
        <Column
          // field="name"
          header={columnHeader("Name")}
          filter
          filterPlaceholder="Search by name"
          sortable
          sortField="name"
          className="custom-filter"
          filterField="name"
          body={nameBodyTemplate}
        />
        <Column
          header={columnHeader("Country")}
          filterField="country.name"
          // style={{ minWidth: "5rem" }}
          body={countryBodyTemplate}
          filter
          filterPlaceholder="Search by country"
          sortable
          sortField="country.name"
          className="custom-filter"
        />
        <Column
          header={columnHeader("Agent")}
          filterField="representative"
          showFilterMenu={false}
          filterMenuStyle={{ width: "14rem" }}
          // style={{ width: "5rem" }}
          body={representativeBodyTemplate}
          filter
          filterElement={representativeRowFilterTemplate}
        />
        <Column
          field="status"
          header={columnHeader("Status")}
          showFilterMenu={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "8rem" }}
          body={statusBodyTemplate}
          filter
          filterElement={statusRowFilterTemplate}
        />
        <Column
          field="verified"
          header={columnHeader("Verified")}
          dataType="boolean"
          style={{ minWidth: "4rem", width: "2rem" }}
          body={verifiedBodyTemplate}
          filter
          filterElement={verifiedRowFilterTemplate}
        />
      </DataTable>
    </div>
  );
}
