import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTable/index";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import {
  clearMessages,
  deleteCallStatus,
  fetchCallStatuses,
} from "../../../redux/callStatus"; // Redux actions and reducers for call statuses
import { all_routes } from "../../../routes/all_routes";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from "moment";

import { useNavigate } from "react-router-dom";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { Helmet } from "react-helmet-async";

const CallStatusList = () => {
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = useState();
   const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const permissions =JSON?.parse(localStorage.getItem("crmspermissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Call")?.[0]?.permissions
 const isAdmin = localStorage.getItem("user") ? atob(localStorage.getItem("user"))?.includes("admin") : null
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Sr. No.",      width: 50,
 render: (text, record, index) =>
        (paginationData?.currentPage - 1) * paginationData?.pageSize +
        index +
        1      // sorter: (a, b) => a.code.localeCompare(b.name),
  },
    {
      title: "Name",
      dataIndex: "name",
      width:150,
      render: (text, record) => (
        <div style={{width:"10rem"}} className="text-wrap">{record.name || " -- "}</div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      width:500,
      render: (text, record) => (
        <div style={{width:"28rem", whiteSpace: "wrap", wordBreak: "break-word" }}>
        {text || " -- "}
      </div>
        // <div className="text-wrap" style={{maxWidth:"22rem"}} >{record.description || " -- "}</div>
      ),
      sorter: (a, b) => a.description.localeCompare(b.description),
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
    ...((isUpdate || isDelete) ? [{
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
              data-bs-toggle="modal"
              data-bs-target="#add_edit_call_status_modal"
              onClick={() => {
                setSelectedCallStatus(record);
                setMode("edit");
              }}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteCallStatus(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];

  const navigate = useNavigate();
  const { callStatuses, loading, error, success } = useSelector(
    (state) => state.callStatuses,
  );

  React.useEffect(() => {
    dispatch(fetchCallStatuses({ search: searchText }));
  }, [dispatch,searchText]);
   React.useEffect(() => {
      setPaginationData({
        currentPage: callStatuses?.currentPage,
        totalPage: callStatuses?.totalPages,
        totalCount: callStatuses?.totalCount,
        pageSize: callStatuses?.size,
      });
    }, [callStatuses]);
  
    const handlePageChange = ({ currentPage, pageSize }) => {
      setPaginationData((prev) => ({
        ...prev,
        currentPage,
        pageSize,
      }));
      dispatch(
        fetchCallStatuses({
          search: searchText,
          page: currentPage,
          size: pageSize,
        })
      );
    };



  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = callStatuses?.data || [];
    // if (searchText) {
    //   data = data.filter((item) =>
    //     columns.some((col) =>
    //       item[col.dataIndex]
    //         ?.toString()
    //         .toLowerCase()
    //         .includes(searchText.toLowerCase()),
    //     ),
    //   );
    // }
    // if (sortOrder === "ascending") {
    //   data = [...data].sort((a, b) =>
    //     moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1,
    //   );
    // } else if (sortOrder === "descending") {
    //   data = [...data].sort((a, b) =>
    //     moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1,
    //   );
    // }
    return data;
  }, [searchText, callStatuses, columns, sortOrder]);

  const handleDeleteCallStatus = (callStatus) => {
    setSelectedCallStatus(callStatus);
    setShowDeleteModal(true);
  };

  const [selectedCallStatus, setSelectedCallStatus] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedCallStatus) {
      dispatch(deleteCallStatus(selectedCallStatus.id));
      // navigate(`/call-statuses`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Call Status</title>
        <meta name="Call-Status" content="This is Call-Status page of DCC CRMS." />
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
                    Call Status
                    <span className="count-title">{callStatuses?.length || 0}</span>
                  </h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Call Statuses"
                  />
                 {isCreate && 
                 <div className="col-sm-8">
                    <AddButton
                      label="Add"
                      id="add_edit_call_status_modal"
                      setMode={() => setMode("add")}
                    />
                  </div>}
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-2">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    {/* <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    /> */}
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    isView={isView}
                      paginationData={paginationData}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal mode={mode} initialData={selectedCallStatus} />
      <DeleteAlert
        label="Call Status"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedSource={selectedCallStatus}
        onDelete={deleteData}
      />
    </div>
  );
};

export default CallStatusList;
