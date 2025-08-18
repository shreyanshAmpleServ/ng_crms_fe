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
import { addActivities, updateActivities } from "../../../redux/Activities";


const ManageActivitiesModal = ({ setActivity, activity, onClose, mode = "modal" }) => {
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
    deal_id: null,
    contact_id: null,
    company_id: null,
    project_id: null,
  });
  const { loading } = useSelector((state) => state?.activities);

  // Mock data
  const activityTypes = [
    { id: 1, name: "Calls", icon: Phone },
    { id: 2, name: "Emails", icon: Mail },
    { id: 3, name: "Task", icon: CheckSquare },
    { id: 4, name: "Meeting", icon: Users },
  ];
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
  const users = [
    { id: 1, full_name: "John Doe" },
    { id: 2, full_name: "Jane Smith" },
    { id: 3, full_name: "Mike Johnson" },
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
      deal_id: null,
      contact_id: null,
      company_id: null,
      project_id: null,
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
      owner_name: activity?.owner_name || "",
      is_reminder: activity?.is_reminder || "N",
      description: activity?.description || "",
      deal_id: activity?.deal_id || null,
      contact_id: activity?.contact_id || null,
      company_id: activity?.company_id || null,
      project_id: activity?.project_id || null,
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
      deal_id: null,
      priority: 0,
      contact_id: null,
      project_id: null,
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
  const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
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
      className="modal fade  modal-padding"
      id="activity_modal"
      tabIndex="-1"
      aria-labelledby="activity_modal_label" 
      aria-hidden="true"
      style={{ zIndex: 1050 }}
      
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-padding" style={{ maxWidth: "600px" }}>
        <div className="modal-content shadow rounded-3">
          {/* Header */}
          <div className="modal-header">
            <div>
              <h5 className="modal-title fw-bold" id="activity_modal_label">
                {activity ? "Update Activity" : "Create New Activity"}
              </h5>
              <small className="text-muted">
                {activity ? "Edit your existing activity" : "Add a new activity to your workflow"}
              </small>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body pt-2" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Title"
                      className="form-control"
                      {...register("title", {
                        required: "Title is required !",
                      })}
                    />
                    {errors.title && (
                      <small className="text-danger">
                        {errors.title.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Activity Type <span className="text-danger">*</span>
                    </label>
                    <ul className="radio-activity">
                      {activityTypes?.map((types) => (
                        <li>
                          <div
                            className="active-type"
                            onClick={() => setSelectedType(types.id)}
                          >
                            <input
                              type="radio"
                              id={`activity-${types.id}`}
                              name="status"
                              value={types.id}
                              checked={selectedType === types.id}
                            />
                            <label htmlFor="call">
                              {types?.name?.includes("Calls") && (
                                <i className="ti ti-phone" />
                              )}
                              {types?.name?.includes("Emails") && (
                                <i className="ti ti-mail" />
                              )}
                              {types?.name?.includes("Task") && (
                                <i className="ti ti-subtask" />
                              )}
                              {types?.name?.includes("Meeting") && (
                                <i className="ti ti-user-share" />
                              )}
                              {types.name}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {errors.type_id ||
                      (!selectedType && (
                        <small className="text-danger">
                          
                        </small>
                      ))}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="due_date"
                      control={control}
                      rules={{ required: "Due date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
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
                      <small className="text-danger">
                        {errors.due_date.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="col-form-label">
                    Time <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="due_time"
                      rules={{ required: "Due Time is required !" }}
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          placeholder="Select Time"
                          className="form-control"
                          value={
                            field.value ? dayjs(field.value, "HH:mm:ss") : null
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="HH:mm:ss"
                        />
                      )}
                    />
                    {/* <input type="time" placeholder="Select Time" className="form-control datetimepicker"
                                            {...register("due_time", {
                                                required: "Due Time is required !",
                                            })} /> */}
                    {/* <TimePicker
                                             placeholder="Select Time"
                                             className="form-control datetimepicker-time"
                                             onChange={onChange}
                                             defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                                         /> */}
                    {errors.due_time && (
                      <small className="text-danger">
                        {errors.due_time.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>

                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required !" }} // Validation rule
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          className="select"
                          options={StatusOptions}
                          classNamePrefix="react-select"
                          value={
                            StatusOptions?.find(
                              (option) => option.value === watch("status")
                            ) || ""
                          }
                          onChange={(selectedOption) =>
                            field.onChange(selectedOption.value)
                          } // Store only value
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
                                  backgroundColor: option.color || "black", // Use color property from options
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
                    <small className="text-danger">
                      {errors.status.message}
                    </small>
                  )}
                </div>
                <div className="col-md-12">
                  <div className="status-toggle small-toggle-btn d-flex align-items-center justify-content-end ">
                    <span className="me-2 label-text">Is Reminder</span>
                    <Controller
                      name="is_reminder"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="checkbox"
                            id="emailOptOut"
                            className="check"
                            {...field}
                            checked={field.value === "Y"}
                            onChange={(e) =>
                              field.onChange(e.target.checked ? "Y" : "N")
                            }
                          />
                          <label htmlFor="emailOptOut" className="checktoggle">
                            Email Opt-Out
                          </label>
                        </>
                      )}
                    />
                  </div>
                </div>
                {isReminder === "Y" && (
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Reminder <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3 icon-form">
                      <span className="form-icon">
                        <i className="ti ti-bell-ringing" />
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter time"
                        {...register("reminder_type", {
                          required: "Reminder is required !",
                        })}
                      />
                    </div>
                  </div>
                )}
                {isReminder === "Y" && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="mb-3 w-100">
                        <label className="col-form-label">&nbsp;</label>
                        <Controller
                          name="reminder_time"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="select"
                              options={options1}
                              classNamePrefix="react-select"
                              value={options1?.find(
                                (option) => option.value === field.value
                              )} // Ensure default selection
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption.value)
                              } // Store only value
                            />
                          )}
                        />
                      </div>
                      <div className="mb-3 time-text">
                        <label className="col-form-label">&nbsp;</label>
                        <p>Before Due</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Owner <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="owner_id"
                      control={control}
                      rules={{ required: "Owner is required !" }} // Validation rule
                      render={({ field }) => {
                        const selectedDeal = users?.data?.find(
                          (owner) => owner.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={users?.data?.map((i) => ({
                              label: i?.full_name,
                              value: i?.id,
                            }))}
                            classNamePrefix="react-select"
                            value={
                              selectedDeal
                                ? {
                                    label: selectedDeal.full_name,
                                    value: selectedDeal.id,
                                  }
                                : null
                            } // Ensure correct default value
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption.value);
                              setValue("owner_name", selectedOption.label);
                            }} // Store only value
                          />
                        );
                      }}
                    />
                    {errors.owner_id && (
                      <small className="text-danger">
                        {errors.owner_id.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">Priority</label>
                    <Controller
                      name="priority"
                      control={control}
                      // rules={{ required: "Priority is required !" }} // Validation rule
                      render={({ field }) => {
                        const selectedDeal = options2?.find(
                          (owner) => owner.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={options2?.map((i) => ({
                              label: i?.label,
                              value: i?.value,
                            }))}
                            classNamePrefix="react-select"
                            value={
                              selectedDeal
                                ? {
                                    label: selectedDeal.label,
                                    value: selectedDeal.value,
                                  }
                                : null
                            } // Ensure correct default value
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            } // Store only value
                          />
                        );
                      }}
                    />
                    {/* {errors.priority && (
                      <small className="text-danger">
                        {errors.priority.message}
                      </small>
                    )} */}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">Description</label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <DefaultEditor
                          className="summernote"
                          {...field}
                          value={field.value || ""}
                          onChange={(content) => field.onChange(content)}
                        />
                      )}
                    />
                    {/* <DefaultEditor className="summernote"  {...register("description", {
                                            required: "Description is required !",
                                        })} /> */}
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
              <button type="submit" className="btn btn-primary">
                {activity
                  ? loading
                    ? " Updating..."
                    : "Update"
                  : loading
                    ? "Creating..."
                    : "Create"}
                {loading && (
                  <div
                    style={{
                      height: "15px",
                      width: "15px",
                    }}
                    className="spinner-border ml-2 text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
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
