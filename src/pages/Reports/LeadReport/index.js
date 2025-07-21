import React, { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Helmet } from "react-helmet-async";
import ExportData from "../../../components/datatable/ExportData";
import SearchBar from "../../../components/datatable/SearchBar";
import { DataTable } from "./LeadTable";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import { DatePicker } from "antd";
import { LoadingGraph } from "../../main-menu/deals-dashboard/loading";
import { fetchLeadReport } from "../../../redux/leadReport";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function LeadReport() {
  const [searchText, setSearchText] = useState("");
  const [yearFilter, setYearFilter] = useState();
  const [whoChange, setWhoChange] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  

  const dispatch = useDispatch();

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });

  const [selectedDateRange2, setSelectedDateRange2] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });

  useEffect(() => {
    dispatch(
      fetchLeadReport({
        search: searchText,
        tableDate: selectedDateRange,
        stageFilter: selectedDateRange2,
        yearFilter: yearFilter?.year(),
      })
    );
  }, [dispatch, searchText, selectedDateRange, selectedDateRange2, yearFilter]);

  const { leadReport, loading } = useSelector((state) => state.leadReport);

  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#28a745", "#dc3545"],
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    },
    legend: { position: "top" },
  };

  const monthlyDeals = leadReport?.monthlyLeads || {};
  const wonData = Array.from({ length: 12 }, (_, i) => monthlyDeals[i + 1] || 0);

  const barSeries = [{ name: "Leads", data: wonData }];

  const labels = leadReport?.LeadBySource?.map(item => item?.source) || [];
  const donutOptions = {
    chart: { type: "donut" },
    labels,
    colors: ["#007bff", "#6f42c1", "#dc3545", "#fd7e14"],
    legend: { position: "bottom" },
    dataLabels: {
      enabled: false,
      formatter: (val, opts) =>
        `${opts.w.config.labels[opts.seriesIndex]} - ${opts.w.config.series[opts.seriesIndex]}`,
    },
  };
  const donutSeries = leadReport?.LeadBySource?.map(item => item?.count) || [];

  const onChange = (date) => {
    setWhoChange("dealYear");
    setYearFilter(date);
  };

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "Lead_Reports.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lead Reports", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

    const visibleColumns = columns.filter(col => col.title && col.title !== "Actions");
    const head = [visibleColumns.map(col => col.title)];

    const body = filteredData.map(row =>
      visibleColumns.map(col => {
        const val = row[col.dataIndex];
        if (col.dataIndex === "manufacturer") return row.manufacturer?.name || "";
        if (col.dataIndex === "vendor") return row.vendor?.name || "";
        if (col.dataIndex === "Currency") return row.Currency?.code || "";
        
        if (col.dataIndex === "leadName") {
  const fullName = `${row.first_name || ""} ${row.last_name || ""}`.trim();
  return fullName || "-";
}

        if (col.dataIndex === "createdate") return val ? moment(val).format("DD-MM-YYYY") : "";
        if (typeof val === "object" && val !== null && val.name) return val.name;
        return val ?? "";
      })
    );

    doc.autoTable({
    head,
    body,
    startY: 25,
    styles: {
      fontSize: 7,
      cellPadding: 1,
      overflow: 'linebreak',
    },
    headStyles: {
      fontSize: 8,
      fillColor: [41, 128, 185],
      textColor: 255,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7,
      halign: 'center',
      valign: 'middle',
    },
    theme: 'grid',
    tableWidth: 'auto',
    pageBreak: 'auto',
  });

    doc.save("Lead_Reports.pdf");
  }, [filteredData, columns]);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Lead Reports</title>
        <meta name="Lead reports" content="This is Lead reports page of DCC CRMS." />
      </Helmet>

      <div className="content">
        <div className="card">
          <div className="card-header">
            <div className="row align-items-center">
              <SearchBar searchText={searchText} handleSearch={(e) => setSearchText(e.target.value)} label="Search Leads" />
              <div className="col-sm-8">
                <ExportData exportToPDF={exportToPDF} exportToExcel={exportToExcel} label="Add" isCreate={false} />
              </div>
            </div>
          </div>

          <div className="row card-body">
            <div className="col-12 vh-50 col-lg-7">
              <div className="bg-white position-relative h-full shadow-lg rounded p-4">
                <LoadingGraph isFetching={loading} whoChange={whoChange} name="LeadYear" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 fw-semibold">Leads by Year</h2>
                  <DatePicker onChange={onChange} value={yearFilter} picker="year" format="YYYY" />
                </div>
                <Chart options={barOptions} series={barSeries} type="bar" height={320} />
              </div>
            </div>

            <div className="col-12 vh-50 col-lg-5">
              <div className="bg-white position-relative h-100 shadow-lg rounded p-4">
                <LoadingGraph isFetching={loading} whoChange={whoChange} name="leadBySource" />
                <div>
                  <h3 className="h5 mb-2 fw-semibold text-nowrap">Lead by Source</h3>
                  <DateRangePickerComponent
                    selectedDateRange={selectedDateRange2}
                    setSelectedDateRange={setSelectedDateRange2}
                    setWhoChange={setWhoChange}
                    ChangeName="leadBySource"
                  />
                </div>
                {donutSeries.length > 0 && labels.length > 0 && (
                  <Chart options={donutOptions} series={donutSeries} type="donut" height={300} />
                )}
              </div>
            </div>
          </div>

          <DataTable
            searchText={searchText}
            setSearchText={setSearchText}
            data={leadReport?.lead}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            setWhoChange={setWhoChange}
            setFilteredData={setFilteredData}   // 👈
            setColumns={setColumns}             // 👈
          />
        </div>
      </div>
    </div>
  );
}
