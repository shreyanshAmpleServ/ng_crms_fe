import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../components/common/dataTableNew/index";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import * as XLSX from "xlsx";
import CollapseHeader from "../../components/common/collapse-header.js";
import FlashMessage from "../../components/common/modals/FlashMessage.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import ExportData from "../../components/datatable/ExportData.js";
import SearchBar from "../../components/datatable/SearchBar.js";
import SortDropdown from "../../components/datatable/SortDropDown.js";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle.js";
import {
  clearMessages
} from "../../redux/manage-user/index.js";
import { deletePurchaseOrder, fetchPurchaseOrders } from "../../redux/purchaseOrder";
import DeleteAlert from "./alert/DeleteAlert.js";
import AddOrderModal from "./modal/AddPurchaseOrderModal.js";
import FilterComponent from "./modal/FilterComponent.js";
import PreviewPurchaseOrder from "./modal/PreviewPurchaseOrder.js";
import UserGrid from "./UsersGrid.js";
import { Helmet } from "react-helmet-async";

const PurchaseOrders = () => {
  const [view, setView] = useState("list"); 
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
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Purchase Order")?.[0]?.permissions
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
            title: "Sr.No.",  
             width: 50,
            render: (text,record,index) =>(<div className = "text=center">{(paginationData?.currentPage - 1 ) * paginationData?.pageSize + index + 1}</div>),
            
            // sorter: (a, b) => a.code.localeCompare(b.name),
        },
    {
      title: " Code",
      dataIndex: "order_code",
      sorter: (a, b) => (a.order_code || "").localeCompare(b.order_code || ""), // Fixed sorter logic
    }, {
      title: "Vendor",
      dataIndex: "purchase_order_vendor",
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
      dataIndex: "purchase_order_currency",
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
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by date
    },
//      {
//   title: "Attachment 1",
//   dataIndex: "attachment1",
//   render: (text) => (
//     text?.url ? (
//       <a href={text.url} target="_blank" rel="noopener noreferrer">
//         View
//       </a>
//     ) : (
//       "-"
//     )
//   ),
//   sorter: (a, b) =>
//     (a.attachment1?.code || "").localeCompare(b.attachment1?.code || ""),
// },

// {
//   title: "Attachment 2",
//   dataIndex: "attachment2",
//   render: (text) => (
//     text?.url ? (
//       <a href={text.url} target="_blank" rel="noopener noreferrer">
//         View
//       </a>
//     ) : (
//       "-"
//     )
//   ),
//   sorter: (a, b) =>
//     (a.attachment2?.code || "").localeCompare(b.attachment2?.code || ""),
// },


    // {
    //   title: "Status",
    //   dataIndex: "is_active",
    //   render: (text) => (
    //     <div>
    //       {text === "Y" ? (
    //         <span className="badge badge-pill badge-status bg-success">
    //           Active
    //         </span>
    //       ) : (
    //         <span className="badge badge-pill badge-status bg-danger">
    //           Inactive
    //         </span>
    //       )}
    //     </div>
    //   ),
    //   sorter: (a, b) => (a.is_active || "").localeCompare(b.is_active || ""), // Fixed sorter logic
    // },
    ...((isUpdate || isDelete) ?
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
              data-bs-target="#offcanvas_add_edit_purchase_order"
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
             <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_preview_purchase_order"
              onClick={() => setSelectedOrder(record)}
            >
              <i className="ti ti-eye text-secondary"></i> Preview
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
    dispatch(fetchPurchaseOrders({search:searchText, ...selectedDateRange}))
  }, [dispatch,searchText, selectedDateRange]);
  const { purchaseOrders , loading, error, success } = useSelector(
    (state) => state.purchaseOrders,
  );
  useEffect(()=>{
    setPaginationData({
      currentPage:purchaseOrders?.currentPage,
      totalPage:purchaseOrders?.totalPages,
      totalCount:purchaseOrders?.totalCount,
      pageSize : purchaseOrders?.size
    })
  },[purchaseOrders])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchPurchaseOrders({search:searchText, ...selectedDateRange, page: currentPage, size: pageSize })); 
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // const filteredData = products
  const filteredData = useMemo(() => {
    let data = purchaseOrders?.data || [];

    if (selectedStatus !== null) {
      data = data.filter((item) => item.is_active === selectedStatus);
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
  }, [searchText, selectedDateRange, purchaseOrders, columns, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Orders");
    XLSX.writeFile(workbook, "Purchase Orders.xlsx");
  }, [filteredData]);

const exportToPDF = useCallback(() => {
  const doc = new jsPDF({ orientation: 'landscape' }); // more width

  const pageWidth = doc.internal.pageSize.getWidth();

  // 🎨 Centered Title
  const title = "Purchase Orders";
  doc.setFontSize(16);
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;
  doc.text(title, x, 15);

  const tableColumns = columns.filter(
    col => col.title !== "Actions" && col.dataIndex !== "attachment1" && col.dataIndex !== "attachment2"
  );

  const head = [tableColumns.map(col => col.title)];

  const body = filteredData.map((row, index) =>
    tableColumns.map(col => {
      if (col.title === "Sr.No.") {
        return (
          (paginationData?.currentPage - 1) * paginationData?.pageSize +
          index +
          1
        );
      }
      if (col.dataIndex === "purchase_order_vendor") {
        return row.purchase_order_vendor?.name || "";
      }
      if (col.dataIndex === "purchase_order_currency") {
        return row.purchase_order_currency?.code || "";
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
      overflow: 'linebreak'
    },

    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 8,
      halign: 'center'
    },

    bodyStyles: {
      halign: 'left',
      valign: 'middle',
            halign: 'center',

    },

    theme: 'grid',
    tableWidth: 'auto',
    pageBreak: 'auto',
    halign: 'center',


    didDrawPage: (data) => {
      const tableWidth = data.table.width;

      if (tableWidth > pageWidth) {
        const scale = pageWidth / tableWidth;
        doc.internal.scaleFactor = doc.internal.scaleFactor / scale;
      }
    },
  });

  doc.save("Purchase_Orders.pdf");
}, [filteredData, columns, paginationData]);




  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteUser = (user) => {
    setSelectedOrder(user);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedOrder) {
      dispatch(deletePurchaseOrder(selectedOrder.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Purchase Orders</title>
        <meta name="Purchase Orders" content="This is Purchase Orders page of DCC CRMS." />
      </Helmet>
      <div className="content">
        {error && (
          <FlashMessage
            type="error"
            message={error}
            onClose={() => dispatch(clearMessages())}
          />
        )}
        {success && (
          <FlashMessage
            type="success"
            message={success}
            onClose={() => dispatch(clearMessages())}
          />
        )}

        <div className="row">
          <div className="col-md-12">
            <div className="page-header d-none">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Purchase Orders
                    <span className="count-title">{purchaseOrders?.data?.length || 0}</span>
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
                    label="Search Purchase Order"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add"
                      isCreate={isCreate}
                      id="offcanvas_add_edit_purchase_order"
                    />
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
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
      <AddOrderModal order={selectedOrder} setOrder={setSelectedOrder} />
      <PreviewPurchaseOrder order={selectedOrder} formatNumber={formatNumber} setOrder={setSelectedOrder}   />

      {/* <AddFile data={null} setData={setSelectedOrder} type={"purchaseOrders"} type_id={selectedOrder?.id} type_name={selectedOrder?.order_code} /> */}


      {/* <EditUserModal user={selectedOrder} /> */}
      <DeleteAlert
        label="Purchase Order"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default PurchaseOrders;
