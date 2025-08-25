import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/common/dataTableNew/index";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import * as XLSX from "xlsx";
import CollapseHeader from "../../components/common/collapse-header";
import FlashMessage from "../../components/common/modals/FlashMessage";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import ExportData from "../../components/datatable/ExportData";
import SearchBar from "../../components/datatable/SearchBar";
import {
  clearMessages
} from "../../redux/manage-user";
import { deleteQuotation, fetchquotations, syncQuotationToOrder } from "../../redux/quotation";
import DeleteAlert from "./alert/DeleteAlert";
import AddQuotationModal from "./modal/AddQuotationModal.js";
import PreviewOrder from "./modal/PreviewQuotation.js";
import UserGrid from "./UsersGrid";
import GmailSection from "../../utils/gmailAccess.js";
import SendMailForm from "../../utils/sendMailFrom.js";

const Quotation = () => {
  const [view, setView] = useState("list");
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  }); 
  const dispatch = useDispatch();
  const [paginationData , setPaginationData] = useState()
  const [selectedStatus, setSelectedStatus] = useState(null);
  const permissions =JSON?.parse(localStorage.getItem("crmspermissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Quotation")?.[0]?.permissions
 const isAdmin = localStorage.getItem("user") ? atob(localStorage.getItem("user")).includes("admin") : null
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  function formatNumber(num) {
    num = Number(num)
    num = Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
    if (num === 0 || isNaN(num)) { return '0';}
    const number = parseFloat(num);
    const [integerPart, decimalPart] = number.toString().split('.');
    const formattedInteger = parseInt(integerPart).toLocaleString('en-IN');
    if (decimalPart !== undefined) {
      const fixedDecimal = parseFloat(`0.${decimalPart}`).toFixed(2).split('.')[1];
      return `${formattedInteger}.${fixedDecimal}`;
    }
    return formattedInteger;
  }
  

  const columns = [
    {
            title: "Sr. No.",  
             width: 50,
            render: (text,record,index) =>(<div className = "text=center">{(paginationData?.currentPage - 1 ) * paginationData?.pageSize + index + 1}</div>),
            
            // sorter: (a, b) => a.code.localeCompare(b.name),
        },
    {
      title: "Quotation Code",
      dataIndex: "quotation_code",
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""), // Fixed sorter logic
    },
     {
      title: "Vendor",
      dataIndex: "quotation_vendor",
      render: (text) => (
        <span>{text?.name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Ship To",
      dataIndex: "shipto",
      sorter: (a, b) => (a.shipto || "").localeCompare(b.shipto || ""), // Fixed sorter logic
    },
    {
      title: "Bill To",
      dataIndex: "billto",
      sorter: (a, b) => (a.billto || "").localeCompare(b.billto || ""), // Fixed sorter logic
    },
    {
      title: "Total Disc",
      dataIndex: "disc_prcnt",
      render: (text) => <span>{formatNumber(text)}</span> ,
      sorter: (a, b) =>a-b, // Fixed sorter logic
    },
    {
      title: "Total Tax",
      dataIndex: "tax_total",
      render: (text) => <span>{formatNumber(text)}</span> ,
      sorter: (a, b) => a-b // Fixed sorter logic
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (text) => <span>{formatNumber(text)}</span> ,
      sorter: (a, b) => a-b, // Fixed sorter logic
    },
    {
      title: "Currency",
      dataIndex: "quotation_currency",
      render: (text) => (
        <span>{text?.code}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""), // Fixed sorter logic
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.due_date) - new Date(b.due_date), // Sort by date
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span>{text == "O" ? "Open" : text === "L" ? "Closed" : text === "C"  ? "Canceled" :  text === "P" ? "Pending" : ""}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.due_date) - new Date(b.due_date), // Sort by date
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by date
    }, ...((isUpdate || isDelete) ?
      [ {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon"
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            {isUpdate && <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add_edit_quotation"
              onClick={() => setSelectedOrder(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteUser(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
             {/* <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_preview_order"
              // onClick={() => navigate(`/crms/quotation-pdf/${btoa(record?.id?.toString())}`)}
              onClick={() => setSelectedOrder(record)}
            >
              <i className="ti ti-eye text-secondary"></i> Preview
            </Link> */}
             {/* <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_preview_order"
              onClick={() => navigate(`/crms/quotation-pdf/${btoa(record?.id?.toString())}`)}
              // onClick={() => setSelectedOrder(record)}
            >
              <i className="ti ti-eye text-secondary"></i> Quotation
            </Link> */}
             <Link
              className="dropdown-item edit-popup"
              to="#"
              // data-bs-toggle="offcanvas"
              // data-bs-target="#offcanvas_preview_order"
              onClick={() => syncOrderData(record)}
            >
              <i className="ti ti-file-diff text-blue"></i> Create Order
            </Link>
            {/* <Link
               to="#"
                className="dropdown-item"
               data-bs-toggle="modal"
               data-bs-target="#new_file"
               onClick={() => setSelectedOrder(record)}
              >
             <i className="ti ti-upload text-success"></i>Upload File
            </Link> */}
          </div>
        </div>
      ),
    }]
  : []),
  ];

 

  React.useEffect(() => {
    dispatch(fetchquotations({search:searchText, ...selectedDateRange}))
  }, [dispatch,searchText, selectedDateRange]);
  const { quotations , loading, error, success } = useSelector(
    (state) => state.quotations,
  );
  useEffect(()=>{
    setPaginationData({
      currentPage:quotations?.currentPage,
      totalPage:quotations?.totalPages,
      totalCount:quotations?.totalCount,
      pageSize : quotations?.size
    })
  },[quotations])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchquotations({search:searchText, ...selectedDateRange, page: currentPage, size: pageSize })); 
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // const filteredData = products
  const filteredData = useMemo(() => {
    let data = quotations?.data || [];

    if (selectedStatus !== null) {
      data = data?.filter((item) => item.is_active === selectedStatus);
    }
    if (sortOrder === "ascending") {
      data = [...data]?.sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [searchText, selectedDateRange, quotations, columns, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "quotation");
    XLSX.writeFile(workbook, "quotation.xlsx");
  }, [filteredData]);

 const exportToPDF = useCallback(() => {
  const doc = new jsPDF({ orientation: 'landscape' });

  const pageWidth = doc.internal.pageSize.getWidth();

  
  const title = "Exported Quotations";
  doc.setFontSize(16);
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;
  doc.text(title, x, 15);

  const tableColumns = columns.filter(col => col.title !== "Actions");

  const head = [tableColumns.map(col => col.title)];

  const body = filteredData?.map((row, index) =>
    tableColumns.map(col => {
      if (col.title === "Sr. No.") {
        return (
          (paginationData?.currentPage - 1) * paginationData?.pageSize +
          index +
          1
        );
      }
      if (col.dataIndex === "quotation_vendor") {
        return row.quotation_vendor?.name || "";
      }
      if (col.dataIndex === "quotation_currency") {
        return row.quotation_currency?.code || "";
      }
      if (col.dataIndex === "due_date") {
        return moment(row.due_date).format("DD-MM-YYYY") || "";
      }
      if (col.dataIndex === "createdate") {
        return moment(row.createdate).format("DD-MM-YYYY") || "";
      }
      return row[col.dataIndex] || "";
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
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 8,
      halign: 'center',
    },

    bodyStyles: {
      halign: 'left',
      valign: 'middle',
       halign: 'center',

    },

    theme: 'grid',
    tableWidth: 'auto',
    pageBreak: 'auto',
  });

  doc.save("Quotations.pdf");
}, [filteredData, columns, paginationData]);


  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteUser = (user) => {
    setSelectedOrder(user);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedOrder) {
      
      dispatch(deleteQuotation(selectedOrder.id));
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };
    const syncOrderData = (data) => {
        dispatch(syncQuotationToOrder(data.id));  };
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Quotations</title>
        <meta name="Quotations" content="This is Quotations page of DCC CRMS." />
      </Helmet>
      <div className="content">
        {error && (
          <FlashMessage
            // type="error"
            // message={error}
            onClose={() => dispatch(clearMessages())}
          />
        )}
        {success && (
          <FlashMessage
            // type="success"
            // message={success}
            onClose={() => dispatch(clearMessages())}
          />
        )}

        <div className="row">
          <div className="col-md-12">
            <div className="page-header d-none">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Quotation
                    <span className="count-title">{quotations?.data?.length || 0}</span>
                  </h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            <div className="card ">
              <div className="card-header">
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Quotation"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add "
                      isCreate={isCreate}
                      id="offcanvas_add_edit_quotation"
                    />
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-2">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    {/* <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    /> */}
                    <DateRangePickerComponent
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                    />
                  </div>
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    {/* <FilterComponent
                      applyFilters={({ status }) => {
                        setSelectedStatus(status);
                      }}
                    />
                    <ViewIconsToggle view={view} setView={setView} /> */}
                  </div>
                </div>
            

              {isView ?  <div className="table-responsive custom-table">
                  {view === "list" ? (
                    <Table
                      dataSource={filteredData}
                      columns={columns}
                      loading={loading}
                      paginationData={paginationData}
                      onPageChange={handlePageChange}  
                    />
                  ) : (
                    <UserGrid data={filteredData} />
                  )}
                </div>: <UnauthorizedImage />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddQuotationModal order={selectedOrder} setOrder={setSelectedOrder} />
      <PreviewOrder order={selectedOrder} setOrder={setSelectedOrder} formatNumber={formatNumber}  />

      {/* <AddFile data={null} setData={setSelectedOrder} type={"quotations"} type_id={selectedOrder?.id} type_name={selectedOrder?.order_code} /> */}


      {/* <EditUserModal user={selectedOrder} /> */}
      <DeleteAlert
        label="Quotation"
        showModal={showDeleteModal}
        setOrder={setSelectedOrder}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default Quotation;
