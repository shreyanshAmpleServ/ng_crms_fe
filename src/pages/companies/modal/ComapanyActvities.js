import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import { ascendingandDecending } from "../../../components/common/selectoption/selectoption";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ActivityDetailOfUser } from "../../../components/common/detailPages/UserDetails/activityDetails";
import { CallsDetailsOfUser } from "../../../components/common/detailPages/UserDetails/callsDetails";
import FilesDetails from "../../../components/common/detailPages/UserDetails/FilesDetails";
const ComapanyActvities = ({ company_id ,company_name }) => {
  return (
    <div className="col-xl-9 ps-0">
      <div className="card mb-3">
        <div className="card-body pb-0 pt-2">
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
        <ActivityDetailOfUser company_id={company_id} />


        {/* Calls */}
        <CallsDetailsOfUser />

        {/* Files */}
       <FilesDetails type={"Companies"} type_id={company_id} type_name={company_name} />

        {/* Email */}
        {/* <div className="tab-pane fade" id="email">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h4 className="fw-semibold">Email</h4>
              <div className="d-inline-flex align-items-center">
                <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip id="refresh-tooltip">
                      There are no email accounts configured, Please configured
                      your email account in order to Send/ Create EMails
                    </Tooltip>
                  }
                >
                  <Link to="#">
                    <i className="ti ti-circle-plus me-1" />
                    Create Email
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
            <div className="card-body">
              <div className="card border mb-0">
                <div className="card-body pb-0">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <h4 className="fw-medium mb-1">Manage Emails</h4>
                        <p>
                          You can send and reply to emails directly via this
                          section.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <div className="mb-3">
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#create_email"
                        >
                          Connect Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* /Tab Content */}
    </div>
  );
};

export default ComapanyActvities;
