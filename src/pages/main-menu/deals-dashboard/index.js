import ApexCharts from "apexcharts";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import { fetchDashboard } from "../../../redux/dashboard";
import { fetchPipelines } from "../../../redux/pipelines";
import { LoadingGraph } from "./loading";

const mockActivities = [
  {
    id: 1,
    title: "Follow up call with client regarding project proposal",
    activity_type: { name: "Calls" },
    owner: { name: "John Smith" },
    created_date: "2024-01-15T10:30:00Z",
    status: "2",
  },
  {
    id: 2,
    title: "Send project timeline to stakeholders",
    activity_type: { name: "Emails" },
    owner: { name: "Sarah Johnson" },
    created_date: "2024-01-15T09:15:00Z",
    status: "1",
  },
  {
    id: 3,
    title: "Review and update project documentation",
    activity_type: { name: "Task" },
    owner: { name: "Mike Davis" },
    created_date: "2024-01-15T08:45:00Z",
    status: "0",
  },
  {
    id: 4,
    title: "Team meeting to discuss Q1 goals",
    activity_type: { name: "Meeting" },
    owner: { name: "Lisa Wilson" },
    created_date: "2024-01-14T14:00:00Z",
    status: "2",
  },
  {
    id: 5,
    title: "Client presentation preparation",
    activity_type: { name: "Task" },
    owner: { name: "David Brown" },
    created_date: "2024-01-14T11:20:00Z",
    status: "1",
  },
  {
    id: 6,
    title: "Follow up email for pending invoices",
    activity_type: { name: "Emails" },
    owner: { name: "Emma Taylor" },
    created_date: "2024-01-14T10:30:00Z",
    status: "2",
  },
  {
    id: 7,
    title: "Sales call with potential client",
    activity_type: { name: "Calls" },
    owner: { name: "Alex Rodriguez" },
    created_date: "2024-01-13T16:45:00Z",
    status: "2",
  },
  {
    id: 8,
    title: "Update CRM with latest contact information",
    activity_type: { name: "Task" },
    owner: { name: "Jennifer Lee" },
    created_date: "2024-01-13T15:20:00Z",
    status: "0",
  },
  {
    id: 9,
    title: "Weekly team standup meeting",
    activity_type: { name: "Meeting" },
    owner: { name: "Robert Chen" },
    created_date: "2024-01-12T09:00:00Z",
    status: "2",
  },
  {
    id: 10,
    title: "Send proposal to new client",
    activity_type: { name: "Emails" },
    owner: { name: "Amanda White" },
    created_date: "2024-01-12T13:15:00Z",
    status: "1",
  },
  {
    id: 11,
    title: "Product demo call with enterprise client",
    activity_type: { name: "Calls" },
    owner: { name: "Chris Anderson" },
    created_date: "2024-01-11T14:30:00Z",
    status: "2",
  },
  {
    id: 12,
    title: "Send weekly newsletter to subscribers",
    activity_type: { name: "Emails" },
    owner: { name: "Maria Garcia" },
    created_date: "2024-01-11T11:00:00Z",
    status: "2",
  },
  {
    id: 13,
    title: "Prepare quarterly business review",
    activity_type: { name: "Task" },
    owner: { name: "Tom Wilson" },
    created_date: "2024-01-10T16:45:00Z",
    status: "1",
  },
  {
    id: 14,
    title: "Board meeting preparation",
    activity_type: { name: "Meeting" },
    owner: { name: "Rachel Green" },
    created_date: "2024-01-10T13:00:00Z",
    status: "2",
  },
  {
    id: 15,
    title: "Follow up call with investor",
    activity_type: { name: "Calls" },
    owner: { name: "Kevin Martinez" },
    created_date: "2024-01-09T15:20:00Z",
    status: "2",
  },
];

const mockCalls = [
  {
    id: 1,
    callStatus: { name: "Completed" },
    title: "Follow up call with client",
    created_date: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    callStatus: { name: "Scheduled" },
    title: "Sales call with potential client",
    created_date: "2024-01-16T14:00:00Z",
  },
  {
    id: 3,
    callStatus: { name: "Completed" },
    title: "Team coordination call",
    created_date: "2024-01-14T11:00:00Z",
  },
  {
    id: 4,
    callStatus: { name: "Missed" },
    title: "Client consultation call",
    created_date: "2024-01-13T15:30:00Z",
  },
  {
    id: 5,
    callStatus: { name: "Completed" },
    title: "Project review call",
    created_date: "2024-01-12T09:45:00Z",
  },
  {
    id: 6,
    callStatus: { name: "Completed" },
    title: "Product demo call",
    created_date: "2024-01-11T14:30:00Z",
  },
  {
    id: 7,
    callStatus: { name: "Scheduled" },
    title: "Client onboarding call",
    created_date: "2024-01-17T10:00:00Z",
  },
  {
    id: 8,
    callStatus: { name: "Completed" },
    title: "Support call with existing client",
    created_date: "2024-01-10T16:15:00Z",
  },
  {
    id: 9,
    callStatus: { name: "Missed" },
    title: "Follow up call with prospect",
    created_date: "2024-01-09T13:45:00Z",
  },
  {
    id: 10,
    callStatus: { name: "Completed" },
    title: "Team standup call",
    created_date: "2024-01-08T09:00:00Z",
  },
];

const DealsDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [lostDealData, setLostDealData] = useState([]);
  const [winDealData, setWinDealData] = useState([]);
  const [monthlyDealData, setMonthlyDealData] = useState([]);
  const [whoChange, setWhoChange] = useState();
  const [isFetching, setIsFetching] = useState(false); // Track API call
  const [dealStageFilter, setDealStageFilter] = useState();
  const [lostDealFilter, setLostDealFilter] = useState();
  const [wonDealFilter, setWonDealFilter] = useState();
  const [monthlyDealFilter, setMonthlyDealFilter] = useState();
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"), // Default start date (Last 7 days)
    endDate: moment(),
  });
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  useEffect(() => {
    setWhoChange("");
  }, [selectedDateRange]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPipelines());
  }, [dispatch]);
  React.useEffect(() => {
    setIsFetching(true);
    dispatch(
      fetchDashboard({
        ...selectedDateRange,
        dealsPipelineFilter: dealStageFilter?.id || null,
        lostDealFilter: lostDealFilter?.id || null,
        wonDealFilter: wonDealFilter?.id || null,
        monthlyDealFilter: monthlyDealFilter?.id || null,
      })
    ).finally(() => {
      setIsFetching(false); // Finish API call
    });
  }, [
    dispatch,
    selectedDateRange,
    dealStageFilter,
    lostDealFilter,
    wonDealFilter,
    monthlyDealFilter,
  ]);
  const { pipelines } = useSelector((state) => state.pipelines);

  // Deals By Stage
  const chartRef = useRef(null);
  const { dashboard, loading, error, success } = useSelector(
    (state) => state.dashboard
  );
  useEffect(() => {
    (whoChange === "DealStage" || whoChange === "" || !dashboardData?.length) &&
      setDashboardData(dashboard.deals);
  }, [dashboard, dealStageFilter]);
  useEffect(() => {
    const chart1 = dashboardData?.map((item) => ({
      x: item?.dealName,
      y: item?.dealValue,
    }));
    // if (!dashboardData.deals || isFetching) return;
    if (chartRef.current) {
      const options = {
        series: [
          {
            name: "Deal Value",
            colors: ["#FFC38F"],
            data: chart1 ? chart1 : [{ x: 0, y: 0 }],
          },
        ],
        chart: {
          type: "bar",
          height: 275,
        },
        plotOptions: {
          bar: {
            borderRadiusApplication: "around",
            columnWidth: "50%",
          },
        },
        colors: ["#00918E"],
        xaxis: {
          type: "category",
          title: {
            text: "Stages", // Label for the x-axis
            style: {
              fontSize: "12px",
              fontWeight: 700,
              color: "#333",
            },
          },
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          categories: dashboardData?.deals?.length
            ? dashboardData?.deals?.map((item) => item.stages.name)
            : ["0"],
          title: {
            text: "Deal Value", // Label for the x-axis
            style: {
              fontSize: "12px",
              fontWeight: 700,
              color: "#333",
            },
          },
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
          tickAmount: 6,
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [dashboardData]);

  //  Leads By Stage
  const LeadsBySatge = useRef(null);
  useEffect(() => {
    (whoChange === "LostDeal" || whoChange === "" || !lostDealData?.length) &&
      setLostDealData(dashboard.lostDeals);
  }, [dashboard, lostDealFilter]);

  useEffect(() => {
    const lostChart = lostDealData?.map((item) => ({
      x: item?.dealName || "Unknown",
      y: item?.dealValue || 0,
    }));
    // if (!dashboard.lostDeals || isFetching) return;
    if (LeadsBySatge.current) {
      const options = {
        series: [
          {
            name: "Deal Value",
            colors: ["#FFC38F"],
            data: lostDealData?.length ? lostChart : [{ x: 0, y: 0 }],
          },
        ],
        chart: {
          type: "bar",
          height: 150,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#FC0027"],
        xaxis: {
          categories: lostDealData?.length
            ? lostDealData?.map((item) => item.deals.name)
            : ["0"],

          //     // tickAmount: 6,
        },
      };

      const chart = new ApexCharts(LeadsBySatge.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [lostDealData]);
  // Won Deals Chat
  const wonChat = useRef(null);
  useEffect(() => {
    (whoChange === "WinDeal" || whoChange === "" || !winDealData?.length) &&
      setWinDealData(dashboard.wonDeals);
  }, [dashboard, wonDealFilter]);

  useEffect(() => {
    const winChart = winDealData?.map((item) => ({
      x: item?.dealName || "Unknowen",
      y: item?.dealValue || 0,
    }));
    // if (!dashboard.wonDeals || isFetching) return;
    const options = {
      series: [
        {
          name: "Deal Value",
          colors: ["#FFC38F"],
          data: winDealData?.length ? winChart : [{ x: 0, y: 0 }],
        },
      ],
      chart: {
        type: "bar",
        height: 150,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#5CB85C"],
      xaxis: {
        categories: winDealData?.length
          ? winDealData?.map((item) => item.deals.name)
          : ["0"],
        //   // min: 0,
        //   // max: 500,
        //   // tickAmount: 5,
      },
    };

    if (wonChat.current) {
      const chart = new ApexCharts(wonChat.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [winDealData]);
  // Deals By Year
  const dealsByYear = useRef(null);
  // Define all months in order
  useEffect(() => {
    (whoChange === "MonthlyDeal" ||
      whoChange === "" ||
      !monthlyDealData?.length) &&
      setMonthlyDealData(dashboard.monthlyDeals);
  }, [dashboard, monthlyDealFilter]);

  // Convert `monthlyDeals` object into an array with correct month order

  const activities = { data: mockActivities };
  const calls = { data: mockCalls };
  const getActivityStats = () => {
    if (!activities?.data)
      return { total: 0, calls: 0, emails: 0, tasks: 0, meetings: 0 };

    const stats = {
      total: activities.data.length,
      calls: 0,
      emails: 0,
      tasks: 0,
      meetings: 0,
    };

    activities.data.forEach((activity) => {
      const type = activity?.activity_type?.name;
      if (type === "Calls") stats.calls++;
      else if (type === "Emails") stats.emails++;
      else if (type === "Task") stats.tasks++;
      else if (type === "Meeting") stats.meetings++;
    });

    return stats;
  };

  const getCallStats = () => {
    if (!calls?.data)
      return { total: 0, completed: 0, scheduled: 0, missed: 0 };

    const stats = {
      total: calls.data.length,
      completed: 0,
      scheduled: 0,
      missed: 0,
    };

    calls.data.forEach((call) => {
      const status = call?.callStatus?.name;
      if (status === "Completed") stats.completed++;
      else if (status === "Scheduled") stats.scheduled++;
      else if (status === "Missed") stats.missed++;
    });

    return stats;
  };

  const activityStats = getActivityStats();
  const callStats = getCallStats();

  useEffect(() => {
    const defaultData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = months.map((_, index) => monthlyDealData?.[index + 1] || 0);
    const options = {
      series: [
        {
          name: "Deals",
          data: data || defaultData,
        },
      ],
      chart: {
        height: 273,
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#E41F07"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "",
        align: "left",
      },
      xaxis: {
        categories: months,
      },
      yaxis: {
        // min: 10,
        // max: 60,
        tickAmount: 5,
        labels: {
          formatter: (val) => {
            return (val / 1000).toFixed(2) + "K";
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    };

    if (dealsByYear.current) {
      const chart = new ApexCharts(dealsByYear.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [monthlyDealData]);
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (location.pathname === "/dashboard/deals-dashboard") {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 2000);
    }
  }, [location.pathname]);

  return (
    <>
      <style>
        {` .sticky-header{
            z-index: 900 !important;  
          }
        `}
      </style>
      <Helmet>
        <title>DCC CRMS - Dashboard</title>
        <meta name="Dashboard" content="This is Dashboard page of DCC CRMS." />
      </Helmet>
      <div className="page-wrapper">
        <div className="content">
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="page-header d-none">
                <div className="row align-items-center ">
                  <div className="col-md-4">
                    <h3 className="page-title">Dashboard</h3>
                  </div>
                  <div className="col-md-8 float-end ms-auto">
                    <div className="d-flex title-head">
                      <div className="daterange-picker d-flex align-items-center justify-content-center">
                        <DateRangePickerComponent
                          selectedDateRange={selectedDateRange}
                          setSelectedDateRange={setSelectedDateRange}
                        />
                        <div className="head-icons mb-0">
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="refresh-tooltip">Refresh</Tooltip>
                            }
                          >
                            <Link
                              to="#"
                              onClick={() => {
                                setDealStageFilter(null);
                                setLostDealFilter(null);
                                setWonDealFilter(null);
                                setMonthlyDealFilter(null);
                              }}
                            >
                              <i className="ti ti-refresh-dot" />
                            </Link>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      <h3 className="text-primary mb-1">
                        {dashboard?.activity?.totalCall}
                      </h3>
                      <p className="text-muted mb-0">Total Calls</p>
                    </div>
                    <div className="avatar avatar-lg bg-primary rounded">
                      <i className="ti ti-headset text-white fs-3"></i>
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
                      <h3 className="text-info mb-1">
                        {dashboard?.activity?.totalMeeting}
                      </h3>
                      <p className="text-muted mb-0">Total Meetings</p>
                    </div>
                    <div className="avatar avatar-lg bg-info rounded">
                      <i className="ti ti-users text-white fs-3"></i>
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
                      <h3 className="text-warning mb-1">
                        {dashboard?.activity?.totalEmail}
                      </h3>
                      <p className="text-muted mb-0">Total Emails</p>
                    </div>
                    <div className="avatar avatar-lg bg-warning rounded">
                      <i className="ti ti-mail-opened text-white fs-3"></i>
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
                      <h3 className="text-danger mb-1">{dashboard?.activity?.totalTask}</h3>
                      <p className="text-muted mb-0">Total Tasks</p>
                    </div>
                    <div className="avatar avatar-lg bg-danger rounded">
                      <i className="ti ti-list-check text-white fs-3"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Statistics Cards */}
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card analytics-card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="text-success mb-1">
                        {dashboard?.activity?.completedCall}
                      </h3>
                      <p className="text-muted mb-0">Completed Calls</p>
                    </div>
                    <div className="avatar avatar-lg bg-success rounded">
                      <i className="ti ti-phone-check text-white fs-3"></i>
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
                      <h3 className="text-warning mb-1">
                        {dashboard?.activity?.completedMeeting}
                      </h3>
                      <p className="text-muted mb-0">Completed Meetings</p>
                    </div>
                    <div className="avatar avatar-lg bg-warning rounded">
                      <i className="ti ti-calendar-time text-white fs-3"></i>
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
                      <h3 className="text-danger mb-1">{dashboard?.activity?.completedEmail}</h3>
                      <p className="text-muted mb-0">Completed Emails</p>
                    </div>
                    <div className="avatar avatar-lg bg-danger rounded">
                      <i className="ti ti-mail-check text-white fs-3"></i>
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
                      <h3 className="text-secondary mb-1">{dashboard?.activity?.completedTask}</h3>
                      <p className="text-muted mb-0">Completed Tasks</p>
                    </div>
                    <div className="avatar avatar-lg bg-secondary rounded">
                      <i className="ti ti-list-details text-white fs-3"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="scroll-container col-md-6 position-relative">
              <LoadingGraph
                isFetching={isFetching}
                whoChange={whoChange}
                name=""
              />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Recently Created Deals
                    </h4>
                    {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="card-body">
                  <div
                    style={{
                      height: "38.7vh",
                      marginBottom: "15px",
                      overflowY: "scroll",
                    }}
                    className="scroll-containe table-responsive custom-table"
                  >
                    <table className="table dataTable" id="deals-project">
                      <thead className="thead-light sticky-sm-top sticky-header ">
                        <tr>
                          <th>Deal Name</th>
                          <th>Stage</th>
                          <th>Deal Value</th>
                          <th>Priority</th>
                          {/* <th>Probability</th> */}
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard?.deal?.map((item) => (
                          <tr className="odd">
                            <td>{item?.dealName}</td>
                            <td>{item?.deals?.name}</td>
                            <td>{item?.currency + " " + item?.dealValue}</td>
                            <td>{item?.priority}</td>
                            {/* <td>85%</td> */}
                            <td>
                              <span
                                className={`badge badge-pill  ${item?.status == "Open" ? "bg-info" : item?.status == "Lost" ? "bg-danger" : "bg-success"}`}
                              >
                                {item?.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* // : <div style={{width:"100%", height:'60%'}} className=" d-flex justify-content-center mx-25 ">  </div>} */}
                      </tbody>
                    </table>
                    {/* <NoDataFound /> */}
                    {!dashboard?.deal?.length && (
                      <div
                        style={{ marginLeft: "25%", marginTop: "10%" }}
                        className="d-flex flex-column align-items-center justify-content-center h-50 w-50  py-5 gap-3"
                      >
                        <img
                          src="https://pub-16f3de4d2c4841169d66d16992f9f0d3.r2.dev/assets/Sales/pana.svg"
                          alt=""
                        />
                        <p className="h5 font-weight-semibold">No Data Found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 position-relative ">
              <LoadingGraph
                isFetching={isFetching}
                whoChange={whoChange}
                name="DealStage"
              />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Deals By Stage
                    </h4>
                    <div
                      style={{ height: "6.7vh", width: "34%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {dealStageFilter?.name || "Select Pipeline"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() => {
                              setDealStageFilter({
                                id: null,
                                name: "All Pipeline",
                              });
                              setWhoChange("DealStage");
                            }}
                            className="dropdown-item"
                          >
                            All Pipeline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() => {
                                setDealStageFilter({
                                  id: item.id,
                                  name: item.name,
                                });
                                setWhoChange("DealStage");
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "40vh",
                    marginBottom: "15px",
                    overflowY: "hidden",
                  }}
                  className="card-body"
                >
                  <div id="deals-chart" ref={chartRef} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 position-relative ">
              <LoadingGraph
                isFetching={isFetching}
                whoChange={whoChange}
                name="LostDeal"
              />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Lost Deads Stage
                    </h4>
                    <div
                      style={{ width: "34%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {lostDealFilter?.name || "Select Pipeline"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() => {
                              setLostDealFilter({
                                id: null,
                                name: "All Pipeline",
                              });
                              setWhoChange("LostDeal");
                            }}
                            className="dropdown-item"
                          >
                            All Pipeline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() => {
                                setLostDealFilter({
                                  id: item.id,
                                  name: item.name,
                                });
                                setWhoChange("LostDeal");
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="last-chart" ref={LeadsBySatge} />
                </div>
              </div>
            </div>
            <div className="col-md-6 position-relative ">
              <LoadingGraph
                isFetching={isFetching}
                whoChange={whoChange}
                name="WinDeal"
              />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Won Deals Stage
                    </h4>
                    <div
                      style={{ width: "34%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {wonDealFilter?.name || "Select Pipeline"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() => {
                              setWonDealFilter({
                                id: null,
                                name: "All Pipeline",
                              });
                              setWhoChange("WinDeal");
                            }}
                            className="dropdown-item"
                          >
                            All Pipeline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() => {
                                setWonDealFilter({
                                  id: item.id,
                                  name: item.name,
                                });
                                setWhoChange("WinDeal");
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="won-chart" ref={wonChat} />
                </div>
              </div>
            </div>
          </div>
          <div className="row position-relative">
            <LoadingGraph
              isFetching={isFetching}
              whoChange={whoChange}
              name="MonthlyDeal"
            />
            <div className="col-md-12 d-flex">
              <div
                className="card
               w-100"
              >
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Deals by Year
                    </h4>
                    <div
                      style={{ width: "20%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {monthlyDealFilter?.name || "Select Pipeline"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() => {
                              setMonthlyDealFilter({
                                id: null,
                                name: "All Pipeline",
                              });
                              setWhoChange("MonthlyDeal");
                            }}
                            className="dropdown-item"
                          >
                            All Pipeline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() => {
                                setMonthlyDealFilter({
                                  id: item.id,
                                  name: item.name,
                                });
                                setWhoChange("MonthlyDeal");
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="deals-year" ref={dealsByYear} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealsDashboard;
