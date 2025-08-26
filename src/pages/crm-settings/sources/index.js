import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import Table from "../../../components/common/dataTable/index";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSources,
  clearMessages,
  deleteSource,
} from "../../../redux/source"; // Redux actions and reducers for sources
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

const SourceList = () => {
  const [mode, setMode] = useState("add"); 
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [paginationData, setPaginationData] = useState();
  const permissions =JSON?.parse(localStorage.getItem("crmspermissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Sources")?.[0]?.permissions
 const isAdmin = localStorage.getItem("user") ? atob(localStorage.getItem("user")).includes("admin") : null
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Sr. No.",
align: "center",   
         width: 50,
      render: (text,record,index) =>   (paginationData?.currentPage - 1) * paginationData?.pageSize +
      index +
      1, 
      // sorter: (a, b) => a.code.localeCompare(b.name),
  },
    {
      title: "Source Name",
      dataIndex: "name",
      render: (text) => text,
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
      sorter: (a, b) => (a.is_active ?? "Y").localeCompare(b.is_active ?? "Y"),
    },
   ...((isUpdate || isDelete) ?[ {
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
              data-bs-target="#add_edit_source_modal"
              onClick={() => {
                setSelectedSource(record);
                setMode("edit");
              }}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteSource(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }]: [])
  ];

  const navigate = useNavigate();
  const { sources, loading, error, success } = useSelector(
    (state) => state.sources,
  );

  React.useEffect(() => {
    dispatch(fetchSources({ search: searchText }));
  }, [dispatch,searchText]);
    React.useEffect(() => {
        setPaginationData({
          currentPage: sources?.currentPage,
          totalPage: sources?.totalPages,
          totalCount: sources?.totalCount,
          pageSize: sources?.size,
        });
      }, [sources]);
    
      const handlePageChange = ({ currentPage, pageSize }) => {
        setPaginationData((prev) => ({
          ...prev,
          currentPage,
          pageSize,
        }));
        dispatch(
          fetchSources({
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
    let data = sources?.data || [];
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
  }, [searchText, sources, columns, sortOrder]);

  const handleDeleteSource = (source) => {
    setSelectedSource(source);
    setShowDeleteModal(true);
  };

  const [selectedSource, setSelectedSource] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedSource) {
      dispatch(deleteSource(selectedSource.id));
      // navigate(`/crms/sources`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
       <Helmet>
         <title>DCC CRMS - Source</title>
         <meta name="Sources" content="This is Sources page of DCC CRMS." />
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
                    Sources
                    <span className="count-title">{sources?.totalCount || 0}</span>
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
                    label="Search Sources"
                  />
                 {isCreate && <div className="col-sm-8">
                    <AddButton
                      label="Add"
                      id="add_edit_source_modal"
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

      <AddEditModal mode={mode} setInitialData={setSelectedSource} initialData={selectedSource} />
      <DeleteAlert
        label="Source"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedSource={selectedSource}
        onDelete={deleteData}
      />
    </div>
  );
};

export default SourceList;
