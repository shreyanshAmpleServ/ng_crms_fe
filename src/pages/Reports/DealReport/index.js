import React, { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Helmet } from "react-helmet-async";
import ExportData from "../../../components/datatable/ExportData";
import SearchBar from "../../../components/datatable/SearchBar";
import { DataTable } from "./DealTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchDealReport } from "../../../redux/dealReport";
import moment from "moment";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import { DatePicker } from "antd";
import { LoadingGraph } from "../../main-menu/deals-dashboard/loading";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function DealReport() {
  const [searchText, setSearchText] = useState("");
  const [yearFilter, setYearFilter] = useState();
    const [whoChange,setWhoChange] =useState()
    const [filteredData, setFilteredData] = useState([]);
      const [columns, setColumns] = useState([]);
  const dispatch = useDispatch();
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);
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
      fetchDealReport({
        search: searchText,
        tableDate: selectedDateRange,
        stageFilter: selectedDateRange2,
        yearFilter: yearFilter?.year(),
      })
    );
  }, [dispatch, searchText, selectedDateRange, selectedDateRange2, yearFilter]);

  const { dealReport, loading, error, success } = useSelector(
    (state) => state.dealReport
  );
  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#28a745", "#dc3545"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    legend: { position: "top" },
  };
  const monthlyDeals = dealReport?.monthlyDeals || {};

  const wonData = [];
  const lostData = [];

  for (let month = 1; month <= 12; month++) {
    const monthData = monthlyDeals[month] || { Won: 0, Lost: 0 };
    wonData.push(monthData.Won || 0);
    lostData.push(monthData.Lost || 0);
  }
  const barSeries = [
    { name: "Won DealValue", data: wonData },
    { name: "Lost DealValue", data: lostData },
  ];

  let labels = dealReport?.stageWiseDeals?.map((item) => item?.stage) || [];
  const donutOptions = {
    chart: {
      type: "donut",
    },
    labels: labels,
    colors: ["#007bff", "#6f42c1", "#dc3545", "#fd7e14"],
    legend: {
      position: "bottom",
    },

    dataLabels: {
      enabled: false,
      formatter: (val, opts) =>
        `${opts.w.config.labels[opts.seriesIndex]} - ${opts.w.config.series[opts.seriesIndex]}`,
    },
  };

  const donutSeries =
    dealReport?.stageWiseDeals?.map((item) => item?.count) || [];
  const onChange = (date, dateString) => {
    setWhoChange("dealYear")
    setYearFilter(date);
  };

  
    const exportToExcel = useCallback(() => {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Deal");
      XLSX.writeFile(workbook, "Deal_Reports.xlsx");
    }, [filteredData]);
  
    const exportToPDF = useCallback(() => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Deal Reports", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

  const visibleColumns = columns.filter(col => col.title && col.title !== "Actions");
  const head = [visibleColumns.map(col => col.title)];

  const body = filteredData.map(row =>
    visibleColumns.map(col => {
      const val = row[col.dataIndex];

      if (col.dataIndex === "manufacturer") {
        return row.manufacturer?.name || "";
      }

      if (col.dataIndex === "vendor") {
        return row.vendor?.name || "";
      }

      if (col.dataIndex === "Currency") {
        return row.Currency?.code || "";
      }

          if (col.dataIndex === "createDate") {
        return row.createDate
          ? moment(row.createDate).format("DD/MM/YYYY")
          : "-";
      }

      if (col.dataIndex === "expectedCloseDate") {
        return row.expectedCloseDate
          ? moment(row.expectedCloseDate).format("DD/MM/YYYY")
          : "-";
      }

      if (col.dataIndex === "DealContacts") {
        const contact = row.DealContacts?.[0]?.contact;
        return contact
          ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
          : "";
      }

      // If value is an object with a 'name', return its name.
      if (typeof val === "object" && val !== null && val.name) {
        return val.name;
      }

      // Fallback: return value or empty string.
      return val ?? "";
    })
  );

  doc.autoTable({
    head,
    body,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 25 },
  });

  doc.save("Deal_Reports.pdf");
}, [filteredData, columns]);


  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Deal Reports</title>
        <meta
          name="Deal reports"
          content="This is Deal reports page of DCC CRMS."
        />
      </Helmet>
      <div className="content ">
        <div className="card">
          <div className="card-header">
            <div className="row align-items-center">
              <SearchBar
                searchText={searchText}
                handleSearch={handleSearch}
                label="Search Deals"
              />

              <div className="col-sm-8">
                <ExportData
                    exportToPDF={exportToPDF}
                    exportToExcel={exportToExcel}
                  label="Add "
                  isCreate={false}
                  id="offcanvas_add_edit_order"
                />
              </div>
            </div>
          </div>
          <div className="row   card-body ">
            {/* Deals by Year */}
            <div className="col-12 vh-50   col-lg-7">
              <div className="bg-white position-relative  h-full shadow-lg rounded p-4">
                <LoadingGraph isFetching={loading}  whoChange={whoChange} name="dealYear" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 fw-semibold ">Deals by Year</h2>
                  <DatePicker
                    onChange={onChange}
                    value={yearFilter}
                    picker="year"
                    format="YYYY"
                  />
                </div>
                <Chart
                  options={barOptions}
                  series={barSeries}
                  type="bar"
                  height={320}
                />
              </div>
            </div>

            {/* Deals by Source */}
            <div className="col-12 vh-50 col-lg-5">
              <div className="bg-white position-relative h-100 shadow-lg rounded p-4">
                <LoadingGraph isFetching={loading}  whoChange={whoChange} name="dealByStage" />

                <div className="d-flex align-items-center gap-2 mb-4 justify-content-between ">
                  <h3 className="h5 fw-semibold text-nowrap ">
                    Deals by Stage
                  </h3>
                  <DateRangePickerComponent
                    selectedDateRange={selectedDateRange2}
                    setSelectedDateRange={setSelectedDateRange2}
                    setWhoChange={setWhoChange}
                    ChangeName="dealByStage"
                  />
                </div>
                {donutSeries.length > 0 && labels.length > 0 && (
                  <Chart
                    options={donutOptions}
                    series={donutSeries}
                    type="donut"
                    height={320}
                  />
                )}
              </div>
            </div>
          </div>
          <DataTable
             searchText={searchText}
            setSearchText={setSearchText}
            data={dealReport?.deal}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            setWhoChange={setWhoChange}
            setFilteredData={setFilteredData}   // 👈
            setColumns={setColumns}   
          />
        </div>
      </div>
    </div>
  );
}
