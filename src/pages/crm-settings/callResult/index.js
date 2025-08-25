import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTable/index";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import {
  clearMessages
} from "../../../redux/calls"; // Redux actions and reducers for call statuses
import { all_routes } from "../../../routes/all_routes";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from "moment";

import { useNavigate } from "react-router-dom";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { deleteCallResult, fetchCallResults } from "../../../redux/callResult";
import { Helmet } from "react-helmet-async";

const CallResultList = () => {
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
  
  const permissions =JSON?.parse(localStorage.getItem("crmspermissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Call Result")?.[0]?.permissions
const isAdmin = localStorage.getItem("user") ? atob(localStorage.getItem("user"))?.includes("admin") : null
const isView =   isAdmin ? true :  allPermissions?.view
const isCreate = isAdmin ? true : allPermissions?.create
const isUpdate = isAdmin ? true : allPermissions?.update
const isDelete = isAdmin ? true : allPermissions?.delete

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Sr. No.",      width: 50,
      render: (text,record,index) =>index+1 ,
      // sorter: (a, b) => a.code.localeCompare(b.name),
  },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div>{record.name}</div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) => (
        <div style={{width:"20rem"}} className="text-wrap">{record.description || " -- "}</div>
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
          {isDelete &&  <Link
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
  const { callResults, loading, error, success } = useSelector(
    (state) => state.callResults,
  );

  React.useEffect(() => {
    dispatch(fetchCallResults());
  }, [dispatch]);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = callResults;
    if (searchText) {
      data = data.filter((item) =>
        columns.some((col) =>
          item[col.dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        ),
      );
    }
    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1,
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1,
      );
    }
    return data;
  }, [searchText, callResults, columns, sortOrder]);

  const handleDeleteCallStatus = (callStatus) => {
    setSelectedCallStatus(callStatus);
    setShowDeleteModal(true);
  };

  const [selectedCallStatus, setSelectedCallStatus] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedCallStatus) {
      dispatch(deleteCallResult(selectedCallStatus.id));
      // navigate(`/call-statuses`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
            <Helmet>
              <title>DCC CRMS - Call Result</title>
              <meta name="Call-Result" content="This is Call-Result page of DCC CRMS." />
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
                    Call Result
                    <span className="count-title">{callResults?.length || 0}</span>
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
                    label="Search Call Results"
                  />
                 {isCreate && <div className="col-sm-8">
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
                    isView = {isView}
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

export default CallResultList;
