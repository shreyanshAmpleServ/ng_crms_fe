import React, { useEffect, useState } from "react";
import { X, Phone, Mail, CheckSquare, Users } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { TimePicker } from "antd";
import DefaultEditor from "react-simple-wysiwyg";
import { DatePicker } from "antd";
import { StatusOptions } from "../../../components/common/selectoption/selectoption";
import { useSelector } from "react-redux";
import { addActivities, fetchActivityTypes, updateActivities } from "../../../redux/Activities";
import { fetchUsers } from "../../../redux/manage-user";


const ManageActivitiesModal = ({ setActivity, activity, onClose,id}) => {
  const [selectedType, setSelectedType] = useState(null);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    is_reminder: false,
    type_id: null,
    due_date: new Date().toISOString().split("T")[0],
    due_time: "09:00",
    reminder_time: "",
    reminder_type: "",
    owner_id: null,
    owner_name: "",
    priority: 0,
    description: "",
    object_name:  "Quotation",
    object_id: id,
  });
    React.useEffect(() => {
      dispatch(fetchActivityTypes());
      dispatch(fetchUsers());
    }, [dispatch]);
  const { loading } = useSelector((state) => state?.activities);
  const { users } = useSelector((state) => state.users);
    const activityTypes = useSelector((state) => state.activities.activityTypes);
  // Mock data
//   const activityTypes = [
//     { id: 1, name: "Calls", icon: Phone },
//     { id: 2, name: "Emails", icon: Mail },
//     { id: 3, name: "Task", icon: CheckSquare },
//     { id: 4, name: "Meeting", icon: Users },
//   ];
  const options1 = [
    // { value: "", label: "Select" },
    { value: "M", label: "Minutes" },
    { value: "H", label: "Hours" },
  ];

  const options2 = [
    { value: 0, label: "Select" },
    { value: 3, label: "High" },
    { value: 2, label: "Normal" },
    { value: 1, label: "Low" },
  ];

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      status: "",
      is_reminder: "N",
      type_id: null,
      due_date: dayjs(new Date()).format("DD-MM-YYYY"),
      due_time: dayjs(new Date()).format("HH:mm:ss"),
      reminder_time: "",
      reminder_type: "",
      owner_id: null,
      owner_name: "",
      priority: null,
      description: "",
      object_name:  "Quotation",
      object_id: id,
    },
  });
  const isReminder = watch("is_reminder");

 React.useEffect(() => {
  if (activity) {
    reset({
      title: activity?.title || "",
      status: activity?.status || "",
      type_id: activity?.type_id || null,
      due_date: activity?.due_date ? dayjs(new Date(activity.due_date)) : dayjs(), 
      due_time: activity?.due_time ? dayjs(new Date(activity.due_time)) : dayjs(), 
      reminder_time: activity?.reminder_time || "",
      reminder_type: activity?.reminder_type || "",
      owner_id: activity?.owner_id || null,
      owner_name: activity?.owner || "",
      is_reminder: activity?.is_reminder || "N",
      description: activity?.description || "",
      object_name: activity?.object_name || "Quotation",
      object_id: activity?.object_id || id,
      priority: activity?.priority || 0,
    });
   setSelectedType(activity?.type_id);

  } else {

    reset({
      title: "",
      status: "",
      type_id: null,
      due_date: dayjs(),
      due_time: dayjs(),
      reminder_time: "",
      reminder_type: "",
      owner_id: null,
      owner_name: "",
      is_reminder: "N",
      description: "",
      priority: 0,
      object_name:  "Quotation",
      object_id: id,
      createdby: 1,
    });
     setSelectedType(null);
  }
}, [activity, reset]);

  useEffect(() => {
    if (activity) {
      setFormData({
        ...activity,
        is_reminder: activity.is_reminder === "Y" || activity.is_reminder === true,
        due_date: activity.due_date
          ? new Date(activity.due_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        due_time: activity.due_time || "09:00",
      });
      setSelectedType(activity.type_id);
    } else {
      setFormData((prev) => ({
        ...prev,
        title: "",
        status: "",
        is_reminder: false,
      }));
      setSelectedType(null);
    }
  }, [activity]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const onSubmit = async (data) => {
  const finalData = {
    ...data,
    type_id: selectedType,

    due_date: dayjs(data.due_date, "DD-MM-YYYY").toISOString(),
        due_time: dayjs(data.due_time, "HH:mm:ss").toISOString(),

  };
  const closeButton = document.getElementById("add_activity_close");
  try {
    if (activity) {
      await dispatch(
        updateActivities({ id: activity.id, activityData: finalData })
      ).unwrap();
    } else {
      await dispatch(addActivities(finalData)).unwrap();
    }

    closeButton?.click();
    reset(activity);
    setActivity(null);

  } catch (error) {
    closeButton?.click();
  }
};

  return (
    <div
    className="modal fade modal-padding"
    id="activity_modal"
    tabIndex="-1"
    aria-labelledby="activity_modal_label"
    aria-hidden="true"
    style={{ zIndex: 1050 }}
  >
    <div className="modal-dialog modal-dialog-centered shadow-lg modal-dialog-scrollable modal-padding" style={{ maxWidth: "750px" }}>
      <div className="modal-content shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
        {/* Enhanced Header with Gradient */}
        <div 
          className="modal-header border-0 position-relative"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "2rem 2rem 1.5rem",
            color: "white"
          }}
        >
          <div>
            <h4 className="modal-title fw-bold mb-1" id="activity_modal_label" style={{ fontSize: "1.5rem" }}>
              {activity ? "✏️ Update Activity" : "✨ Create New Activity"}
            </h4>
            <p className="mb-0 opacity-90" style={{ fontSize: "0.95rem" }}>
              {activity ? "Edit your existing activity details" : "Add a new activity to streamline your workflow"}
            </p>
          </div>
          <button
            type="button"
            id="add_activity_close"
            className="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={onClose}
            style={{
              filter: "brightness(0) invert(1)",
              transform: "scale(1.2)"
            }}
          ></button>
        </div>

        {/* Enhanced Body */}
        <div className="modal-body" style={{ padding: "2rem", backgroundColor: "#f8fafc" }}>
          <form>
            {/* Title Section */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: "16px 16px 0 0", padding: "1.25rem" }}>
                <h6 className="mb-0 fw-semibold text-dark">📝 Activity Details</h6>
              </div>
              <div className="card-body" style={{ padding: "1.25rem" }}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    Activity Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a descriptive title for your activity"
                    className="form-control form-control-lg border-0 shadow-sm"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      padding: "0.875rem 1rem",
                      fontSize: "1rem"
                    }}
                    {...register("title", {
                      required: "Title is required !",
                    })}
                  />
                  {errors.title && (
                    <div className="text-danger mt-2 small fw-medium">
                      <i className="ti ti-alert-circle me-1"></i>
                      {errors.title.message}
                    </div>
                  )}
                </div>

                {/* Enhanced Activity Type Section */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark mb-3">
                    Activity Type <span className="text-danger">*</span>
                  </label>
                  <div className="row g-3">
                    {activityTypes?.map((types) => (
                      <div key={types.id} className="col-md-6 col-lg-3">
                        <div
                          className={`card h-100 cursor-pointer transition-all ${
                            selectedType === types.id
                              ? 'border-primary shadow-lg'
                              : 'border-light shadow-sm hover:shadow-md'
                          }`}
                          style={{
                            borderRadius: "16px",
                            borderWidth: "2px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            transform: selectedType === types.id ? "translateY(-2px)" : "translateY(0)"
                          }}
                          onClick={() => setSelectedType(types.id)}
                        >
                          <div className="card-body text-center py-4">
                            <input
                              type="radio"
                              id={`activity-${types.id}`}
                              name="status"
                              value={types.id}
                              checked={selectedType === types.id}
                              className="d-none"
                            />
                            <div className="mb-3">
                              {types?.name?.includes("Calls") && (
                                <div 
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                                    selectedType === types.id ? 'bg-primary text-white' : 'bg-light text-muted'
                                  }`}
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <i className="ti ti-phone" style={{ fontSize: "1.25rem" }}></i>
                                </div>
                              )}
                              {types?.name?.includes("Emails") && (
                                <div 
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                                    selectedType === types.id ? 'bg-primary text-white' : 'bg-light text-muted'
                                  }`}
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <i className="ti ti-mail" style={{ fontSize: "1.25rem" }}></i>
                                </div>
                              )}
                              {types?.name?.includes("Task") && (
                                <div 
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                                    selectedType === types.id ? 'bg-primary text-white' : 'bg-light text-muted'
                                  }`}
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <i className="ti ti-subtask" style={{ fontSize: "1.25rem" }}></i>
                                </div>
                              )}
                              {types?.name?.includes("Meeting") && (
                                <div 
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                                    selectedType === types.id ? 'bg-primary text-white' : 'bg-light text-muted'
                                  }`}
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <i className="ti ti-user-share" style={{ fontSize: "1.25rem" }}></i>
                                </div>
                              )}
                            </div>
                            <h6 className={`mb-0 fw-semibold ${
                              selectedType === types.id ? 'text-primary' : 'text-dark'
                            }`}>
                              {types.name}
                            </h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.type_id || (!selectedType && (
                    <div className="text-danger mt-2 small fw-medium">
                      {/* Error message can be added here if needed */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheduling Section */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: "16px 16px 0 0", padding: "1.25rem" }}>
                <h6 className="mb-0 fw-semibold text-dark">🗓️ Scheduling & Status</h6>
              </div>
              <div className="card-body" style={{ padding: "1.25rem" }}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="due_date"
                      control={control}
                      rules={{ required: "Due date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control shadow-sm"
                          style={{
                            borderRadius: "12px",
                            border: "none",
                            height: "50px"
                          }}
                          value={
                            field.value
                              ? dayjs(field.value, [
                                  "DD-MM-YYYY",
                                  "YYYY-MM-DD",
                                  dayjs.ISO_8601,
                                ])
                              : null
                          }
                          format="DD-MM-YYYY"
                          onChange={(date, dateString) =>
                            field.onChange(dateString)
                          }
                        />
                      )}
                    />
                    {errors.due_date && (
                      <div className="text-danger mt-2 small fw-medium">
                        <i className="ti ti-alert-circle me-1"></i>
                        {errors.due_date.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Time <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <Controller
                        name="due_time"
                        rules={{ required: "Due Time is required !" }}
                        control={control}
                        render={({ field }) => (
                          <TimePicker
                            {...field}
                            placeholder="Select Time"
                            className="form-control shadow-sm"
                            style={{
                              borderRadius: "12px",
                              border: "none",
                              height: "50px"
                            }}
                            value={
                              field.value ? dayjs(field.value, "HH:mm:ss") : null
                            }
                            selected={field.value}
                            onChange={field.onChange}
                            dateFormat="HH:mm:ss"
                          />
                        )}
                      />
                      <i className="ti ti-clock-hour-10 position-absolute" 
                         style={{ 
                           right: "15px", 
                           top: "50%", 
                           transform: "translateY(-50%)", 
                           color: "#6c757d" 
                         }}></i>
                    </div>
                    {errors.due_time && (
                      <div className="text-danger mt-2 small fw-medium">
                        <i className="ti ti-alert-circle me-1"></i>
                        {errors.due_time.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Status <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required !" }}
                      render={({ field }) => {
                        return (
                          <Select
                            {...field}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={StatusOptions}
                            value={
                              StatusOptions?.find(
                                (option) => option.value === watch("status")
                              ) || ""
                            }
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            }
                            styles={{
                              control: (base) => ({
                                ...base,
                                border: "none",
                                borderRadius: "12px",
                                minHeight: "50px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }),
                            }}
                            getOptionLabel={(option) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: option.color || "black",
                                    display: "inline-block",
                                  }}
                                />
                                {option.label}
                              </div>
                            )}
                          />
                        );
                      }}
                    />
                    {errors.status && (
                      <div className="text-danger mt-2 small fw-medium">
                        <i className="ti ti-alert-circle me-1"></i>
                        {errors.status.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: "16px 16px 0 0", padding: "1.25rem" }}>
                <h6 className="mb-0 fw-semibold text-dark">👤 Assignment & Priority</h6>
              </div>
              <div className="card-body" style={{ padding: "1.25rem" }}>
                <div className="row g-4">
                  <div className="col-md-8">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Owner <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="owner_id"
                      control={control}
                      rules={{ required: "Owner is required !" }}
                      render={({ field }) => {
                        const selectedDeal = users?.data?.find(
                          (owner) => owner.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={users?.data?.map((i) => ({
                              label: i?.full_name,
                              value: i?.id,
                            }))}
                            value={
                              selectedDeal
                                ? {
                                    label: selectedDeal.full_name,
                                    value: selectedDeal.id,
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption.value);
                              setValue("owner_name", selectedOption.label);
                            }}
                            styles={{
                              control: (base) => ({
                                ...base,
                                border: "none",
                                borderRadius: "12px",
                                minHeight: "50px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }),
                            }}
                          />
                        );
                      }}
                    />
                    {errors.owner_id && (
                      <div className="text-danger mt-2 small fw-medium">
                        <i className="ti ti-alert-circle me-1"></i>
                        {errors.owner_id.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark mb-2">Priority</label>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => {
                        const selectedDeal = options2?.find(
                          (owner) => owner.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={options2?.map((i) => ({
                              label: i?.label,
                              value: i?.value,
                            }))}
                            value={
                              selectedDeal
                                ? {
                                    label: selectedDeal.label,
                                    value: selectedDeal.value,
                                  }
                                : null
                            }
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            }
                            styles={{
                              control: (base) => ({
                                ...base,
                                border: "none",
                                borderRadius: "12px",
                                minHeight: "50px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }),
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Enhanced Reminder Toggle */}
                <div className="mt-4 p-3 rounded-3" style={{ backgroundColor: "#f1f5f9" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1 fw-semibold text-dark">🔔 Reminder Settings</h6>
                      <small className="text-muted">Enable notifications for this activity</small>
                    </div>
                    <Controller
                      name="is_reminder"
                      control={control}
                      render={({ field }) => (
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            id="reminderSwitch"
                            className="form-check-input"
                            style={{ transform: "scale(1.2)" }}
                            {...field}
                            checked={field.value === "Y"}
                            onChange={(e) =>
                              field.onChange(e.target.checked ? "Y" : "N")
                            }
                          />
                          <label htmlFor="reminderSwitch" className="form-check-label fw-medium">
                            {field.value === "Y" ? "Enabled" : "Disabled"}
                          </label>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Enhanced Reminder Configuration */}
                {isReminder === "Y" && (
                  <div className="mt-3 p-4 border-0 rounded-3" style={{ backgroundColor: "#e0f2fe", border: "2px dashed #0288d1" }}>
                    <div className="mb-3">
                      <h6 className="text-info fw-semibold mb-2">⏰ Reminder Configuration</h6>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-dark mb-2">
                          Reminder Time <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type="number"
                            className="form-control shadow-sm"
                            placeholder="Enter time"
                            style={{
                              borderRadius: "12px",
                              border: "none",
                              height: "50px",
                              paddingLeft: "45px"
                            }}
                            {...register("reminder_type", {
                              required: "Reminder is required !",
                            })}
                          />
                          <i className="ti ti-bell-ringing position-absolute" 
                             style={{ 
                               left: "15px", 
                               top: "50%", 
                               transform: "translateY(-50%)", 
                               color: "#0288d1" 
                             }}></i>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-dark mb-2">Unit</label>
                        <Controller
                          name="reminder_time"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              options={options1}
                              value={options1?.find(
                                (option) => option.value === field.value
                              )}
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption.value)
                              }
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: "none",
                                  borderRadius: "12px",
                                  minHeight: "50px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }),
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-md-4 d-flex align-items-end">
                        <div className="alert alert-info border-0 mb-0 py-3 px-4 rounded-3" style={{ backgroundColor: "#b3e5fc" }}>
                          <small className="fw-semibold text-info mb-0">Before Due Date</small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: "16px 16px 0 0", padding: "1.25rem" }}>
                <h6 className="mb-0 fw-semibold text-dark">📄 Description</h6>
              </div>
              <div className="card-body" style={{ padding: "1.25rem" }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div style={{ borderRadius: "12px", overflow: "hidden" }}>
                      <DefaultEditor
                        className="form-control text-dark border-0 shadow-sm"
                        {...field}
                        value={field.value || ""}
                        onChange={(content) => field.onChange(content)}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="d-flex align-items-center justify-content-end gap-3 pt-3">
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn btn-lg px-4 py-2"
                style={{
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  backgroundColor: "white",
                  color: "#64748b",
                  fontWeight: "600"
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmit(onSubmit)} 
                className="btn btn-lg px-5 py-2 position-relative"
                style={{
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  minWidth: "140px"
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {activity ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {activity ? "✏️ Update" : "✨ Create"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ManageActivitiesModal;




// const ManageActivitiesModal = ({ setActivity, activity, onClose,id}) => {
//   const [selectedType, setSelectedType] = useState(null);
//   const dispatch = useDispatch()
//   const [formData, setFormData] = useState({
//     title: "",
//     status: "",
//     is_reminder: false,
//     type_id: null,
//     due_date: new Date().toISOString().split("T")[0],
//     due_time: "09:00",
//     reminder_time: "",
//     reminder_type: "",
//     owner_id: null,
//     owner_name: "",
//     priority: 0,
//     description: "",
//     object_name:  "Quotation",
//     object_id: id,
//   });
//     React.useEffect(() => {
//       dispatch(fetchActivityTypes());
//       dispatch(fetchUsers());
//     }, [dispatch]);
//   const { loading } = useSelector((state) => state?.activities);
//   const { users } = useSelector((state) => state.users);
//     const activityTypes = useSelector((state) => state.activities.activityTypes);
//   // Mock data
// //   const activityTypes = [
// //     { id: 1, name: "Calls", icon: Phone },
// //     { id: 2, name: "Emails", icon: Mail },
// //     { id: 3, name: "Task", icon: CheckSquare },
// //     { id: 4, name: "Meeting", icon: Users },
// //   ];
//   const options1 = [
//     // { value: "", label: "Select" },
//     { value: "M", label: "Minutes" },
//     { value: "H", label: "Hours" },
//   ];

//   const options2 = [
//     { value: 0, label: "Select" },
//     { value: 3, label: "High" },
//     { value: 2, label: "Normal" },
//     { value: 1, label: "Low" },
//   ];

//   const {
//     control,
//     handleSubmit,
//     register,
//     reset,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       title: "",
//       status: "",
//       is_reminder: "N",
//       type_id: null,
//       due_date: dayjs(new Date()).format("DD-MM-YYYY"),
//       due_time: dayjs(new Date()).format("HH:mm:ss"),
//       reminder_time: "",
//       reminder_type: "",
//       owner_id: null,
//       owner_name: "",
//       priority: null,
//       description: "",
//       object_name:  "Quotation",
//       object_id: id,
//     },
//   });
//   const isReminder = watch("is_reminder");

//  React.useEffect(() => {
//   if (activity) {
//     reset({
//       title: activity?.title || "",
//       status: activity?.status || "",
//       type_id: activity?.type_id || null,
//       due_date: activity?.due_date ? dayjs(new Date(activity.due_date)) : dayjs(), 
//       due_time: activity?.due_time ? dayjs(new Date(activity.due_time)) : dayjs(), 
//       reminder_time: activity?.reminder_time || "",
//       reminder_type: activity?.reminder_type || "",
//       owner_id: activity?.owner_id || null,
//       owner_name: activity?.owner_name || "",
//       is_reminder: activity?.is_reminder || "N",
//       description: activity?.description || "",
//       object_name: activity?.object_name || "Quotation",
//       object_id: activity?.object_id || id,
//       priority: activity?.priority || 0,
//     });
//    setSelectedType(activity?.type_id);

//   } else {

//     reset({
//       title: "",
//       status: "",
//       type_id: null,
//       due_date: dayjs(),
//       due_time: dayjs(),
//       reminder_time: "",
//       reminder_type: "",
//       owner_id: null,
//       owner_name: "",
//       is_reminder: "N",
//       description: "",
//       priority: 0,
//       object_name:  "Quotation",
//       object_id: id,
//       createdby: 1,
//     });
//      setSelectedType(null);
//   }
// }, [activity, reset]);

//   useEffect(() => {
//     if (activity) {
//       setFormData({
//         ...activity,
//         is_reminder: activity.is_reminder === "Y" || activity.is_reminder === true,
//         due_date: activity.due_date
//           ? new Date(activity.due_date).toISOString().split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         due_time: activity.due_time || "09:00",
//       });
//       setSelectedType(activity.type_id);
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         title: "",
//         status: "",
//         is_reminder: false,
//       }));
//       setSelectedType(null);
//     }
//   }, [activity]);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

// const onSubmit = async (data) => {
//   const finalData = {
//     ...data,
//     type_id: selectedType,

//     due_date: dayjs(data.due_date, "DD-MM-YYYY").toISOString(),
//         due_time: dayjs(data.due_time, "HH:mm:ss").toISOString(),

//   };
//   const closeButton = document.getElementById("add_activity_close");
//   try {
//     if (activity) {
//       await dispatch(
//         updateActivities({ id: activity.id, activityData: finalData })
//       ).unwrap();
//     } else {
//       await dispatch(addActivities(finalData)).unwrap();
//     }

//     closeButton?.click();
//     reset(activity);
//     setActivity(null);

//   } catch (error) {
//     closeButton?.click();
//   }
// };

//   return (
//     <div
//       className="modal fade  modal-padding"
//       id="activity_modal"
//       tabIndex="-1"
//       aria-labelledby="activity_modal_label" 
//       aria-hidden="true"
//       style={{ zIndex: 1050}}
      
//     >
//       <div className="modal-dialog modal-dialog-centered shadow-lg modal-dialog-scrollable modal-padding" style={{ maxWidth: "600px"  }}>
//         <div className="modal-content shadow rounded-3" >
//           {/* Header */}
//           <div className="modal-header" >
//             <div>
//               <h5 className="modal-title fw-bold" id="activity_modal_label">
//                 {activity ? "Update Activity" : "Create New Activity"}
//               </h5>
//               <small className="text-muted">
//                 {activity ? "Edit your existing activity" : "Add a new activity to your workflow"}
//               </small>
//             </div>
//             <button
//               type="button"
//               id="add_activity_close"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//               onClick={onClose}
//             ></button>
//           </div>

//           {/* Body */}
//           <div className="modal-body pt-2" style={{ padding: '32px' }}>
//           <form >
//           {/* <form onSubmit={handleSubmit(onSubmit)}> */}
//             <div>
//               <div className="row">
//                 <div className="col-md-12">
//                   <div className="mb-3">
//                     <label className="col-form-label">
//                       Title <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter Title"
//                       className="form-control"
//                       {...register("title", {
//                         required: "Title is required !",
//                       })}
//                     />
//                     {errors.title && (
//                       <small className="text-danger">
//                         {errors.title.message}
//                       </small>
//                     )}
//                   </div>
//                 </div>
//                 <div className="col-md-12">
//                   <div className="mb-3">
//                     <label className="col-form-label">
//                       Activity Type <span className="text-danger">*</span>
//                     </label>
//                     <ul className="radio-activity">
//                       {activityTypes?.map((types) => (
//                         <li>
//                           <div
//                             className="active-type"
//                             onClick={() => setSelectedType(types.id)}
//                           >
//                             <input
//                               type="radio"
//                               id={`activity-${types.id}`}
//                               name="status"
//                               value={types.id}
//                               checked={selectedType === types.id}
//                             />
//                             <label htmlFor="call">
//                               {types?.name?.includes("Calls") && (
//                                 <i className="ti ti-phone" />
//                               )}
//                               {types?.name?.includes("Emails") && (
//                                 <i className="ti ti-mail" />
//                               )}
//                               {types?.name?.includes("Task") && (
//                                 <i className="ti ti-subtask" />
//                               )}
//                               {types?.name?.includes("Meeting") && (
//                                 <i className="ti ti-user-share" />
//                               )}
//                               {types.name}
//                             </label>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                     {errors.type_id ||
//                       (!selectedType && (
//                         <small className="text-danger">
                          
//                         </small>
//                       ))}
//                   </div>
//                 </div>

//                 <div className="col-md-4">
//                   <div className="mb-3">
//                     <label className="col-form-label">
//                       Due Date <span className="text-danger">*</span>
//                     </label>
//                     <Controller
//                       name="due_date"
//                       control={control}
//                       rules={{ required: "Due date is required!" }}
//                       render={({ field }) => (
//                         <DatePicker
//                           {...field}
//                           className="form-control"
//                           value={
//                             field.value
//                               ? dayjs(field.value, [
//                                   "DD-MM-YYYY",
//                                   "YYYY-MM-DD",
//                                   dayjs.ISO_8601,
//                                 ])
//                               : null
//                           }
//                           format="DD-MM-YYYY"
//                           onChange={(date, dateString) =>
//                             field.onChange(dateString)
//                           }
//                         />
//                       )}
//                     />

//                     {errors.due_date && (
//                       <small className="text-danger">
//                         {errors.due_date.message}
//                       </small>
//                     )}
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <label className="col-form-label">
//                     Time <span className="text-danger">*</span>
//                   </label>
//                   <div className="mb-3 icon-form">
//                     <span className="form-icon">
//                       <i className="ti ti-clock-hour-10" />
//                     </span>
//                     <Controller
//                       name="due_time"
//                       rules={{ required: "Due Time is required !" }}
//                       control={control}
//                       render={({ field }) => (
//                         <TimePicker
//                           {...field}
//                           placeholder="Select Time"
//                           className="form-control"
//                           value={
//                             field.value ? dayjs(field.value, "HH:mm:ss") : null
//                           }
//                           selected={field.value}
//                           onChange={field.onChange}
//                           dateFormat="HH:mm:ss"
//                         />
//                       )}
//                     />
//                     {/* <input type="time" placeholder="Select Time" className="form-control datetimepicker"
//                                             {...register("due_time", {
//                                                 required: "Due Time is required !",
//                                             })} /> */}
//                     {/* <TimePicker
//                                              placeholder="Select Time"
//                                              className="form-control datetimepicker-time"
//                                              onChange={onChange}
//                                              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
//                                          /> */}
//                     {errors.due_time && (
//                       <small className="text-danger">
//                         {errors.due_time.message}
//                       </small>
//                     )}
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <label className="col-form-label">
//                     Status <span className="text-danger">*</span>
//                   </label>

//                   <Controller
//                     name="status"
//                     control={control}
//                     rules={{ required: "Status is required !" }} // Validation rule
//                     render={({ field }) => {
//                       return (
//                         <Select
//                           {...field}
//                           className="select"
//                           options={StatusOptions}
//                           classNamePrefix="react-select"
//                           value={
//                             StatusOptions?.find(
//                               (option) => option.value === watch("status")
//                             ) || ""
//                           }
//                           onChange={(selectedOption) =>
//                             field.onChange(selectedOption.value)
//                           } // Store only value
//                           getOptionLabel={(option) => (
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "8px",
//                               }}
//                             >
//                               <span
//                                 style={{
//                                   width: "10px",
//                                   height: "10px",
//                                   borderRadius: "50%",
//                                   backgroundColor: option.color || "black", // Use color property from options
//                                   display: "inline-block",
//                                 }}
//                               />
//                               {option.label}
//                             </div>
//                           )}
//                         />
//                       );
//                     }}
//                   />
//                   {errors.status && (
//                     <small className="text-danger">
//                       {errors.status.message}
//                     </small>
//                   )}
//                 </div>
              
//                 <div className="col-md-6">
//                   <div className="mb-3">
//                     <label className="col-form-label">
//                       Owner <span className="text-danger">*</span>
//                     </label>
//                     <Controller
//                       name="owner_id"
//                       control={control}
//                       rules={{ required: "Owner is required !" }} // Validation rule
//                       render={({ field }) => {
//                         const selectedDeal = users?.data?.find(
//                           (owner) => owner.id === field.value
//                         );
//                         return (
//                           <Select
//                             {...field}
//                             className="select"
//                             options={users?.data?.map((i) => ({
//                               label: i?.full_name,
//                               value: i?.id,
//                             }))}
//                             classNamePrefix="react-select"
//                             value={
//                               selectedDeal
//                                 ? {
//                                     label: selectedDeal.full_name,
//                                     value: selectedDeal.id,
//                                   }
//                                 : null
//                             } // Ensure correct default value
//                             onChange={(selectedOption) => {
//                               field.onChange(selectedOption.value);
//                               setValue("owner_name", selectedOption.label);
//                             }} // Store only value
//                           />
//                         );
//                       }}
//                     />
//                     {errors.owner_id && (
//                       <small className="text-danger">
//                         {errors.owner_id.message}
//                       </small>
//                     )}
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <div className="mb-3">
//                     <label className="col-form-label">Priority</label>
//                     <Controller
//                       name="priority"
//                       control={control}
//                       // rules={{ required: "Priority is required !" }} // Validation rule
//                       render={({ field }) => {
//                         const selectedDeal = options2?.find(
//                           (owner) => owner.value === field.value
//                         );
//                         return (
//                           <Select
//                             {...field}
//                             className="select"
//                             options={options2?.map((i) => ({
//                               label: i?.label,
//                               value: i?.value,
//                             }))}
//                             classNamePrefix="react-select"
//                             value={
//                               selectedDeal
//                                 ? {
//                                     label: selectedDeal.label,
//                                     value: selectedDeal.value,
//                                   }
//                                 : null
//                             } // Ensure correct default value
//                             onChange={(selectedOption) =>
//                               field.onChange(selectedOption.value)
//                             } // Store only value
//                           />
//                         );
//                       }}
//                     />
//                     {/* {errors.priority && (
//                       <small className="text-danger">
//                         {errors.priority.message}
//                       </small>
//                     )} */}
//                   </div>
//                 </div>
//                 <div className="col-md-12">
//                   <div className="status-toggle small-toggle-btn d-flex align-items-center justify-content-end ">
//                     <span className="me-2 label-text">Is Reminder</span>
//                     <Controller
//                       name="is_reminder"
//                       control={control}
//                       render={({ field }) => (
//                         <>
//                           <input
//                             type="checkbox"
//                             id="emailOptOut"
//                             className="check"
//                             {...field}
//                             checked={field.value === "Y"}
//                             onChange={(e) =>
//                               field.onChange(e.target.checked ? "Y" : "N")
//                             }
//                           />
//                           <label htmlFor="emailOptOut" className="checktoggle">
//                             Email Opt-Out
//                           </label>
//                         </>
//                       )}
//                     />
//                   </div>
//                 </div>
//                 {isReminder === "Y" && <div className="col-md-12 py-2 row rounded bg-soft-purple">
//                   <div className="col-md-6">
//                     <label className="col-form-label">
//                       Reminder <span className="text-danger">*</span>
//                     </label>
//                     <div className="mb-3 icon-form">
//                       <span className="form-icon">
//                         <i className="ti ti-bell-ringing" />
//                       </span>
//                       <input
//                         type="number"
//                         className="form-control"
//                         placeholder="Enter time"
//                         {...register("reminder_type", {
//                           required: "Reminder is required !",
//                         })}
//                       />
//                     </div>
//                   </div>
                
//                   <div className="col-md-6">
//                     <div className="d-flex align-items-center">
//                       <div className="mb-3 w-100">
//                         <label className="col-form-label">&nbsp;</label>
//                         <Controller
//                           name="reminder_time"
//                           control={control}
//                           render={({ field }) => (
//                             <Select
//                               {...field}
//                               className="select"
//                               options={options1}
//                               classNamePrefix="react-select"
//                               value={options1?.find(
//                                 (option) => option.value === field.value
//                               )} // Ensure default selection
//                               onChange={(selectedOption) =>
//                                 field.onChange(selectedOption.value)
//                               } // Store only value
//                             />
//                           )}
//                         />
//                       </div>
//                       <div className="mb-3 time-text">
//                         <label className="col-form-label">&nbsp;</label>
//                         <p>Before Due</p>
//                       </div>
//                     </div>
//                   </div>
                
//                 </div>}
//                 <div className="col-md-12">
//                   <div className="mb-3">
//                     <label className="col-form-label">Description</label>
//                     <Controller
//                       name="description"
//                       control={control}
//                       render={({ field }) => (
//                         <DefaultEditor
//                           className="summernote"
//                           {...field}
//                           value={field.value || ""}
//                           onChange={(content) => field.onChange(content)}
//                         />
//                       )}
//                     />
//                     {/* <DefaultEditor className="summernote"  {...register("description", {
//                                             required: "Description is required !",
//                                         })} /> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="d-flex align-items-center justify-content-end">
//               <button
//                 type="button"
//                 data-bs-dismiss="modal"
//               aria-label="Close"
//                 // data-bs-dismiss="offcanvas"
//                 className="btn btn-light me-2"
//               >
//                 Cancel
//               </button>
//               <button type="button" onClick={handleSubmit(onSubmit)} className="btn btn-primary">
//                 {activity
//                   ? loading
//                     ? " Updating..."
//                     : "Update"
//                   : loading
//                     ? "Creating..."
//                     : "Create"}
//                 {loading && (
//                   <div
//                     style={{
//                       height: "15px",
//                       width: "15px",
//                     }}
//                     className="spinner-border ml-2 text-light"
//                     role="status"
//                   >
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                 )}
//               </button>
//             </div>
//           </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

