import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import ActivitiesModal from "./modal/ActivitiesModal";

const ActivitiesGrid = ({ data }) => {
  const [selectedContact, setSelectedContact] = useState();

  
  return (
    <>
      <div className="d-flex flex-wrap">
        {data.map((activity, index) => (
          <div
            className={`col-xxl-4 col-xl-4 col-md-6 ${
              index % 3 === 1 ? "px-xl-1 py-xl-2 p-md-2" : "p-xl-2 p-md-2"
            }`}
            key={activity.id || index}
          >
            <div className="card border p-3 mb-3">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  {activity?.owner?.profile_img ? (
                    <img
                      src={activity.owner.profile_img}
                      alt="Owner"
                      className="rounded-circle border shadow-sm me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-light d-flex justify-content-center align-items-center border me-3"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <i className="fa fa-user text-muted" />
                    </div>
                  )}

                  <div>
                    <h6 className="mb-0">{activity.title || "Untitled Activity"}</h6>
                    <span
                      className={`badge ${
                        activity.activity_type?.name === "Calls"
                          ? "bg-success"
                          : activity.activity_type?.name === "Emails"
                          ? "bg-primary"
                          : activity.activity_type?.name === "Task"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {activity.activity_type?.name || "No Type"}
                    </span>
                  </div>
                </div>

                {/* Edit & Delete */}
                <div className="dropdown table-action">
                  <Link
                    to="#"
                    className="action-icon"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-ellipsis-v" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-right">
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add_activities"
                      onClick={() => setSelectedContact(activity)}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_activity"
                      onClick={() => setSelectedContact(activity.id)}
                    >
                      <i className="ti ti-trash text-danger"></i> Delete
                    </Link>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="row g-2">
                <InfoRow
                  label="Owner:"
                  value={activity?.owner || "No Owner"}
                />
                <InfoRow
                  label="Due date:"
                  value={
                    activity.due_date && activity.due_time
                      ? `${moment(activity.due_date).format("ll")} ${moment(
                          activity.due_time,
                          "HH:mm"
                        ).format("hh:mm A")}`
                      : "No Due Date"
                  }
                />
                <InfoRow
                  label="Company:"
                  value={activity.company_of_activity?.name || "No Company"}
                />
                <InfoRow
                  label="Deal:"
                  value={activity.deal_of_activity?.dealName || "No Deal"}
                />
                <InfoRow
                  label="Contact:"
                  value={
                    activity.contact_of_activity
                      ? `${activity.contact_of_activity.firstName || ""} ${
                          activity.contact_of_activity.lastName || ""
                        }`
                      : "No Contact"
                  }
                />
                <InfoRow
                  label="Priority:"
                  value={
                    <span
                      className={`badge ${
                        activity.priority === 1
                          ? "bg-success"
                          : activity.priority === 2
                          ? "bg-warning text-dark"
                          : activity.priority === 3
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {activity.priority === 1
                        ? "Low"
                        : activity.priority === 2
                        ? "Normal"
                        : activity.priority === 3
                        ? "High"
                        : "No Priority"}
                    </span>
                  }
                />
              </div>

              {/* Tags */}
              {activity.tags && (
                <div className="mt-3 d-flex flex-wrap gap-1">
                  {activity.tags.split(",").map((tag, i) => (
                    <span
                      key={i}
                      className="badge bg-light text-dark border"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="load-btn text-center pb-4">
        <Link to="#" className="btn btn-primary">
          Load More Activity
          <i className="ti ti-loader" />
        </Link>
      </div>

      <ActivitiesModal setActivity={setSelectedContact} activity={selectedContact} />
    </>
  );
};

// Reusable InfoRow component
const InfoRow = ({ label, value }) => (
  <p className="text-default d-inline-flex gap-2 align-items-center mb-2">
    <span className="fw-medium text-black text-nowrap">{label}</span>
    <span>{value}</span>
  </p>
);

export default ActivitiesGrid;
