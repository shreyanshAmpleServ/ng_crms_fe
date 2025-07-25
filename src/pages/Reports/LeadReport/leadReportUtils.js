import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { fetchLeadReport } from "../../../redux/leadReport";

export const columns = [
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a - b,
  },
  {
    title: "Lead Name",
    dataIndex: "leadName",
    render: (text, record, index) => (
      <Link to={`/crms/leads/${record.id}`} key={index}>
        {`${record.first_name} ${record.last_name}`}
      </Link>
    ),
    sorter: (a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    },
  },
  {
    title: "Company Name",
    dataIndex: "lead_company",
    render: (text, record, index) => (
      <Link to="#" key={index}>
        {`${text.name}`}
      </Link>
    ),
    sorter: (a, b) => (a.lead_company?.name || "").length - (b.lead_company?.name || "").length,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    sorter: (a, b) => (a.phone || "").length - (b.phone || "").length,
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => (a.email || "").length - (b.email || "").length,
  },
  {
    title: "Lead Status",
    dataIndex: "crms_m_lost_reasons",
    render: (crms_m_lost_reasons) => (
      <span
        className="badge badge-pill badge-status"
        style={{ backgroundColor: crms_m_lost_reasons?.colorCode }}
      >
        {crms_m_lost_reasons?.name || "N/A"}
      </span>
    ),
    sorter: (a, b) => {
      const nameA = a.crms_m_lost_reasons?.name || "";
      const nameB = b.crms_m_lost_reasons?.name || "";
      return nameA.localeCompare(nameB);
    },
  },
  {
    title: "Assignee",
    dataIndex: "crms_m_user",
    render: (crms_m_user) => <span>{crms_m_user?.full_name || ""}</span>,
    sorter: (a, b) => (a.crms_m_user?.full_name || "").localeCompare(b.crms_m_user?.full_name || ""),
  },
  {
    title: "Created Date",
    dataIndex: "createdate",
    render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
    sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
  },
];
