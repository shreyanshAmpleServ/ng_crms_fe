import React, { useEffect, useState } from "react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../routes/all_routes";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import DefaultEditor from "react-simple-wysiwyg";
import CollapseHeader from "../../components/common/collapse-header";
import { ActivityDetailOfUser } from "../../components/common/detailPages/UserDetails/activityDetails";
import { CallsDetailsOfUser } from "../../components/common/detailPages/UserDetails/callsDetails";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import {
  accountType,
  ascendingandDecending,
  documentType,
  LocaleData,
  status,
  statusList,
} from "../../components/common/selectoption/selectoption";
import { SelectWithImage2 } from "../../components/common/selectWithImage2";
import { fetchDealById } from "../../redux/deals";
import FilesDetails from "../../components/common/detailPages/UserDetails/FilesDetails";
import ImageWithDatabase from "../../components/common/ImageFromDatabase";
const DealDetail = ({deal_name}) => {
  const { id } = useParams();
  const route = all_routes;
  const [openModal, setOpenModal] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing Pipeline" },
    { value: "sales", label: "Sales Pipeline" },
  ];
  const dealsopen = [
    { value: "choose", label: "Choose" },
    { value: "collins", label: "Collins" },
    { value: "konopelski", label: "Konopelski" },
    { value: "adams", label: "Adams" },
    { value: "schumm", label: "Schumm" },
    { value: "wisozk", label: "Wisozk" },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchDealById(id));
    };

    fetchData();
  }, [dispatch, id]);

  const { dealDetail, loading } = useSelector((state) => state.deals);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
      {loading ? (
          <div
            style={{
              zIndex: 9999,
              paddingTop: "20%",
              paddingLeft: "35%",
              width: "100%",
              marginLeft: "0%",
              minHeight: "100vh",
              marginTop:"59px",
              backgroundColor: "rgba(255, 255, 255,.5)",
            }}
            className=" position-fixed  w-screen  top-0   bg-gray  "
          >
            <div
              className="spinner-border position-absolute d-flex justify-content-center  text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) :
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header d-none">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">Deals Overview </h4>
                  </div>
                  <div className="col-4 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {/* Deals User */}
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-8">
                    <ul className="contact-breadcrumb">
                      <li>
                        <Link to={route.deals}>
                          <i className="ti ti-arrow-narrow-left" />
                          Deals
                        </Link>
                      </li>
                      <li>{dealDetail?.dealName}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      {/* <div className="avatar avatar-xxl me-3 flex-shrink-0 border p-2">
                        <h6 className="text-default fw-medium">{dealDetail?.dealName}</h6>
                      </div> */}
                      <div>
                        <h5 className="mb-1">
                          {dealDetail?.dealName}{" "}
                          <span className="star-icon">
                            <i className="fa-solid fa-star" />
                          </span>
                        </h5>
                       
                        {/* <p className="mb-0">
                          <i className="ti ti-map-pin-pin" />{" "}
                          {`${dealDetail?.DealContacts?.[0]?.contact?.streetAddress}, ${dealDetail?.DealContacts?.[0]?.contact?.city}, ${dealDetail?.DealContacts?.[0]?.contact?.state}, ${dealDetail?.DealContacts?.[0]?.contact?.country}, ${dealDetail?.DealContacts?.[0]?.contact?.zipcode}`}
                        </p> */}
                      </div>
                    </div>
                    <div className="contacts-action">
                      <span className="badge badge-light">
                        <i className="ti ti-lock" />
                        Private
                      </span>
                      <div className="dropdown mb-2">
                        <Link
                          to="#"
                          className={`text-white ${dealDetail?.status === "Won" ? "bg-success" : "bg-danger"} py-1 px-2 d-inline-flex align-items-center`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {dealDetail?.status === "Won" ? (
                            <i className="ti ti-thumb-up me-2" />
                          ) : (
                            <i className="ti ti-thumb-down me-2" />
                          )}
                          {dealDetail?.status}
                          <i className="ti ti-chevron-down ms-2" />
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link className="dropdown-item" to="#">
                            <span>Won</span>
                          </Link>
                          <Link className="dropdown-item" to="#">
                            <span>Lost</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Deals User */}
            </div>
            {/* Deals Sidebar */}
            <div className="col-xl-3 theiaStickySidebar">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Deal Information</h6>
                  <ul>
                    <li className="row mb-3">
                      <span className="col-6">Created At</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {moment(dealDetail?.createdDate).format(
                          "DD-MM-YYYY HH:mm A"
                        )}
                      </span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Value</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {dealDetail?.currency} {dealDetail?.dealValue}
                      </span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Due Date</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {moment(dealDetail?.dueDate).format(
                          "DD-MM-YYYY HH:mm A"
                        )}
                      </span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Period</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {dealDetail?.periodValue + " " + dealDetail?.period}
                      </span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Expected Close Date</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {moment(dealDetail?.expectedCloseDate).format(
                          "DD-MM-YYYY HH:mm A"
                        )}
                      </span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Follow Up</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {moment(dealDetail?.followUpDate).format(
                          "DD-MM-YYYY HH:mm A"
                        )}
                      </span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Source</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {dealDetail?.source || " - - "}
                      </span>
                    </li>
                  </ul>
                  <hr />
                  {/* <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Owner</h6>
                    <Link
                      to="#"
                      className="link-purple fw-medium mb-3"
                      data-bs-toggle="modal"
                      data-bs-target="#owner"
                    >
                      <i className="ti ti-circle-plus me-1" />
                      Add New
                    </Link>
                  </div> */}
                  {/* <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md me-2">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-21.jpg"
                        alt="Image"
                      />
                    </div>
                    <p>Vaughan</p>
                  </div> */}
                  {/* <div className="d-flex align-items-center mb-0">
                    <div className="avatar avatar-md me-2">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-01.jpg"
                        alt="Image"
                      />
                    </div>
                    <p>Jessica</p>
                  </div> */}
                  {/* <hr /> */}
                  <h6 className="mb-2 fw-semibold">Tags</h6>
                  {dealDetail?.tags ?
                    dealDetail.tags.split(",").map((tag, index) => (
                      <Link
                        key={index}
                        to="#"
                        className={`badge ${index % 3 == 0 ? "badge-soft-success" : index % 3 == 1 ? "badge-soft-danger" : index % 3 == 2 ? "badge-soft-info" : "badge-soft-warning"} fw-medium me-2`}
                      >
                        {tag.trim()} {/* Trim to remove extra spaces */}
                      </Link>
                    )) : " -- "}
                  <hr />
                  {/* <h6 className="mb-3 fw-semibold">Projects</h6>
                  <Link
                    to="#"
                    className="badge bg-light-300 text-default me-2 mb-2"
                  >
                    Devops Design
                  </Link>
                  <Link to="#" className="badge bg-light-300 text-default mb-2">
                    Margrate Design
                  </Link> */}
                  {/* <hr /> */}
                  <h6 className="mb-3 fw-semibold">Priority</h6>
                  <div className="priority-info">
                  <span className={`${dealDetail?.priority === "Low" ? "bg-success" : "badge-soft-danger"}`}>
                          <i
                            className={`ti ti-square-rounded-filled me-1 ${dealDetail?.priority === "Low" ? "text-success" : "text-danger"} circle`}
                          />
                          {dealDetail?.priority}
                        </span>
                    {/* <div className="dropdown">
                      <Link
                        to="#"
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span>
                          <i
                            className={`ti ti-square-rounded-filled me-1 ${dealDetail?.priority === "Low" ? "text-success" : "text-danger"} circle`}
                          />
                          {dealDetail?.priority}
                        </span>
                        <i className="ti ti-chevron-down me-1" />
                      </Link>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item" to="#">
                          <span>
                            <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                            High
                          </span>
                        </Link>
                        <Link className="dropdown-item" to="#">
                          <span>
                            <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                            Low
                          </span>
                        </Link>
                      </div>
                    </div> */}
                  </div>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Contacts</h6>
                    {/* <Link
                      to="#"
                      className="link-purple mb-3 fw-medium"
                      data-bs-toggle="modal"
                      data-bs-target="#add_contact"
                    >
                      <i className="ti ti-circle-plus me-1" />
                      Add New
                    </Link> */}
                  </div>
                  {dealDetail?.Dealcontacts?.data?.map((item) => (
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar avatar-md me-2">
                        <ImageWithDatabase
                          src={item?.contact?.image    || "assets/img/profiles/avatar-21.jpg"}
                          alt="Image"
                        />
                      </div>
                      <p>
                        {item?.contact?.firstName +
                          " " +
                          item?.contact?.lastName || ""}
                      </p>
                    </div>
                  ))}

                  <hr />
                  <ul>
                    <li className="row mb-3">
                      <span className="col-6">Last Modified</span>
                      <span className="col-6">
                        {moment(dealDetail?.updatedDate).format("lll")}
                      </span>
                    </li>
                    {/* <li className="row mb-0">
                      <span className="col-6">Modified By</span>
                      <span className="col-6">
                        <span className="avatar avatar-xs me-1">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            className="avatar-xs"
                            alt="img"
                          />
                        </span>
                       {dealDetail?.updatedBy || "- -"}
                      </span>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Deals Sidebar */}
            {/* Deals Details */}
            <div className="col-xl-9">
              <div className="card mb-3">
                <div className="card-body pb-0">
                  <h4 className="fw-semibold mb-3">Deal Pipeline Status</h4>
                  <div className="pipeline-list">
                    <ul>
                      <li>
                        <Link to="#" className="bg-pending">
                          Quality To Buy
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="bg-info">
                          Contact Made
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="bg-warning">
                          Presentation
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="bg-pink">
                          Proposal Made
                        </Link>
                      </li>
                      <li>
                        <Link to="#">Appointment</Link>
                      </li>
                    </ul>
                  </div>
                  <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#activities"
                        className="nav-link active"
                      >
                        <i className="ti ti-alarm-minus me-1" />
                        Activities
                      </Link>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#notes"
                        className="nav-link"
                      >
                        <i className="ti ti-notes me-1" />
                        Notes
                      </Link>
                    </li> */}
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#calls"
                        className="nav-link"
                      >
                        <i className="ti ti-phone me-1" />
                        Calls
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#files"
                        className="nav-link"
                      >
                        <i className="ti ti-file me-1" />
                        Files
                      </Link>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#email"
                        className="nav-link"
                      >
                        <i className="ti ti-mail-check me-1" />
                        Email
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
              {/* Tab Content */}
              <div className="tab-content pt-0">
                {/* Activities */}
                <ActivityDetailOfUser deal_id={id} />
                
                {/* Notes */}
                {/* <div className="tab-pane fade" id="notes">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold">Notes</h4>
                      <div className="d-inline-flex align-items-center">
                        <div className="form-sort me-3 mt-0">
                          <i className="ti ti-sort-ascending-2" />
                          <Select
                            className="select"
                            options={ascendingandDecending}
                            placeholder="Ascending"
                            classNamePrefix="react-select"
                          />
                        </div>
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#add_notes"
                          className="link-purple fw-medium"
                        >
                          <i className="ti ti-circle-plus me-1" />
                          Add New
                        </Link>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="notes-activity">
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between pb-2">
                              <div className="d-inline-flex align-items-center mb-2">
                                <span className="avatar avatar-md me-2 flex-shrink-0">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-19.jpg"
                                    alt="img"
                                  />
                                </span>
                                <div>
                                  <h6 className="fw-medium mb-1">
                                    Darlee Robertson
                                  </h6>
                                  <p className="mb-0">15 Sep 2023, 12:10 pm</p>
                                </div>
                              </div>
                              <div className="mb-2">
                                <div className="dropdown">
                                  <Link
                                    to="#"
                                    className="p-0 btn btn-icon btn-sm d-flex align-items-center justify-content-center"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-edit text-blue me-1" />
                                      Edit
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-trash text-danger me-1" />
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h5 className="fw-medium mb-1">
                              Notes added by Antony
                            </h5>
                            <p>
                              A project review evaluates the success of an
                              initiative and identifies areas for improvement.
                              It can also evaluate a current project to
                              determine whether it's on the right track. Or, it
                              can determine the success of a completed project.{" "}
                            </p>
                            <div className="d-inline-flex align-items-center flex-wrap">
                              <div className="note-download me-3">
                                <div className="note-info">
                                  <span className="note-icon bg-secondary-success">
                                    <i className="ti ti-file-spreadsheet" />
                                  </span>
                                  <div>
                                    <h6 className="fw-medium mb-1">
                                      Project Specs.xls
                                    </h6>
                                    <p>365 KB</p>
                                  </div>
                                </div>
                                <Link to="#">
                                  <i className="ti ti-arrow-down" />
                                </Link>
                              </div>
                              <div className="note-download">
                                <div className="note-info">
                                  <span className="note-icon">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-35.jpg"
                                      alt="img"
                                    />
                                  </span>
                                  <div>
                                    <h6 className="fw-medium mb-1">
                                      090224.jpg
                                    </h6>
                                    <p>365 KB</p>
                                  </div>
                                </div>
                                <Link to="#">
                                  <i className="ti ti-arrow-down" />
                                </Link>
                              </div>
                            </div>
                            <div className="notes-editor">
                              <div
                                className="note-edit-wrap"
                                style={{ display: isEditor ? "block" : "none" }}
                              >
                                <DefaultEditor className="summernote" />
                                <div className="text-end note-btns">
                                  <Link
                                    to="#"
                                    className="btn btn-light add-cancel"
                                    onClick={() => setIsEditor(!isEditor3)}
                                  >
                                    Cancel
                                  </Link>
                                  <Link to="#" className="btn btn-primary">
                                    Save
                                  </Link>
                                </div>
                              </div>
                              <div className="text-end">
                                <Link
                                  to="#"
                                  className="add-comment link-purple fw-medium"
                                  onClick={() => setIsEditor(!isEditor)}
                                >
                                  <i className="ti ti-square-plus me-1" />
                                  Add Comment
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between pb-2">
                              <div className="d-inline-flex align-items-center mb-2">
                                <span className="avatar avatar-md me-2 flex-shrink-0">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-20.jpg"
                                    alt="img"
                                  />
                                </span>
                                <div>
                                  <h6 className="fw-medium mb-1">Sharon Roy</h6>
                                  <p className="mb-0">18 Sep 2023, 09:52 am</p>
                                </div>
                              </div>
                              <div className="mb-2">
                                <div className="dropdown">
                                  <Link
                                    to="#"
                                    className="p-0 btn btn-icon btn-sm d-flex align-items-center justify-content-center"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-edit text-blue me-1" />
                                      Edit
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-trash text-danger me-1" />
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h5 className="fw-medium mb-1">
                              Notes added by Antony
                            </h5>
                            <p>
                              A project plan typically contains a list of the
                              essential elements of a project, such as
                              stakeholders, scope, timelines, estimated cost and
                              communication methods. The project manager
                              typically lists the information based on the
                              assignment.
                            </p>
                            <div className="d-inline-flex align-items-center flex-wrap">
                              <div className="note-download me-3">
                                <div className="note-info">
                                  <span className="note-icon bg-secondary-success">
                                    <i className="ti ti-file-text" />
                                  </span>
                                  <div>
                                    <h6 className="fw-medium mb-1">
                                      Andrewpass.txt
                                    </h6>
                                    <p>365 KB</p>
                                  </div>
                                </div>
                                <Link to="#">
                                  <i className="ti ti-arrow-down" />
                                </Link>
                              </div>
                            </div>
                            <div className="reply-box">
                              <p>
                                The best way to get a project done faster is to
                                start sooner. A goal without a timeline is just
                                a dream.The goal you set must be challenging. At
                                the same time, it should be realistic and
                                attainable, not impossible to reach.
                              </p>
                              <p>
                                Commented by{" "}
                                <span className="text-purple">Aeron</span> on 15
                                Sep 2023, 11:15 pm
                              </p>
                              <Link to="#" className="btn">
                                <i className="ti ti-arrow-back-up-double" />
                                Reply
                              </Link>
                            </div>
                            <div className="notes-editor">
                              <div
                                className="note-edit-wrap"
                                style={{
                                  display: isEditor2 ? "block" : "none",
                                }}
                              >
                                <DefaultEditor className="summernote" />
                                <div className="text-end note-btns">
                                  <Link
                                    to="#"
                                    className="btn btn-light add-cancel"
                                    onClick={() => setIsEditor2(!isEditor3)}
                                  >
                                    Cancel
                                  </Link>
                                  <Link to="#" className="btn btn-primary">
                                    Save
                                  </Link>
                                </div>
                              </div>
                              <div className="text-end">
                                <Link
                                  to="#"
                                  className="add-comment link-purple fw-medium"
                                  onClick={() => setIsEditor2(!isEditor2)}
                                >
                                  <i className="ti ti-square-plus me-1" />
                                  Add Comment
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card mb-0">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between pb-2">
                              <div className="d-inline-flex align-items-center mb-2">
                                <span className="avatar avatar-md me-2 flex-shrink-0">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-21.jpg"
                                    alt="img"
                                  />
                                </span>
                                <div>
                                  <h6 className="fw-medium mb-1">Vaughan</h6>
                                  <p className="mb-0">20 Sep 2023, 10:26 pm</p>
                                </div>
                              </div>
                              <div className="mb-2">
                                <div className="dropdown">
                                  <Link
                                    to="#"
                                    className="p-0 btn btn-icon btn-sm d-flex align-items-center justify-content-center"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-edit text-blue me-1" />
                                      Edit
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-trash text-danger me-1" />
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p>
                              Projects play a crucial role in the success of
                              organizations, and their importance cannot be
                              overstated. Whether it's launching a new product,
                              improving an existing
                            </p>
                            <div className="notes-editor">
                              <div
                                className="note-edit-wrap"
                                style={{
                                  display: isEditor3 ? "block" : "none",
                                }}
                              >
                                <DefaultEditor className="summernote" />
                                <div className="text-end note-btns">
                                  <Link
                                    to="#"
                                    className="btn btn-light add-cancel"
                                    onClick={() => setIsEditor3(!isEditor3)}
                                  >
                                    Cancel
                                  </Link>
                                  <Link to="#" className="btn btn-primary">
                                    Save
                                  </Link>
                                </div>
                              </div>
                              <div className="text-end">
                                <Link
                                  to="#"
                                  className="add-comment link-purple fw-medium"
                                  onClick={() => setIsEditor3(!isEditor3)}
                                >
                                  <i className="ti ti-square-plus me-1" />
                                  Add Comment
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Calls */}
                <CallsDetailsOfUser />

                {/* Files */}
                  <FilesDetails type={"Deals"} type_id={id} type_name={dealDetail?.dealName}/>

              
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Deals Details */}
          </div>
        </div>}
      </div>
      {/* /Page Wrapper */}
      {/* Create Contact */}
      <div
        className="modal custom-modal fade"
        id="create_contact"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-user-plus" />
                </div>
                <h3>Contact Created Successfully!!!</h3>
                <p>View the details of contact, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.dealsDetails} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Contact */}
      {/* Add Note */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_notes"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Notes</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="col-form-label">
                    Title <span className="text-danger"> *</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Note <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={""}
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Attachment <span className="text-danger"> *</span>
                  </label>
                  <div className="drag-attach">
                    <input type="file" />
                    <div className="img-upload">
                      <i className="ti ti-file-broken" />
                      Upload File
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Uploaded Files</label>
                  <div className="upload-file">
                    <h6>Projectneonals teyys.xls</h6>
                    <p>4.25 MB</p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "25%" }}
                        aria-valuenow={25}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className="black-text">45%</p>
                  </div>
                  <div className="upload-file upload-list">
                    <div>
                      <h6>tes.txt</h6>
                      <p>4.25 MB</p>
                    </div>
                    <Link to="#" className="text-danger">
                      <i className="ti ti-trash-x" />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-12 text-end modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Note */}
      {/* Create Call Log */}
      <div
        className="modal custom-modal fade modal-padding"
        id="create_call"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Call Log</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Status <span className="text-danger"> *</span>
                      </label>
                      <Select
                        className="select2"
                        options={statusList}
                        placeholder="Select..."

                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Follow Up Date <span className="text-danger"> *</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Note <span className="text-danger"> *</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Add text"
                        defaultValue={""}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" /> Create a followup task
                      </label>
                    </div>
                    <div className="text-end modal-btn">
                      <Link
                        to="#"
                        className="btn btn-light"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </Link>
                      <button
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                        type="button"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Call Log */}
      {/* Add File */}
      <div
        className="modal custom-modal fade custom-modal-two modal-padding"
        id="new_file"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New File</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="add-info-fieldset">
                <div className="add-details-wizard">
                  <ul className="progress-bar-wizard">
                    <li className="active">
                      <span>
                        <i className="ti ti-file" />
                      </span>
                      <div className="multi-step-info">
                        <h6>Basic Info</h6>
                      </div>
                    </li>
                    <li>
                      <span>
                        <i className="ti ti-circle-plus" />
                      </span>
                      <div className="multi-step-info">
                        <h6>Add Recipient</h6>
                      </div>
                    </li>
                  </ul>
                </div>
                <fieldset id="first-field-file">
                  <form>
                    <div className="contact-input-set">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Choose Deal <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={dealsopen}
                              placeholder="Select..."

                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Document Type{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={documentType}
                              placeholder="Select..."

                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Owner <span className="text-danger">*</span>
                            </label>
                            <SelectWithImage2 />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Title <span className="text-danger"> *</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Locale <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={LocaleData}
                              placeholder="Select..."

                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="signature-wrap">
                            <h4>Signature</h4>
                            <ul className="nav sign-item">
                              <li className="nav-item">
                                <span
                                  className=" mb-0"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nosign"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="sign1"
                                    name="email"
                                  />
                                  <label htmlFor="sign1">
                                    <span className="sign-title">
                                      No Signature
                                    </span>
                                    This document does not require a signature
                                    before acceptance.
                                  </label>
                                </span>
                              </li>
                              <li className="nav-item">
                                <span
                                  className="active mb-0"
                                  data-bs-toggle="tab"
                                  data-bs-target="#use-esign"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="sign2"
                                    name="email"
                                    defaultChecked
                                  />
                                  <label htmlFor="sign2">
                                    <span className="sign-title">
                                      Use e-signature
                                    </span>
                                    This document require e-signature before
                                    acceptance.
                                  </label>
                                </span>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div
                                className="tab-pane show active"
                                id="use-esign"
                              >
                                <div className="input-block mb-0">
                                  <label className="col-form-label">
                                    Document Signers{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div className="sign-content">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Enter Name"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-center">
                                        <div className="float-none mb-3 me-3 w-100">
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Email Address"
                                          />
                                        </div>
                                        <div className="input-btn mb-3">
                                          <Link to="#" className="add-sign">
                                            <i className="ti ti-circle-plus" />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-block mb-3">
                            <label className="col-form-label">
                              Content <span className="text-danger"> *</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="Add Content"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 text-end form-wizard-button modal-btn">
                          <button className="btn btn-light" type="reset">
                            Reset
                          </button>
                          <button
                            className="btn btn-primary wizard-next-btn"
                            type="button"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </fieldset>
                <fieldset>
                  <form>
                    <div className="contact-input-set">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="signature-wrap">
                            <h4 className="mb-2">
                              Send the document to following signers
                            </h4>
                            <p>In order to send the document to the signers</p>
                            <div className="input-block mb-0">
                              <label className="col-form-label">
                                Recipients (Additional recipients)
                              </label>
                            </div>
                            <div className="sign-content">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Enter Name"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="d-flex align-items-center">
                                    <div className="float-none mb-3 me-3 w-100">
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Email Address"
                                      />
                                    </div>
                                    <div className="input-btn mb-3">
                                      <Link to="#" className="add-sign">
                                        <i className="ti ti-circle-plus" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Message Subject{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter Subject"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="col-form-label">
                              Message Text{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="Your document is ready"
                              defaultValue={""}
                            />
                          </div>
                          <button className="btn btn-light mb-3">
                            Send Now
                          </button>
                          <div className="send-success">
                            <p>
                              <i className="ti ti-circle-check" /> Document sent
                              successfully to the selected recipients
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-12 text-end form-wizard-button modal-btn">
                          <button className="btn btn-light" type="reset">
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            type="button"
                            data-bs-dismiss="modal"
                          >
                            Save &amp; Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add File */}
      {/* Connect Account */}
      <div className="modal custom-modal fade" id="create_email" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Connect Account</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Account type <span className="text-danger"> *</span>
                </label>
                <Select
                  className="select2"
                  options={accountType}
                  placeholder="Select..."

                  classNamePrefix="react-select"
                />
              </div>
              <div className="mb-3">
                <h5 className="form-title">Sync emails from</h5>
                <div className="sync-radio">
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test1"
                      name="radio-group"
                      defaultChecked
                    />
                    <label htmlFor="test1">Now</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test2"
                      name="radio-group"
                    />
                    <label htmlFor="test2">1 Month Ago</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test3"
                      name="radio-group"
                    />
                    <label htmlFor="test3">3 Month Ago</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test4"
                      name="radio-group"
                    />
                    <label htmlFor="test4">6 Month Ago</label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 text-end modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button
                  className="btn btn-primary"
                  data-bs-target="#success_mail"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Connect Account */}
      {/* Success Contact */}
      <div className="modal custom-modal fade" id="success_mail" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-mail-opened" />
                </div>
                <h3>Email Connected Successfully!!!</h3>
                <p>
                  Email Account is configured with “example@example.com”. Now
                  you can access email.
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link to={route.companyDetails} className="btn btn-primary">
                    Go to email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Success Contact */}
      {/* Add Contact */}
      <div className="modal custom-modal fade" id="add_contact" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Contact</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-2 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap">
                  <ul>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            alt=""
                          />
                          <Link to="#">Darlee Robertson</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-20.jpg"
                            alt=""
                          />
                          <Link to="#">Sharon Roy</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt=""
                          />
                          <Link to="#">Vaughan</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt=""
                          />
                          <Link to="#">Jessica</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-16.jpg"
                            alt=""
                          />
                          <Link to="#">Carol Thomas</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-22.jpg"
                            alt=""
                          />
                          <Link to="#">Dawn Mercha</Link>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Contact */}
      {/* Add Owner */}
      <div className="modal custom-modal fade" id="owner" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Deal Owner</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-2 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap">
                  <ul>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            alt=""
                          />
                          <Link to="#">Darlee Robertson</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-20.jpg"
                            alt=""
                          />
                          <Link to="#">Sharon Roy</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt=""
                          />
                          <Link to="#">Vaughan</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt=""
                          />
                          <Link to="#">Jessica</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-16.jpg"
                            alt=""
                          />
                          <Link to="#">Carol Thomas</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-22.jpg"
                            alt=""
                          />
                          <Link to="#">Dawn Mercha</Link>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Owner */}
      {/* Deal Status */}
      <div className="modal custom-modal fade" id="deal_status" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Deal Status</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    classNamePrefix="react-select"
                    options={status}
                    placeholder="Select..."

                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={5}
                    defaultValue={""}
                  />
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Deal Status */}
      {/* Add New Pipeline */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_pipeline"
      >
        <div className="offcanvas-header border-bottom">
          <h4>Add New Pipeline</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div>
              <div className="mb-3">
                <label className="col-form-label">
                  Pipeline Name <span className="text-danger">*</span>
                </label>
                <input className="form-control" type="text" />
              </div>
              <div className="mb-3">
                <div className="pipe-title d-flex align-items-center justify-content-between">
                  <h5 className="form-title">Pipeline Stages</h5>
                  <Link
                    to="#"
                    className="add-stage"
                    data-bs-toggle="modal"
                    data-bs-target="#add_stage"
                  >
                    <i className="ti ti-square-rounded-plus" />
                    Add New
                  </Link>
                </div>
                <div className="pipeline-listing">
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Inpipeline
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link to="#" onClick={() => setOpenModal(true)}>
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Follow Up
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link to="#" onClick={() => setOpenModal(true)}>
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Schedule Service
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link to="#" onClick={() => setOpenModal(true)}>
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <h5 className="form-title">Access</h5>
                <div className="d-flex flex-wrap access-item nav">
                  <div
                    className="radio-btn"
                    data-bs-toggle="tab"
                    data-bs-target="#all"
                  >
                    <input
                      type="radio"
                      className="status-radio"
                      id="all"
                      name="status"
                      defaultChecked
                    />
                    <label htmlFor="all">All</label>
                  </div>
                  <div
                    className="radio-btn"
                    data-bs-toggle="tab"
                    data-bs-target="#select-person"
                  >
                    <input
                      type="radio"
                      className="status-radio"
                      id="select"
                      name="status"
                    />
                    <label htmlFor="select">Select Person</label>
                  </div>
                </div>
                <div className="tab-content mb-3">
                  <div className="tab-pane fade" id="select-person">
                    <div className="access-wrapper">
                      <div className="access-view">
                        <div className="access-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt="Image"
                          />
                          Vaughan
                        </div>
                        <Link to="#">Remove</Link>
                      </div>
                      <div className="access-view">
                        <div className="access-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt="Image"
                          />
                          Jessica
                        </div>
                        <Link to="#">Remove</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#create_pipeline"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add New Pipeline */}
      {/* Add New Stage */}
      <div className="modal custom-modal fade" id="add_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-danger"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New Stage */}
      {/* Create Pipeline */}
      <div
        className="modal custom-modal fade"
        id="create_pipeline"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-building" />
                </div>
                <h3>Pipeline Created Successfully!!!</h3>
                <p>View the details of pipeline, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.dealsDetails} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Pipeline*/}
      {/* Edit Stage */}
      <div className="modal custom-modal fade" id="edit_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Inpipeline"
                  />
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-danger"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Stage */}
      {/* Delete Stage */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <div className="modal-body">
          <div className="text-center">
            <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
              <i className="ti ti-trash-x fs-36 text-danger" />
            </div>
            <h4 className="mb-2">Remove Stage?</h4>
            <p className="mb-0">
              Are you sure you want to remove <br /> stage you selected.
            </p>
            <div className="d-flex align-items-center justify-content-center mt-4">
              <Link
                to="#"
                className="btn btn-light me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </Link>
              <Link to={route.contactList} className="btn btn-danger">
                Yes, Delete it
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Delete Stage */}
    </>
  );
};

export default DealDetail;
