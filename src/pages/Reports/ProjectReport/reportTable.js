import React, { useEffect, useMemo, useState } from "react";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent.js";
import SortDropdown from "../../../components/datatable/SortDropDown.js";
import Table from "../../../components/common/dataTableNew/index";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import UnauthorizedImage from "../../../components/common/UnAuthorized.js/index.js";
import { fetchDealReport } from "../../../redux/dealReport/index.js";
import { Link } from "react-router-dom";

export const DataTable = ({
 data,
  searchText,
  setSearchText,
  setWhoChange,
  selectedDateRange,
  setSelectedDateRange,
  setFilteredData,
  setColumns,}) => {
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState();
  
//   React.useEffect(() => {
//     dispatch(fetchDealReport({ search: searchText, ...selectedDateRange }));
//   }, [dispatch, searchText, selectedDateRange]);
  const {  loading } = useSelector(
    (state) => state.dealReport
  );
  useEffect(() => {
    setPaginationData({
      currentPage: data?.currentPage,
      totalPage: data?.totalPages,
      totalCount: data?.totalCount,
      pageSize: data?.size,
    });
  }, [data]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchDealReport({
        search: searchText,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

   const columns = [
     {
       title: "Project Name",
       dataIndex: "name",
       render: (text, record) => (
         <Link to={`/crms/projects/${record.id}`}>{record.name}</Link>
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
  dataIndex: "startDate",
  render: (text) => (
    <span>
      {text ? moment(text).format("DD-MM-YYYY") : "N/A"}
    </span>
  ),
  sorter: (a, b) => {
    const aDate = a.startDate ? moment(a.startDate) : moment(0);
    const bDate = b.startDate ? moment(b.startDate) : moment(0);
    return aDate.diff(bDate);
  },
},
{
  title: "End Date",
  dataIndex: "dueDate",
  render: (text) => (
    <span>
      {text ? moment(text).format("DD-MM-YYYY") : "N/A"}
    </span>
  ),
  sorter: (a, b) => {
    const aDate = a.dueDate ? moment(a.dueDate) : moment(0);
    const bDate = b.dueDate ? moment(b.dueDate) : moment(0);
    return aDate.diff(bDate);
  },
},

     {
       title: "Created Date",
       render: (text) => (
         <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
       ),
       dataIndex: "createdDate",
       sorter: (a, b) => moment(a.createdDate).diff(moment(b.createdDate)),
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

   ];
   
   useEffect(() => {
       setColumns?.(columns);
     }, []);

    const filteredData = useMemo(() => {
    let datas = data || [];

    if (sortOrder === "ascending") {
      datas = [...datas]?.sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      datas = [...datas].sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return datas;
  }, [searchText, selectedDateRange, data, columns, sortOrder]);

    // useEffect(() => {
    //   setFilteredData?.(filteredData);
    // }, [filteredData]);
    
  return (
    <>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
          <div className="d-flex align-items-center flex-wrap row-gap-2">
            {/* <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} /> */}
            <DateRangePickerComponent
              selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          setWhoChange={setWhoChange}
          ChangeName=""
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

        {/* {isView ? ( */}
          <div className="table-responsive custom-table">
              <Table
                 dataSource={filteredData}
          columns={columns}
          loading={loading}
          paginationData={paginationData}
          onPageChange={handlePageChange}
              />
            
          </div>
        {/* ) : (
          <UnauthorizedImage />
        )} */}
      </div>
    </>
  );
};
