import {
  Bell,
  Calendar,
  CheckSquare,
  Clock,
  Edit2,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ManageActivitiesModal from "./manageActivity";
import { useDispatch } from "react-redux";
import { fetchActivitiesByObject } from "../../../redux/Activities";
import { useSelector } from "react-redux";

const ActivityList = ({
  id,
  code,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}) => {
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activity,setActivity]=useState()

  const { activities, loading, error, success } = useSelector(
    (state) => state.activities || {}
  );
  useEffect(() => {
    id && dispatch(fetchActivitiesByObject({ object_id: id }));
  }, [dispatch, id]);
  // Static mock data based on your activity structure
  //   const activities = [
  //     {
  //       id: 1,
  //       title: "Follow up call with client about project requirements",
  //       type_id: 1,
  //       type_name: "Calls",
  //       status: "pending",
  //       priority: 3,
  //       due_date: "2024-01-25",
  //       due_time: "14:30",
  //       owner_name: "John Smith",
  //       owner_id: 1,
  //       description: "Discuss project timeline and budget requirements for Q1 2024",
  //       is_reminder: "Y",
  //       reminder_time: "30",
  //       reminder_type: "M",
  //       object_name: "Quotation",
  //       object_id: "QT-001"
  //     },
  //     {
  //       id: 2,
  //       title: "Send proposal presentation to marketing team",
  //       type_id: 2,
  //       type_name: "Emails",
  //       status: "completed",
  //       priority: 2,
  //       due_date: "2024-01-24",
  //       due_time: "10:00",
  //       owner_name: "Sarah Johnson",
  //       owner_id: 2,
  //       description: "Email the updated marketing proposal with Q4 results analysis",
  //       is_reminder: "N",
  //       reminder_time: "",
  //       reminder_type: "",
  //       object_name: "Quotation",
  //       object_id: "QT-002"
  //     },
  //     {
  //       id: 3,
  //       title: "Review and update project documentation",
  //       type_id: 3,
  //       type_name: "Task",
  //       status: "in_progress",
  //       priority: 1,
  //       due_date: "2024-01-26",
  //       due_time: "16:00",
  //       owner_name: "Mike Davis",
  //       owner_id: 3,
  //       description: "Update technical documentation for the new feature release",
  //       is_reminder: "Y",
  //       reminder_time: "2",
  //       reminder_type: "H",
  //       object_name: "Quotation",
  //       object_id: "QT-003"
  //     },
  //     {
  //       id: 4,
  //       title: "Weekly team standup meeting",
  //       type_id: 4,
  //       type_name: "Meeting",
  //       status: "pending",
  //       priority: 2,
  //       due_date: "2024-01-25",
  //       due_time: "09:00",
  //       owner_name: "Emily Wilson",
  //       owner_id: 4,
  //       description: "Discuss weekly progress, blockers, and upcoming sprint planning",
  //       is_reminder: "Y",
  //       reminder_time: "15",
  //       reminder_type: "M",
  //       object_name: "Quotation",
  //       object_id: "QT-004"
  //     },
  //     {
  //       id: 5,
  //       title: "Client feedback review and implementation",
  //       type_id: 3,
  //       type_name: "Task",
  //       status: "overdue",
  //       priority: 3,
  //       due_date: "2024-01-23",
  //       due_time: "12:00",
  //       owner_name: "Alex Chen",
  //       owner_id: 5,
  //       description: "Implement client feedback from the last review session",
  //       is_reminder: "N",
  //       reminder_time: "",
  //       reminder_type: "",
  //       object_name: "Quotation",
  //       object_id: "QT-005"
  //     }
  //   ];

  // Helper functions
  const getActivityIcon = (typeName) => {
    const iconMap = {
      Calls: Phone,
      Emails: Mail,
      Task: CheckSquare,
      Meeting: Users,
    };
    return iconMap[typeName] || CheckSquare;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: { bg: "#fff3cd", text: "#856404", border: "#ffeaa7" },
      in_progress: { bg: "#d1ecf1", text: "#0c5460", border: "#74b9ff" },
      completed: { bg: "#d4edda", text: "#155724", border: "#00b894" },
      overdue: { bg: "#f8d7da", text: "#721c24", border: "#e17055" },
    };
    return colorMap[status] || colorMap["pending"];
  };

  const getPriorityConfig = (priority) => {
    const priorityMap = {
      3: { label: "High", color: "#e17055", bg: "#ffebee" },
      2: { label: "Normal", color: "#74b9ff", bg: "#e3f2fd" },
      1: { label: "Low", color: "#00b894", bg: "#e8f5e8" },
      0: { label: "None", color: "#636e72", bg: "#f8f9fa" },
    };
    return priorityMap[priority] || priorityMap[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredActivities = activities?.data?.filter((activity) => {
    const matchesFilter =
      selectedFilter === "all" || activity.status === selectedFilter;
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  //   const filterOptions = [
  //     { value: "all", label: "All Activities", count: activities.length },
  //     { value: "pending", label: "Pending", count: activities.filter(a => a.status === "pending").length },
  //     { value: "in_progress", label: "In Progress", count: activities.filter(a => a.status === "in_progress").length },
  //     { value: "completed", label: "Completed", count: activities.filter(a => a.status === "completed").length },
  //     { value: "overdue", label: "Overdue", count: activities.filter(a => a.status === "overdue").length }
  //   ];

  return (
    <div
      className="container-fluid p-4"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      {/* Enhanced Header */}
      <div className="row">
        <div className="col-12">
          <div
            className="card mb-2 border-0 shadow-sm"
            style={{
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center text-white">
                <div>
                  <h2 className="mb-2 fw-bold">📋 Activities</h2>
                  <p className="mb-0 opacity-90">
                    Manage and track your team's activities efficiently
                  </p>
                </div>
                {/* <button  type="button"
                  className="btn btn-light btn-lg px-4 py-2 d-flex align-items-center gap-2"
                  style={{ borderRadius: "12px", fontWeight: "600" }}
                  onClick={() => onAddActivity && onAddActivity()}
                >
                  <Plus size={20} />
                  New Activity
                </button> */}
                <div className="header-actions d-flex justify-content-end">
                  <Link
                    to="#"
                    className="btn btn-purple btn-sm fw-medium px-3 mb-1 py-2 shadow-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#activity_modal"
                  >
                    <i className="ti ti-plus me-2"></i>Activity
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      {/* <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex gap-2 flex-wrap">
                    {filterOptions.map((filter) => (
                      <button
                        key={filter.value}
                        className={`btn px-3 py-2 ${
                          selectedFilter === filter.value 
                            ? 'btn-primary' 
                            : 'btn-outline-secondary'
                        }`}
                        style={{ 
                          borderRadius: "10px",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}
                        onClick={() => setSelectedFilter(filter.value)}
                      >
                        {filter.label}
                        <span className={`ms-2 badge ${
                          selectedFilter === filter.value 
                            ? 'bg-white text-primary' 
                            : 'bg-secondary'
                        }`}>
                          {filter.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="position-relative">
                    <Search 
                      className="position-absolute" 
                      size={18} 
                      style={{ 
                        left: "15px", 
                        top: "50%", 
                        transform: "translateY(-50%)", 
                        color: "#6c757d" 
                      }} 
                    />
                    <input
                      type="text"
                      className="form-control ps-5 border-0 shadow-sm"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        borderRadius: "12px",
                        height: "45px",
                        backgroundColor: "#f8f9fa"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Activity Cards */}
      <div className="row">
        {filteredActivities.length === 0 ? (
          <div className="col-12">
            <div
              className="card border-0 shadow-sm text-center py-3"
              style={{ borderRadius: "16px" }}
            >
              <div className="card-body">
                <div className="mb-4">
                  <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#f1f5f9",
                      color: "#64748b",
                    }}
                  >
                    <CheckSquare size={32} />
                  </div>
                </div>
                <h5 className="text-muted mb-2">No activities found</h5>
                <p className="text-muted">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            </div>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type_name);
            const statusConfig = getStatusColor(activity.status);
            const priorityConfig = getPriorityConfig(activity.priority);

            return (
              <div key={activity.id} className="col-lg-12  mb-3">
                <div
                  className="card border-0 shadow-sm h-100 hover-card"
                  style={{
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Card Header */}
                  <div className="card-header border-0 bg-white d-flex justify-content-between align-items-start p-4 py-2">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "45px",
                          height: "45px",
                          backgroundColor: "#f8fafc",
                          color: "#667eea",
                        }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <span
                          className="badge px-3 py-2"
                          style={{
                            backgroundColor: statusConfig.bg,
                            color: statusConfig.text,
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {activity.status.replace("_", " ")}
                        </span>
                        {activity.priority > 0 && (
                          <span
                            className="badge ms-2 px-2 py-1"
                            style={{
                              backgroundColor: priorityConfig.bg,
                              color: priorityConfig.color,
                              borderRadius: "6px",
                              fontSize: "0.7rem",
                            }}
                          >
                            {priorityConfig.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="dropdown">
                      <button
                        type="button"
                        className="btn btn-link p-0 text-muted"
                        data-bs-toggle="dropdown"
                      >
                        <MoreVertical size={18} />
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end shadow border-0"
                        style={{ borderRadius: "12px" }}
                      >
                        <li>
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#activity_modal"
                            className="dropdown-item d-flex align-items-center gap-2"
                            onClick={() =>setActivity(activity)
                          
                            }
                          >
                            <Edit2 size={14} />
                            Edit Activity
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        {/* <li>
                          <button
                            type="button"
                            className="dropdown-item text-danger d-flex align-items-center gap-2"
                            onClick={() =>
                              onDeleteActivity && onDeleteActivity(activity.id)
                            }
                          >
                            <Trash2 size={14} />
                            Delete Activity
                          </button>
                        </li> */}
                      </ul>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body pt-0 px-4">
                    <h6
                      className="card-title fw-bold mb-2 text-dark"
                      style={{ fontSize: "1rem", lineHeight: "1.2" }}
                    >
                      {activity.title}
                    </h6>

                    <div className="mb-3">
                      <p
                        className="text-muted mb-0 small"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              activity.description.length > 80
                                ? activity.description.substring(0, 80) + "..."
                                : activity.description,
                          }}
                        />
                      </p>
                    </div>

                    {/* Activity Details */}
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                          <Calendar size={14} className="text-muted" />
                          <small className="text-dark fw-medium">
                            {formatDate(activity.due_date)}
                          </small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={14} className="text-muted" />
                          <small className="text-dark fw-medium">
                            {formatTime(activity.due_time)}
                          </small>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex align-items-center gap-2">
                          <User size={14} className="text-muted" />
                          <small className="text-dark fw-medium">
                            {activity.owner}
                          </small>
                          {activity.is_reminder === "Y" && (
                            <Bell size={12} className="text-info ms-auto" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Object Reference */}
                    <div
                      className="p-2 rounded-3 d-flex align-items-center justify-content-between"
                      style={{ backgroundColor: "#f8fafc" }}
                    >
                      <small className="text-muted">
                        <strong className="mx-2">{activity.object_name }:</strong>{code} 
                      </small>
                      <span
                        className="badge bg-light text-dark"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {activity.activity_type?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Statistics Footer */}
      {/* <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4">
              <div className="row text-center">
                <div className="col-md-3 col-6 mb-3 mb-md-0">
                  <div className="d-flex flex-column align-items-center">
                    <h4 className="fw-bold text-primary mb-1">{activities.length}</h4>
                    <small className="text-muted">Total Activities</small>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3 mb-md-0">
                  <div className="d-flex flex-column align-items-center">
                    <h4 className="fw-bold text-warning mb-1">
                      {activities.filter(a => a.status === "pending").length}
                    </h4>
                    <small className="text-muted">Pending</small>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="d-flex flex-column align-items-center">
                    <h4 className="fw-bold text-success mb-1">
                      {activities.filter(a => a.status === "completed").length}
                    </h4>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="d-flex flex-column align-items-center">
                    <h4 className="fw-bold text-danger mb-1">
                      {activities.filter(a => a.status === "overdue").length}
                    </h4>
                    <small className="text-muted">Overdue</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <ManageActivitiesModal activity={activity} id={id} />
    </div>
  );
};

export default ActivityList;
