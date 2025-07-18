import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import Table from "../../../components/common/dataTable/index";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLostReasons,
  clearMessages,
  deleteLostReason,
} from "../../../redux/lostReasons"; // Redux actions and reducers for lostReasons
import { all_routes } from "../../../routes/all_routes";
import CollapseHeader from "../../../components/common/collapse-header";
import AddEditModal from "./modal/AddEditModal";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import DeleteAlert from "./alert/DeleteAlert";

import moment from "moment";

import SortDropdown from "../../../components/datatable/SortDropDown";
import SearchBar from "../../../components/datatable/SearchBar";
import { useNavigate } from "react-router-dom";
import AddButton from "../../../components/datatable/AddButton";
import { Helmet } from "react-helmet-async";

const LostReasonsList = () => {
  const [mode, setMode] = useState("add"); 
  const dispatch = useDispatch();

  const permissions =JSON?.parse(localStorage.getItem("crmspermissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Lead Status")?.[0]?.permissions
 const isAdmin = localStorage.getItem("user") ? atob(localStorage.getItem("user")).includes("admin") : null
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "S. No.",      width: 50,
      render: (text,record,index) =>index+1 ,
      // sorter: (a, b) => a.code.localeCompare(b.name),
  },
    {
      title: "Lead Status",
      dataIndex: "name",
      render: (text) =>text,
      sorter: (a, b) => a.name.localeCompare(b.name),
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
    ...((isUpdate || isDelete) ?[{
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
          {isUpdate &&  <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_edit_lost_reason_modal"
              onClick={() => {
                setSelectedLostReason(record);
                setMode("edit");
              }}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteLostReason(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];

  const navigate = useNavigate();
  const { lostReasons, loading, error, success } = useSelector(
    (state) => state.lostReasons,
  );

  React.useEffect(() => {
    dispatch(fetchLostReasons());
  }, [dispatch]);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = lostReasons;
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
  }, [searchText, lostReasons, columns, sortOrder]);

  const handleDeleteLostReason = (lostReason) => {
    setSelectedLostReason(lostReason);
    setShowDeleteModal(true);
  };

  const [selectedLostReason, setSelectedLostReason] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = (sourcePage = null) => {
    if (selectedLostReason) {
      dispatch(deleteLostReason(selectedLostReason.id));
      if (sourcePage === 'leads-kanban') {
        window.location.reload();
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Lead Status</title>
        <meta name="Lead Status" content="This is Lead Status page of DCC CRMS." />
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
                    Lead Status
                    <span className="count-title">
                      {lostReasons?.length || 0}
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
            <div className="card ">
              <div className="card-header">
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Lead Status"
                  />
                {isCreate &&  <div className="col-sm-8">
                    <AddButton
                      label="Add"
                      id="add_edit_lost_reason_modal"
                      setMode={() => setMode("add")}
                    />
                  </div>}
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal mode={mode} initialData={selectedLostReason} />
      <DeleteAlert
        label="Lost Reason"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedLostReason={selectedLostReason}
        onDelete={deleteData}
      />
    </div>
  );
};

export default LostReasonsList;
