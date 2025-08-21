import React, { useEffect, useMemo, useState } from "react";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent.js";
import Table from "../../../components/common/dataTableNew/index";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
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
  setColumns,
}) => {
  const [sortOrder, setSortOrder] = useState("ascending");
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState();

  const { loading } = useSelector((state) => state.dealReport);

  useEffect(() => {
    setPaginationData({
      currentPage: data?.currentPage,
      totalPage: data?.totalPages,
      totalCount: data?.totalCount,
      pageSize: data?.size,
    });
  }, [data]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({ ...prev, currentPage, pageSize }));
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
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Lead Name",
      dataIndex: "leadName",
      render: (text, record) => (
        <Link to={`/crms/leads/${record.id}`}>
          {`${record.first_name} ${record.last_name}`}
        </Link>
      ),
      sorter: (a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      title: "Company Name",
      dataIndex: "lead_company",
      render: (text) => <Link to="#">{text?.name}</Link>,
      sorter: (a, b) => (a.lead_company?.name || "").localeCompare(b.lead_company?.name || ""),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Lead Status",
      dataIndex: "crms_m_lost_reasons",
      render: (status) => (
        <span
          className="badge badge-pill badge-status"
          style={{ backgroundColor: status?.colorCode }}
        >
          {status?.name || "N/A"}
        </span>
      ),
      sorter: (a, b) => (a.crms_m_lost_reasons?.name || "").localeCompare(b.crms_m_lost_reasons?.name || ""),
    },
    {
      title: "Assignee",
      dataIndex: "crms_m_user",
      render: (user) => <span>{user?.full_name || ""}</span>,
      sorter: (a, b) => (a.crms_m_user?.full_name || "").localeCompare(b.crms_m_user?.full_name || ""),
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
    },
  ];

  useEffect(() => {
    setColumns?.(columns);
  }, []);

  const filteredData = useMemo(() => {
    let datas = data || [];
    if (sortOrder === "ascending") {
      datas = [...datas].sort((a, b) => moment(a.createdDate).diff(moment(b.createdDate)));
    } else {
      datas = [...datas].sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
    }
    return datas;
  }, [data, sortOrder]);

  // useEffect(() => {
  //   setFilteredData?.(filteredData);
  // }, [filteredData]);

  return (
    <div className="card-body">
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
        <DateRangePickerComponent
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          setWhoChange={setWhoChange}
          ChangeName=""
        />
      </div>

      <div className="table-responsive custom-table">
        <Table
          dataSource={filteredData}
          columns={columns}
          loading={loading}
          paginationData={paginationData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
