import "bootstrap-daterangepicker/daterangepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  deleteProject,
  fetchProjects,
} from "../../redux/projects";
import { all_routes } from "../../routes/all_routes";
import DeleteAlert from "./alert/DeleteAlert";
import AddProjectModal from "./modal/AddProjectModal";
import EditProjectModal from "./modal/EditProjectModal";
import FilterComponent from "./modal/FilterComponent";
import ProjectGrid from "./ProjectsGrid";

const ProjectList = () => {
  const route = all_routes
  const [view, setView] = useState("list"); // 'list' or 'grid'
  const [paginationData , setPaginationData] = useState()
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const permissions =JSON?.parse(localStorage.getItem("crmspermissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Projects")?.[0]?.permissions
 const isAdmin = localStorage.getItem("user") ? atob(localStorage.getItem("user")).includes("admin") : null
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
            title: "Sr. No.",  
             width: 50,
            render: (text,record,index) =>(<div className = "text=center">{(paginationData?.currentPage - 1 ) * paginationData?.pageSize + index + 1}</div>),
            
        },
    {
      title: "Project Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/projects/${record.id}`}>{record.name}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Budget",
      dataIndex: "amount",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      title: "Start Date",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      dataIndex: "startDate",
      sorter: (a, b) => moment(a.startDate).diff(moment(b.startDate)),
    },
    {
      title: "End Date",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      dataIndex: "dueDate",
      sorter: (a, b) => moment(a.dueDate).diff(moment(b.dueDate)),
    },
    {
      title: "Created Date",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      dataIndex: "createdDate",
      sorter: (a, b) => moment(a.dueDate).diff(moment(b.dueDate)),
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
  ...((isDelete || isUpdate) ? [ {
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
              data-bs-target="#offcanvas_edit_project"
              onClick={() => setSelectedProject(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteProject(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
         {isView &&   <Link className="dropdown-item" to={`${route.products}/${record?.id}`}>
              <i className="ti ti-eye text-blue-light"></i> Preview
            </Link>}
          </div>
        </div>
      ),
    }] : [])
  ];
  
    React.useEffect(() => {
      dispatch(fetchProjects({ search:searchText , ...selectedDateRange}));
    }, [dispatch,searchText,selectedDateRange]);
  const { projects, loading, error, success } = useSelector(
    (state) => state.projects,
  );
 React.useEffect(()=>{
    setPaginationData({
      currentPage:projects?.currentPage,
      totalPage:projects?.totalPages,
      totalCount:projects?.totalCount,
      pageSize : projects?.size
    })
  },[projects])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchProjects({ search:searchText , ...selectedDateRange,page: currentPage, size: pageSize })); 
  };
  // Memoized handlers
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = projects?.data || [];

    if (selectedStatus !== null) {
      data = data.filter((item) => item.is_active === selectedStatus);
    }
    // Sorting by createDate (ascending or descending)
    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [searchText, filteredCountries, selectedStatus, projects, columns]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "projects.xlsx");
  }, [filteredData]);

      
 const exportToPDF = useCallback(() => {
  const doc = new jsPDF({ orientation: 'landscape' });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 🎨 Title center me
  const title = "Exported Projects";
  doc.setFontSize(16);
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;
  doc.text(title, x, 15);

  // 🔷 Actions column ko hatao
  const tableColumns = columns.filter(col => col.title !== "Actions");

  const head = [tableColumns.map(col => col.title)];

  const body = filteredData.map((row, index) =>
    tableColumns.map(col => {
      if (col.title === "Sr. No.") {
        return (
          (paginationData?.currentPage - 1) * paginationData?.pageSize +
          index +
          1
        );
      }
      if (col.dataIndex === "startDate") {
        return moment(row.startDate).format("DD-MM-YYYY") || "";
      }
      if (col.dataIndex === "createdDate") {
        return moment(row.createdDate).format("DD-MM-YYYY") || "";
      }
      if (col.dataIndex === "dueDate") {
        return moment(row.dueDate).format("DD-MM-YYYY") || "";
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

  doc.save("projects.pdf");
}, [filteredData, columns, paginationData]);


  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedProject) {
      dispatch(deleteProject(selectedProject.id)); // Dispatch the delete action
      // navigate(`/projects`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Projects</title>
        <meta name="Projects" content="This is Projects page of DCC CRMS." />
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
            {/* Page Header */}
            <div className="page-header d-none">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Projects
                    <span className="count-title">{projects?.data?.length || 0}</span>
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
                    label="Search Projects"
                  />

                  <div className="col-sm-8">
                    {/* Export Start & Add Button */}
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add "
                      isCreate={isCreate}
                      id="offcanvas_add_project"
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
                      selectedDateRange={selectedDateRange}
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
                {/* Project List */}

               {isView ? <div className="table-responsive custom-table">
                  {view === "list" ? (
                    <Table
                      dataSource={filteredData}
                      columns={columns}
                      loading={loading}
                      paginationData={paginationData}
                      onPageChange={handlePageChange}  
                    />
                  ) : (
                    <ProjectGrid data={filteredData} />
                  )}
                </div> : <UnauthorizedImage />}
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="datatable-length" />
                  </div>
                  <div className="col-md-6">
                    <div className="datatable-paginate" />
                  </div>
                </div>
                {/* /Project List */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddProjectModal />
      <EditProjectModal project={selectedProject} />
      <DeleteAlert
        label="Project"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default ProjectList;
