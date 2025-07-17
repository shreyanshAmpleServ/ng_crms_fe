import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addProject, updateProject } from "../../../redux/projects";
import { DatePicker } from "antd";
import Select from "react-select";
import { arrProjectTiming } from "../../../components/common/selectoption/selectoption";
import dayjs from "dayjs";

const AddOrEditProjectModal = ({ project = null, mode = "add" }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects || {});

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      projectTiming: "",
      amount: "",
      startDate: dayjs().format("DD-MM-YYYY"),
      dueDate: dayjs().format("DD-MM-YYYY"),
      description: "",
      is_active: "Y",
    },
  });

  // 🌟 Fill form if editing
useEffect(() => {
  if (mode === "edit" && project) {
    reset({
      ...project,
      projectTiming: arrProjectTiming.find(
        (opt) => opt.value === project.projectTiming
      ) || "",
      startDate: project.startDate
        ? dayjs(project.startDate).format("DD-MM-YYYY")
        : dayjs().format("DD-MM-YYYY"),
      dueDate: project.dueDate
        ? dayjs(project.dueDate).format("DD-MM-YYYY")
        : dayjs().format("DD-MM-YYYY"),
    });
  } else {
    reset({
      name: "",
      projectTiming: "",
      amount: "",
      startDate: dayjs().format("DD-MM-YYYY"),
      dueDate: dayjs().format("DD-MM-YYYY"),
      description: "",
      is_active: "Y",
    });
  }
}, [mode, project, reset]);


  // 🌟 Reset on modal close
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add_project");
    if (offcanvasElement) {
      const handleModalClose = () => {
        reset();
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
      };
    }
  }, [reset]);

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_offcanvas_add_project");

    const payload = {
      ...data,
      startDate: dayjs(data.startDate, "DD-MM-YYYY").toISOString(),
      dueDate: dayjs(data.dueDate, "DD-MM-YYYY").toISOString(),
      projectTiming:
        typeof data.projectTiming === "object"
          ? data.projectTiming.value
          : data.projectTiming,
      amount: parseFloat(data.amount) || 0,
    };

    try {
      if (mode === "edit" && project?.id) {
        await dispatch(updateProject({ id: project.id, ...payload })).unwrap();
      } else {
        await dispatch(addProject(payload)).unwrap();
      }
      if (closeButton) closeButton.click();
      reset();
    } catch (err) {
      console.error("Error submitting project:", err);
      if (closeButton) closeButton.click();
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_project"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {mode === "edit" ? "Edit Project" : "Add New Project"}
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="close_offcanvas_add_project"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="accordion" id="project_accordion">
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">
                <button
                  type="button"
                  className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#project_basic"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-briefcase fs-20" />
                  </span>
                  Project Info
                </button>
              </div>
              <div
                className="accordion-collapse collapse show"
                id="project_basic"
                data-bs-parent="#project_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Project Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name", {
                            required: "Project name is required!",
                          })}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Project Timing</label>
                        <Controller
                          name="projectTiming"
                          control={control}
                          rules={{ required: "Project Timing is required!" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={arrProjectTiming}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                            />
                          )}
                        />
                        {errors.projectTiming && (
                          <small className="text-danger">
                            {errors.projectTiming.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Budget <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          {...register("amount", {
                            required: "Budget is required!",
                          })}
                        />
                        {errors.amount && (
                          <small className="text-danger">
                            {errors.amount.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Start Date <span className="text-danger">*</span>
                        </label>
                       <Controller
  name="startDate"
  control={control}
  rules={{ required: "Start date is required!" }}
  render={({ field }) => (
    <DatePicker
      {...field}
      className="form-control"
      value={
        field.value
          ? dayjs(field.value, ["DD-MM-YYYY", "YYYY-MM-DD", dayjs.ISO_8601])
          : null
      }
      format="DD-MM-YYYY"
      onChange={(date, dateString) => field.onChange(dateString)}
    />
  )}
/>

                        {errors.startDate && (
                          <small className="text-danger">
                            {errors.startDate.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Due Date <span className="text-danger">*</span>
                        </label>
                       <Controller
  name="dueDate"
  control={control}
  rules={{ required: "Due date is required!" }}
  render={({ field }) => (
    <DatePicker
      {...field}
      className="form-control"
      value={
        field.value
          ? dayjs(field.value, ["DD-MM-YYYY", "YYYY-MM-DD", dayjs.ISO_8601])
          : null
      }
      format="DD-MM-YYYY"
      onChange={(date, dateString) => field.onChange(dateString)}
    />
  )}
/>

                        {errors.dueDate && (
                          <small className="text-danger">
                            {errors.dueDate.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          {...register("description")}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">Status</label>
                        <div className="d-flex flex-wrap">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="active"
                              value="Y"
                              defaultChecked
                              {...register("is_active")}
                            />
                            <label htmlFor="active">Active</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="inactive"
                              value="N"
                              {...register("is_active")}
                            />
                            <label htmlFor="inactive">Inactive</label>
                          </div>
                        </div>
                      </div>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? "Saving..."
                : mode === "edit"
                ? "Update"
                : "Create"}
              {loading && (
                <div
                  style={{ height: "15px", width: "15px" }}
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
  );
};

export default AddOrEditProjectModal;
