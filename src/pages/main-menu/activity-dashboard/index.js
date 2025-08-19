import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import Loader from "../../../components/common/loader";

// Mock data for demonstration
const mockActivities = [
  {
    id: 1,
    title: "Follow up call with client regarding project proposal",
    activity_type: { name: "Calls" },
    owner: { name: "John Smith" },
    created_date: "2024-01-15T10:30:00Z",
    status: "2"
  },
  {
    id: 2,
    title: "Send project timeline to stakeholders",
    activity_type: { name: "Emails" },
    owner: { name: "Sarah Johnson" },
    created_date: "2024-01-15T09:15:00Z",
    status: "1"
  },
  {
    id: 3,
    title: "Review and update project documentation",
    activity_type: { name: "Task" },
    owner: { name: "Mike Davis" },
    created_date: "2024-01-15T08:45:00Z",
    status: "0"
  },
  {
    id: 4,
    title: "Team meeting to discuss Q1 goals",
    activity_type: { name: "Meeting" },
    owner: { name: "Lisa Wilson" },
    created_date: "2024-01-14T14:00:00Z",
    status: "2"
  },
  {
    id: 5,
    title: "Client presentation preparation",
    activity_type: { name: "Task" },
    owner: { name: "David Brown" },
    created_date: "2024-01-14T11:20:00Z",
    status: "1"
  },
  {
    id: 6,
    title: "Follow up email for pending invoices",
    activity_type: { name: "Emails" },
    owner: { name: "Emma Taylor" },
    created_date: "2024-01-14T10:30:00Z",
    status: "2"
  },
  {
    id: 7,
    title: "Sales call with potential client",
    activity_type: { name: "Calls" },
    owner: { name: "Alex Rodriguez" },
    created_date: "2024-01-13T16:45:00Z",
    status: "2"
  },
  {
    id: 8,
    title: "Update CRM with latest contact information",
    activity_type: { name: "Task" },
    owner: { name: "Jennifer Lee" },
    created_date: "2024-01-13T15:20:00Z",
    status: "0"
  },
  {
    id: 9,
    title: "Weekly team standup meeting",
    activity_type: { name: "Meeting" },
    owner: { name: "Robert Chen" },
    created_date: "2024-01-12T09:00:00Z",
    status: "2"
  },
  {
    id: 10,
    title: "Send proposal to new client",
    activity_type: { name: "Emails" },
    owner: { name: "Amanda White" },
    created_date: "2024-01-12T13:15:00Z",
    status: "1"
  },
  {
    id: 11,
    title: "Product demo call with enterprise client",
    activity_type: { name: "Calls" },
    owner: { name: "Chris Anderson" },
    created_date: "2024-01-11T14:30:00Z",
    status: "2"
  },
  {
    id: 12,
    title: "Send weekly newsletter to subscribers",
    activity_type: { name: "Emails" },
    owner: { name: "Maria Garcia" },
    created_date: "2024-01-11T11:00:00Z",
    status: "2"
  },
  {
    id: 13,
    title: "Prepare quarterly business review",
    activity_type: { name: "Task" },
    owner: { name: "Tom Wilson" },
    created_date: "2024-01-10T16:45:00Z",
    status: "1"
  },
  {
    id: 14,
    title: "Board meeting preparation",
    activity_type: { name: "Meeting" },
    owner: { name: "Rachel Green" },
    created_date: "2024-01-10T13:00:00Z",
    status: "2"
  },
  {
    id: 15,
    title: "Follow up call with investor",
    activity_type: { name: "Calls" },
    owner: { name: "Kevin Martinez" },
    created_date: "2024-01-09T15:20:00Z",
    status: "2"
  }
];

const mockCalls = [
  {
    id: 1,
    callStatus: { name: "Completed" },
    title: "Follow up call with client",
    created_date: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    callStatus: { name: "Scheduled" },
    title: "Sales call with potential client",
    created_date: "2024-01-16T14:00:00Z"
  },
  {
    id: 3,
    callStatus: { name: "Completed" },
    title: "Team coordination call",
    created_date: "2024-01-14T11:00:00Z"
  },
  {
    id: 4,
    callStatus: { name: "Missed" },
    title: "Client consultation call",
    created_date: "2024-01-13T15:30:00Z"
  },
  {
    id: 5,
    callStatus: { name: "Completed" },
    title: "Project review call",
    created_date: "2024-01-12T09:45:00Z"
  },
  {
    id: 6,
    callStatus: { name: "Completed" },
    title: "Product demo call",
    created_date: "2024-01-11T14:30:00Z"
  },
  {
    id: 7,
    callStatus: { name: "Scheduled" },
    title: "Client onboarding call",
    created_date: "2024-01-17T10:00:00Z"
  },
  {
    id: 8,
    callStatus: { name: "Completed" },
    title: "Support call with existing client",
    created_date: "2024-01-10T16:15:00Z"
  },
  {
    id: 9,
    callStatus: { name: "Missed" },
    title: "Follow up call with prospect",
    created_date: "2024-01-09T13:45:00Z"
  },
  {
    id: 10,
    callStatus: { name: "Completed" },
    title: "Team standup call",
    created_date: "2024-01-08T09:00:00Z"
  }
];

const ActivityDashboard = () => {
  // Note: This dashboard uses mock data for demonstration purposes
  // In production, replace with actual Redux state and API calls
  
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const [isFetching, setIsFetching] = useState(false);

  // Use mock data instead of Redux state
  const activities = { data: mockActivities };
  const calls = { data: mockCalls };
  const loading = false;
  const callsLoading = false;
  const error = null;
  const activityTypes = [];

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
    // Mock data is already available, no need to fetch
    setIsFetching(false);
  }, []);

  useEffect(() => {
    // Simulate loading for date range changes
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
    }, 500);
  }, [selectedDateRange]);

  // Calculate statistics
  const getActivityStats = () => {
    if (!activities?.data) return { total: 0, calls: 0, emails: 0, tasks: 0, meetings: 0 };

    const stats = {
      total: activities.data.length,
      calls: 0,
      emails: 0,
      tasks: 0,
      meetings: 0
    };

    activities.data.forEach(activity => {
      const type = activity?.activity_type?.name;
      if (type === "Calls") stats.calls++;
      else if (type === "Emails") stats.emails++;
      else if (type === "Task") stats.tasks++;
      else if (type === "Meeting") stats.meetings++;
    });

    return stats;
  };

  const getCallStats = () => {
    if (!calls?.data) return { total: 0, completed: 0, scheduled: 0, missed: 0 };

    const stats = {
      total: calls.data.length,
      completed: 0,
      scheduled: 0,
      missed: 0
    };

    calls.data.forEach(call => {
      const status = call?.callStatus?.name;
      if (status === "Completed") stats.completed++;
      else if (status === "Scheduled") stats.scheduled++;
      else if (status === "Missed") stats.missed++;
    });

    return stats;
  };

  // Chart options
  const getActivityTypeChartOptions = () => {
    const stats = getActivityStats();
    const chartData = [
      { name: "Calls", value: stats.calls, color: "#28a745" },
      { name: "Emails", value: stats.emails, color: "#6f42c1" },
      { name: "Tasks", value: stats.tasks, color: "#007bff" },
      { name: "Meetings", value: stats.meetings, color: "#17a2b8" }
    ].filter(item => item.value > 0);

    return {
      series: chartData.map(item => item.value),
      options: {
        chart: {
          type: "donut",
          height: 300,
        },
        colors: chartData.map(item => item.color),
        labels: chartData.map(item => item.name),
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
            donut: {
              size: '60%',
            }
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.globals.seriesTotals[opts.seriesIndex];
          }
        },
        legend: {
          position: "bottom",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      }
    };
  };

  const getActivityTrendChartOptions = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = moment().subtract(6 - i, "days");
      return {
        date: date.format("MMM DD"),
        dateObj: date
      };
    });

    const dailyStats = last7Days.map(day => {
      const dayActivities = activities.data.filter(activity => 
        moment(activity.created_date).isSame(day.dateObj, 'day')
      );
      return {
        x: day.date,
        y: dayActivities.length
      };
    });

    return {
      series: [
        {
          name: "Activities",
          data: dailyStats
        }
      ],
      options: {
        chart: {
          type: "area",
          height: 300,
          toolbar: {
            show: false
          }
        },
        colors: ["#4A00E5"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: 3
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100]
          }
        },
        xaxis: {
          categories: dailyStats.map(item => item.x),
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        grid: {
          borderColor: "#f1f1f1",
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " activities";
            }
          }
        }
      }
    };
  };

  const activityStats = getActivityStats();
  const callStats = getCallStats();
  const activityTypeChartData = getActivityTypeChartOptions();
  const activityTrendChartData = getActivityTrendChartOptions();

  // Mock data is always available, no loading needed

  return (
    <>
      <Helmet>
        <title>Activity Dashboard - CRM System</title>
        <meta name="description" content="Activity Dashboard showing calls, emails, and tasks statistics" />
      </Helmet>

      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h4 className="page-title">Activity Dashboard</h4>
                    <p className="text-muted mb-0">Overview of your activities and performance</p>
                  </div>
                  <div className="col-md-6">
                    <div className="float-end">
                      <DateRangePickerComponent
                        selectedDateRange={selectedDateRange}
                        setSelectedDateRange={setSelectedDateRange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-primary mb-1">{activityStats.total}</h3>
                          <p className="text-muted mb-0">Total Activities</p>
                        </div>
                        <div className="avatar avatar-lg bg-primary rounded">
                          <i className="ti ti-activity text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-success mb-1">{activityStats.calls}</h3>
                          <p className="text-muted mb-0">Total Calls</p>
                        </div>
                        <div className="avatar avatar-lg bg-success rounded">
                          <i className="ti ti-phone text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-purple mb-1">{activityStats.emails}</h3>
                          <p className="text-muted mb-0">Total Emails</p>
                        </div>
                        <div className="avatar avatar-lg bg-purple rounded">
                          <i className="ti ti-mail text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-info mb-1">{activityStats.tasks}</h3>
                          <p className="text-muted mb-0">Total Tasks</p>
                        </div>
                        <div className="avatar avatar-lg bg-info rounded">
                          <i className="ti ti-subtask text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Statistics Cards */}
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-success mb-1">{callStats.completed}</h3>
                          <p className="text-muted mb-0">Completed Calls</p>
                        </div>
                        <div className="avatar avatar-lg bg-success rounded">
                          <i className="ti ti-check text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-warning mb-1">{callStats.scheduled}</h3>
                          <p className="text-muted mb-0">Scheduled Calls</p>
                        </div>
                        <div className="avatar avatar-lg bg-warning rounded">
                          <i className="ti ti-clock text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-danger mb-1">{callStats.missed}</h3>
                          <p className="text-muted mb-0">Missed Calls</p>
                        </div>
                        <div className="avatar avatar-lg bg-danger rounded">
                          <i className="ti ti-x text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card analytics-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="text-primary mb-1">{callStats.total}</h3>
                          <p className="text-muted mb-0">Total Calls</p>
                        </div>
                        <div className="avatar avatar-lg bg-primary rounded">
                          <i className="ti ti-phone text-white fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="row">
                <div className="col-xl-6">
                  <div className="card analytics-card">
                    <div className="card-header">
                      <h3>
                        <i className="ti ti-chart-pie me-2"></i>
                        Activity Distribution
                      </h3>
                    </div>
                    <div className="card-body">
                      {isFetching ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <ReactApexChart
                          options={activityTypeChartData.options}
                          series={activityTypeChartData.series}
                          type="donut"
                          height={300}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-xl-6">
                  <div className="card analytics-card">
                    <div className="card-header">
                      <h3>
                        <i className="ti ti-chart-line me-2"></i>
                        Activity Trend (Last 7 Days)
                      </h3>
                    </div>
                    <div className="card-body">
                      {isFetching ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <ReactApexChart
                          options={activityTrendChartData.options}
                          series={activityTrendChartData.series}
                          type="area"
                          height={300}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="row">
                <div className="col-12">
                  <div className="card analytics-card">
                    <div className="card-header">
                      <h3>
                        <i className="ti ti-list me-2"></i>
                        Recent Activities
                      </h3>
                    </div>
                    <div className="card-body">
                      {activities?.data?.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Owner</th>
                                <th>Created Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activities.data.map((activity, index) => (
                                <tr key={activity.id || index}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className={`avatar avatar-sm rounded me-2 ${
                                        activity?.activity_type?.name === "Calls" ? "bg-success" :
                                        activity?.activity_type?.name === "Emails" ? "bg-purple" :
                                        activity?.activity_type?.name === "Task" ? "bg-info" :
                                        "bg-warning"
                                      }`}>
                                        <i className={`${
                                          activity?.activity_type?.name === "Calls" ? "ti ti-phone" :
                                          activity?.activity_type?.name === "Emails" ? "ti ti-mail" :
                                          activity?.activity_type?.name === "Task" ? "ti ti-subtask" :
                                          "ti ti-user-share"
                                        }`}></i>
                                      </span>
                                      <span className="fw-medium">{activity.title}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`badge ${
                                      activity?.activity_type?.name === "Calls" ? "bg-success" :
                                      activity?.activity_type?.name === "Emails" ? "bg-purple" :
                                      activity?.activity_type?.name === "Task" ? "bg-info" :
                                      "bg-warning"
                                    }`}>
                                      {activity?.activity_type?.name || "N/A"}
                                    </span>
                                  </td>
                                  <td>{activity?.owner?.name || "N/A"}</td>
                                  <td>
                                    {activity?.created_date ? 
                                      moment(activity.created_date).format("MMM DD, YYYY") : 
                                      "N/A"
                                    }
                                  </td>
                                  <td>
                                    <span className={`badge ${
                                      activity?.status === "0" ? "bg-warning" :
                                      activity?.status === "1" ? "bg-info" :
                                      activity?.status === "2" ? "bg-success" :
                                      activity?.status === "3" ? "bg-danger" :
                                      "bg-secondary"
                                    }`}>
                                      {activity?.status === "0" ? "Pending" :
                                       activity?.status === "1" ? "In Progress" :
                                       activity?.status === "2" ? "Completed" :
                                       activity?.status === "3" ? "Cancelled" :
                                       "Unknown"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="ti ti-inbox fs-1 text-muted mb-3"></i>
                          <p className="text-muted">No activities found for the selected date range.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityDashboard;
