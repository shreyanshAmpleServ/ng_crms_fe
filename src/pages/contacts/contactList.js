import "bootstrap-daterangepicker/daterangepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import CollapseHeader from "../../components/common/collapse-header";
import { countryList } from "../../components/common/data/json/countriesData";
import Table from "../../components/common/dataTable/index";
import FlashMessage from "../../components/common/modals/FlashMessage";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import ExportData from "../../components/datatable/ExportData";
import SearchBar from "../../components/datatable/SearchBar";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import {
  clearMessages,
  deleteContact,
  fetchContacts,
} from "../../redux/contacts/contactSlice";

import DeleteAlert from "./alert/DeleteAlert";
import ContactGrid from "./ContactGrid";
import AddContactModal from "./modal/AddContactModal";
// import EditContactModal from "./modal/EditContactModal";

import { all_routes } from "../../routes/all_routes.js";
import FilterComponent from "./modal/FilterComponent";
const ContactList = () => {
  const route = all_routes;
  const navigate = useNavigate();

  const [view, setView] = useState("list");
  const [paginationData, setPaginationData] = useState();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState(""); // For search
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  const [sortOrder, setSortOrder] = useState("descending"); // Sorting
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const permissions = JSON?.parse(localStorage.getItem("crmspermissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Contacts"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("user")
    ? atob(localStorage.getItem("user")).includes("admin")
    : null;
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Sr. No.",
      width: 50,
      render: (text, record, index) => (
        <div className="text=center">
          {(paginationData?.currentPage - 1) * paginationData?.pageSize +
            index +
            1}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record, index) => (
        <Link to={`/crms/contacts/${record?.id}`} className="" key={index}>
          {`${record.firstName} ${record.lastName}`}
        </Link>
      ),
      sorter: (a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Phone",
      dataIndex: "phone1",
      // sorter: (a, b) => a.phone1.length - b.phone1.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Location",
      dataIndex: "contact_Country",
      render: (text, record) => (
        <div>{`${record?.city ? record?.city + ", " : ""} ${record.contact_State?.name ? record.contact_State?.name + ", " : ""} ${record.contact_Country?.name ? record.contact_Country?.name : " - "}`}</div>
      ),
      // sorter: (a, b) => a.country.length - b.country.length,
    },
    {
      title: "Contact",
      dataIndex: "",
      render: (record) => (
        <div className="social-links d-flex align-items-center">
          <li>
            <Link target="_blank" to="#">
              <a
                href={`mailto:${record.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-mail me-2"></i>
              </a>
            </Link>
          </li>
          <li>
            <Link target="_blank" to="#">
              <a
                href={`tel:${record.phone1}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-phone-check me-2"></i>
              </a>
            </Link>
          </li>
          <li>
            <Link target="_blank" to="#">
              <a
                href={`https://wa.me/${record.phone1}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-message-circle-share me-2"></i>
              </a>
            </Link>
          </li>
          <li>
            <Link target="_blank" to="">
              <a
                href={`skype:${record.phone1}?call`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-brand-skype me-2"></i>
              </a>
            </Link>
          </li>
          <li>
            <Link target="_blank" to="#">
              <a
                href={record.socialProfiles?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-brand-facebook"></i>
              </a>
            </Link>
          </li>
        </div>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by date
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) => (
        <div>
          {text === "Y" ? (
            <span className="badge badge-pill badge-status bg-success">
              Active
            </span>
          ) : (
            <span className="badge badge-pill badge-status bg-danger">
              Inactive
            </span>
          )}
        </div>
      ),
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    },
    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record, index) => (
              <div className="dropdown table-action" key={index}>
                <Link
                  to="#"
                  className="action-icon"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Link>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  style={{
                    position: "absolute",
                    inset: "0px auto auto 0px",
                    margin: "0px",
                    zIndex: 1000,
                    transform: "translate3d(-99.3333px, 35.3333px, 0px)",
                  }}
                  data-popper-placement="top-start"
                >
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => setSelectedContact(record)} // Set selected contact
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      // data-bs-toggle="modal"
                      // data-bs-target="#delete_contact"
                      onClick={() => handleDeleteContact(record)}
                    >
                      <i className="ti ti-trash text-danger"></i> Delete
                    </Link>
                  )}
                  {isView && (
                    <Link
                      className="dropdown-item z-3"
                      to={`${route.contacts}/${record?.id}`}
                    >
                      <i className="ti ti-eye text-blue-light"></i> Preview
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  // Fetch contacts on component mount
  useEffect(() => {
    dispatch(
      fetchContacts({ search: searchText, ...selectedDateRange })
    ).unwrap();
  }, [dispatch, searchText, selectedDateRange]);

  const { contacts, loading, error, success } = useSelector(
    (state) => state.contacts
  );
  useEffect(() => {
    setPaginationData({
      currentPage: contacts?.currentPage,
      totalPage: contacts?.totalPages,
      totalCount: contacts?.totalCount,
      pageSize: contacts?.size,
    });
  }, [contacts]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchContacts({
        search: searchText,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };
  // Show FlashMessage when success or error changes
  // React.useEffect(() => {
  //   if (error || success) {
  //     setShowFlashModal(true);
  //   }
  // }, [error, success]);
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseFlashMessage = () => {
    setShowFlashModal(false);
    // Dispatch the action to clear error and success messages from Redux
    dispatch(clearMessages());
  };

  const handleDeleteContact = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (selectedContact) {
      dispatch(deleteContact(selectedContact.id)); // Dispatch the delete action
      navigate(`/crms/contact`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };

  // Memoized filtered data
  const filteredData = useMemo(() => {
    let data = contacts?.data || [];

    // Apply the country filter
    if (filteredCountries.length > 0) {
      data = data.filter((item) => filteredCountries.includes(item.country));
    }
    // Apply the status filter
    if (selectedStatus) {
      data = data.filter((item) => item.is_active === selectedStatus); // Filter by selected status
    }

    // Sorting by createDate (ascending or descending)
    if (sortOrder === "ascending") {
      // Clone the array to avoid direct mutation
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      // Clone the array to avoid direct mutation
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }

    return data;
  }, [searchText, selectedDateRange, contacts, columns, filteredCountries]);

  // const settings = {
  //   startDate: selectedDateRange.startDate,
  //   endDate: selectedDateRange.endDate,
  //   ranges: {
  //     "Last 30 Days": [moment().subtract(180, "days"), moment()],
  //     "Last 7 Days": [moment().subtract(7, "days"), moment()],
  //     "Last Month": [
  //       moment().subtract(1, "months").startOf("month"),
  //       moment().subtract(1, "months").endOf("month"),
  //     ],
  //     "This Month": [moment().startOf("month"), moment().endOf("month")],
  //     Today: [moment(), moment()],
  //     Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
  //   },
  //   timePicker: false,
  // };

  // Memoized handlers
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchText("");
    setSelectedDateRange([]);
  }, []);

  // Export to Excel
  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "Contacts.xlsx");
  }, [filteredData]);

  // Export to PDF
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Centered Title
    const title = "Exported Contact List";
    doc.setFontSize(16);
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;
    doc.text(title, x, 15);

    // Columns excluding Actions & Contact
    const tableColumns = columns.filter(
      (col) => col.title !== "Actions" && col.title !== "Contact"
    );

    const head = [tableColumns.map((col) => col.title)];

    const body = filteredData.map((row, index) =>
      tableColumns.map((col) => {
        if (col.title === "Sr. No.") {
          return (
            (paginationData?.currentPage - 1) * paginationData?.pageSize +
            index +
            1
          );
        }

        if (col.dataIndex === "name") {
          const name = `${row.firstName || ""} ${row.lastName || ""}`.trim();
          return name || "-";
        }

        if (col.dataIndex === "contact_Country") {
          const city = row?.city ? row.city + ", " : "";
          const state = row.contact_State?.name
            ? row.contact_State.name + ", "
            : "";
          const country = row.contact_Country?.name || "-";
          return `${city}${state}${country}`;
        }

        if (col.dataIndex === "is_active") {
          return row.is_active === "Y" ? "Active" : "Inactive";
        }

        if (col.dataIndex === "createdate") {
          return row.createdate
            ? moment(row.createdate).format("DD-MM-YYYY")
            : "-";
        }

        const val = row[col.dataIndex];
        if (val && typeof val === "object") {
          return val.name || val.code || JSON.stringify(val);
        }

        return val ?? "-";
      })
    );

    doc.autoTable({
      head,
      body,
      startY: 25,
      styles: {
        fontSize: 7,
        cellPadding: 1,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 8,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 7,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      tableWidth: "auto",
      pageBreak: "auto",
    });

    doc.save("Contacts.pdf");
  }, [filteredData, columns, paginationData]);

  const handleCountryFilterChange = (selectedCountries) => {
    setFilteredCountries(selectedCountries);
  };

  return (
    <div>
      <Helmet>
        <title>DCC CRMS - Contacts</title>
        <meta name="Contacts" content="This is Contacts page of DCC CRMS." />
      </Helmet>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Show Flash Message for Error */}
          {error && showFlashModal && (
            <FlashMessage
              type="error"
              message={error}
              onClose={handleCloseFlashMessage}
            />
          )}

          {/* Show Flash Message for Success */}
          {success && showFlashModal && (
            <FlashMessage
              type="success"
              message={success}
              onClose={handleCloseFlashMessage}
            />
          )}

          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header d-none">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">
                      Contacts
                      <span className="count-title">
                        {contacts?.data?.length || 0}
                      </span>
                    </h4>
                  </div>
                  <div className="col-4 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="card ">
                <div className="card-header">
                  {/* Search */}
                  <div className="row align-items-center">
                    <SearchBar
                      searchText={searchText}
                      handleSearch={handleSearch}
                      label="Search Contacts"
                    />

                    <div className="col-sm-8">
                      {/* Export Start & Add Button */}
                      <ExportData
                        exportToPDF={exportToPDF}
                        exportToExcel={exportToExcel}
                        label="Add"
                        isCreate={isCreate}
                        id="offcanvas_add"
                      />
                      {/* Export End & Add Button  */}
                    </div>
                  </div>
                  {/* /Search */}
                </div>

                <div className="card-body">
                  {/* Filter */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                    <div className="d-flex align-items-center flex-wrap row-gap-2">
                      {/* <SortDropdown
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                      /> */}
                      <DateRangePickerComponent
                        selectedDateRange={
                          selectedDateRange?.startDate
                            ? selectedDateRange
                            : { startDate: moment(), endDate: moment() }
                        }
                        setSelectedDateRange={setSelectedDateRange}
                      />
                    </div>
                    <div className="d-flex align-items-center flex-wrap row-gap-2">
                      {/* <ManageColumnsDropdown /> */}
                      <FilterComponent
                        countryList={countryList}
                        applyFilters={({ countries, status }) => {
                          setFilteredCountries(countries);
                          setSelectedStatus(status); // Set the selected status
                        }}
                      />

                      <ViewIconsToggle view={view} setView={setView} />
                    </div>
                  </div>

                  {/* /Filter */}
                  {/* Contact List */}

                  {isView ? (
                    <div className="table-responsive custom-table">
                      {view === "list" ? (
                        <Table
                          dataSource={filteredData}
                          columns={columns}
                          loading={loading}
                          paginationData={paginationData}
                          onPageChange={handlePageChange}
                        />
                      ) : (
                        <ContactGrid data={filteredData} />
                      )}
                    </div>
                  ) : (
                    <UnauthorizedImage />
                  )}
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                  {/* /Contact List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Contact */}

      <AddContactModal
        contact={selectedContact}
        setSelectedContact={setSelectedContact}
      />
      {/* <EditContactModal contact={selectedContact} setSelectedContact={setSelectedContact} /> */}
      {/* Include the Delete Contact Modal */}
      <DeleteAlert
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
        onDelete={deleteData}
        label="deal"
      />
    </div>
  );
};

export default ContactList;
